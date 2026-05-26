// QUIZ CONFIGURATION
const questions = [
    {
        id: 1,
        text: "How do you feel most of the time?",
        options: [
            { text: "😰 Anxious or tense", points: 2 },
            { text: "😵 Mentally exhausted", points: 2 },
            { text: "😐 Normal, but overwhelmed", points: 1 },
            { text: "😊 Balanced", points: 0 }
        ]
    },
    {
        id: 2,
        text: "Does your body often show physical signs of stress?",
        options: [
            { text: "Yes, often (tension, pain, racing heart)", points: 2 },
            { text: "Sometimes", points: 1 },
            { text: "Rarely", points: 0 },
            { text: "Never", points: 0 }
        ]
    },
    {
        id: 3,
        text: "Can you easily 'turn off' your mind?",
        options: [
            { text: "Never", points: 2 },
            { text: "Almost never", points: 1 },
            { text: "Sometimes", points: 1 },
            { text: "Yes, easily", points: 0 }
        ]
    },
    {
        id: 4,
        text: "How is your sleep currently?",
        options: [
            { text: "Bad, I wake up tired", points: 2 },
            { text: "Irregular", points: 1 },
            { text: "Okay, but could improve", points: 1 },
            { text: "Good and restorative", points: 0 }
        ]
    },
    {
        id: 5,
        text: "Have you tried any of these solutions?",
        options: [
            { text: "Meditation", points: 1 },
            { text: "Yoga", points: 1 },
            { text: "Therapy", points: 1 },
            { text: "None really worked", points: 2 }
        ],
        multiple: true
    },
    {
        id: 6,
        text: "When anxiety hits, you:",
        options: [
            { text: "Feel out of control", points: 2 },
            { text: "Try to breathe or calm down", points: 1 },
            { text: "Distract yourself", points: 1 },
            { text: "Can control it well", points: 0 }
        ]
    },
    {
        id: 7,
        text: "Do you feel like you live in 'alert mode'?",
        options: [
            { text: "Yes, all the time", points: 2 },
            { text: "Often", points: 1 },
            { text: "Sometimes", points: 1 },
            { text: "No", points: 0 }
        ]
    },
    {
        id: 8,
        text: "What do you most want to resolve today?",
        options: [
            { text: "Stop anxiety", points: 1 },
            { text: "Have peace of mind", points: 1 },
            { text: "Sleep better", points: 1 },
            { text: "Feel light again", points: 1 }
        ]
    }
];

// APPLICATION STATE
let currentQuestionIndex = 0;
let totalScore = 0;
let userAnswers = [];

// DOM ELEMENTS
const pages = document.querySelectorAll('.page');
const questionContainer = document.getElementById('quiz-container');
const questionTitle = document.querySelector('.question-title');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');

// NAVIGATION FUNCTIONS
function nextPage(pageNumber) {
    // Pause all videos before navigating away
    document.querySelectorAll('video').forEach(vid => {
        vid.pause();
    });

    // Hide all pages
    pages.forEach(p => {
        p.classList.remove('active');
        setTimeout(() => p.style.display = 'none', 400);
    });

    // Show target page
    const targetPage = document.getElementById(`page-${pageNumber}`) || questionContainer;
    
    setTimeout(() => {
        targetPage.style.display = 'block';
        setTimeout(() => targetPage.classList.add('active'), 50);
        
        if (pageNumber === 2) {
            renderQuestion();
        }
        
        // Autoplay logic for video pages
        if (pageNumber === 16) {
            const vslVideo = document.getElementById('vsl-video');
            if(vslVideo) vslVideo.play().catch(e => console.log("Autoplay prevented:", e));
        }
        if (pageNumber === 17) {
            const finalVideo = document.getElementById('final-video');
            if(finalVideo) finalVideo.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, 400);
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    
    // Update Progress
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progressPercent.innerText = `${Math.round(progress)}%`;

    // Render Question and Options
    questionTitle.innerText = q.text;
    
    let multiHtml = q.multiple ? '<p class="multi-instruction">Select all options that apply</p>' : '';
    optionsGrid.innerHTML = multiHtml;

    const selectedOptions = new Set();

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${opt.text}</span>`;
        
        btn.onclick = () => {
            if (q.multiple) {
                if (selectedOptions.has(idx)) {
                    selectedOptions.delete(idx);
                    btn.classList.remove('selected');
                } else {
                    selectedOptions.add(idx);
                    btn.classList.add('selected');
                }
                
                let contBtn = document.getElementById('continue-btn');
                if (selectedOptions.size > 0) {
                    if (!contBtn) {
                        contBtn = document.createElement('button');
                        contBtn.id = 'continue-btn';
                        contBtn.className = 'btn-primary';
                        contBtn.style.marginTop = '2rem';
                        contBtn.innerText = 'CONTINUE →';
                        contBtn.onclick = () => {
                            let totalPoints = 0;
                            selectedOptions.forEach(i => totalPoints += q.options[i].points);
                            selectOption(totalPoints);
                        };
                        optionsGrid.appendChild(contBtn);
                    }
                } else if (contBtn) {
                    contBtn.remove();
                }
            } else {
                selectOption(opt.points);
            }
        };
        optionsGrid.appendChild(btn);
    });
}

function selectOption(points) {
    totalScore += points;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        startTransition();
    }
}

function startTransition() {
    nextPage('transition');
    const transitionText = document.getElementById('transition-text');
    
    const counter = document.createElement('div');
    counter.id = 'analysis-counter';
    counter.style.fontSize = '3rem';
    counter.style.fontWeight = '700';
    counter.style.fontFamily = 'Inter, sans-serif';
    counter.style.color = 'var(--primary)';
    counter.style.margin = '1rem 0';
    counter.innerText = '0%';
    transitionText.parentNode.insertBefore(counter, transitionText);

    const steps = [
        "Analyzing your answers...",
        "Cross-referencing with 3,000+ profiles...",
        "Identifying physiological patterns...",
        "Generating your customized protocol...",
        "Your result is ready!"
    ];

    let stepIdx = 0;
    let count = 0;
    
    const textInterval = setInterval(() => {
        if (stepIdx < steps.length) {
            transitionText.innerText = steps[stepIdx];
            stepIdx++;
        }
    }, 1200);

    const counterInterval = setInterval(() => {
        if (count < 100) {
            count += Math.floor(Math.random() * 5) + 1;
            if (count > 100) count = 100;
            counter.innerText = `${count}%`;
        } else {
            clearInterval(counterInterval);
            clearInterval(textInterval);
            setTimeout(showResult, 500);
        }
    }, 100);
}

const resultDetails = {
    alerta: {
        status: "🔴 Constant Alert",
        diagnosis: "Your defense system is activated almost all the time. Your body reacts as if it's in danger... even when there is no real threat.",
        symptoms: ["Racing thoughts", "Tiredness that sleep doesn't fix", "Constant mild irritation", "Difficulty unwinding"],
        break: "<p>This is not laziness. And it's not emotional weakness either.</p><p class='highlight-italic'>→ Your body just hasn't learned how to exit the alert state yet.</p>",
        concept: "<p>Resting is not stopping.</p><p class='highlight-italic'>👉 It's an internal state of the body.</p>",
        video: "alerta_constante.MOV"
    },
    sobrecarga: {
        status: "🟠 Silent Overload",
        diagnosis: "Your emotional system is not in constant crisis... but it's not balanced either. You are functioning — but accumulating tension.",
        symptoms: ["Frequent tiredness", "Feeling of mental heaviness", "Lack of energy throughout the day", "Difficulty relaxing completely"],
        break: "<p>This is not just a heavy routine.</p><p class='highlight-italic'>👉 It's an accumulation your body hasn't been able to release yet.</p>",
        concept: "<p>The problem is not how much you do.</p><p class='highlight-italic'>👉 It's how much your body can recover.</p>",
        video: "overload.MOV"
    },
    desequilibrio: {
        status: "🟢 Occasional Imbalance",
        diagnosis: "Your emotional system alternates between balance and instability. You have moments of calm... but can't sustain it consistently.",
        symptoms: ["Good days and hard days with no clear explanation", "Energy swings", "Moments of occasional anxiety", "Feeling of emotional instability"],
        break: "<p>This is not a lack of control.</p><p class='highlight-italic'>👉 It's a lack of consistency in your system's functioning.</p>",
        concept: "<p>Calmness cannot depend on the day.</p><p class='highlight-italic'>👉 It must be sustained.</p>",
        video: "desequilibrio_emocional.MOV"
    }
};

function showResult() {
    let data;
    
    if (totalScore >= 11) {
        data = resultDetails.alerta;
    } else if (totalScore >= 6) {
        data = resultDetails.sobrecarga;
    } else {
        data = resultDetails.desequilibrio;
    }

    document.getElementById('result-status').innerText = data.status;
    document.getElementById('final-score').innerText = totalScore;
    document.getElementById('result-badge-text').innerText = data.status.replace(/[^a-zA-Záàâãéèêíïóôõöúçñ\s]/g, '').trim().toUpperCase();
    
    document.getElementById('result-diagnosis-text').innerText = data.diagnosis;
    
    const symptomsList = document.getElementById('result-symptoms-list');
    symptomsList.innerHTML = data.symptoms.map(s => `<li>${s}</li>`).join('');
    
    document.getElementById('result-belief-break').innerHTML = data.break;
    document.getElementById('result-concept-text').innerHTML = data.concept;

    // Populate VSL and Checkout data
    document.getElementById('vsl-badge-status').innerText = data.status.replace(/[^a-zA-Záàâãéèêíïóôõöúçñ\s]/g, '').trim().toUpperCase();
    document.getElementById('vsl-score-val').innerText = totalScore;
    
    const checkoutStatusEl = document.getElementById('checkout-status');
    if(checkoutStatusEl) {
        checkoutStatusEl.innerText = data.status.replace(/[^a-zA-Záàâãéèêíïóôõöúçñ\s]/g, '').trim();
    }
    
    const videoEl = document.getElementById('vsl-video');
    const videoSource = document.getElementById('vsl-video-source');
    const videoPlaceholder = document.getElementById('vsl-video-placeholder');
    
    if (data.video) {
        videoSource.src = data.video;
        videoEl.load();
        videoEl.style.display = 'block';
        if(videoPlaceholder) videoPlaceholder.style.display = 'none';
    } else {
        videoEl.style.display = 'none';
        if(videoPlaceholder) videoPlaceholder.style.display = 'block';
    }
    
    nextPage('result');
}

function handleLead(event) {
    event.preventDefault();
    console.log("Lead captured:", {
        name: document.getElementById('name').value,
        whatsapp: document.getElementById('whatsapp').value,
        score: totalScore
    });
    
    nextPage('bonus');
    
    setTimeout(() => {
        nextPage('redirect');
    }, 8000);
}

// VIDEO UNMUTE & BLUR LOGIC
function unmuteVideo(videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    
    if (video && overlay) {
        video.muted = false;       // Tira o mudo
        video.currentTime = 0;     // Reinicia do começo
        video.classList.remove('blurred-video'); // Remove o blur
        overlay.style.display = 'none'; // Some com o botão
        video.play().catch(e => console.log("Play failed:", e));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
});
