// Timer variables
let timeRemaining = 15 * 60; // 15 minutes in seconds for MCQ
let fillInTimeRemaining = 30 * 60; // 30 minutes in seconds for Fill-in-Blanks
let timerInterval;
let fiveMinuteWarningShown = false;
let timerStarted = false;
let timerPaused = false;
let currentTimerType = 'mcq'; // 'mcq' or 'fillin'

// Smooth scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Tab switching functionality
function switchTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target.closest('.tab-button');
    if (clickedButton) {
        clickedButton.classList.add('active');
        
        // Create sparkle effect on tab switch
        createTabSparkles(clickedButton);
    }
    
    // Show/hide timer based on tab and switch timer type
    const timerDisplay = document.querySelector('.timer-display');
    if (timerDisplay) {
        if (tabId === 'mcq-section') {
            currentTimerType = 'mcq';
            timerDisplay.style.display = 'flex';
            updateTimerForCurrentTab();
        } else if (tabId === 'fill-in-blanks') {
            currentTimerType = 'fillin';
            timerDisplay.style.display = 'flex';
            updateTimerForCurrentTab();
        } else {
            timerDisplay.style.display = 'none';
        }
    }
    
    // Scroll to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Create sparkle effect for tab switching
function createTabSparkles(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        sparkle.style.background = '#4ade80';
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Initialize animations when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Animate header on load
    const header = document.querySelector('header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        header.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 200);

    // Setup card animations for both fill-in and MCQ cards
    const cards = document.querySelectorAll('.herb-card, .mcq-card');
    cards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add input focus animations for text inputs
        const input = card.querySelector('input[type="text"]');
        if (input) {
            input.addEventListener('focus', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            });
            
            input.addEventListener('blur', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            });

            input.addEventListener('input', (e) => {
                if (e.target.value.length > 0) {
                    card.classList.add('has-content');
                } else {
                    card.classList.remove('has-content');
                }
            });
        }

        // Add radio button selection animations for MCQ cards
        const radioInputs = card.querySelectorAll('input[type="radio"]');
        if (radioInputs.length > 0) {
            radioInputs.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        card.classList.add('has-selection');
                        createSparkles(radio.closest('.mcq-option'));
                    }
                });
            });
        }
    });

    // Floating particles animation
    createFloatingParticles();
    
    // Progress indicator
    createProgressIndicator();
    
    // Create timer display (ld hidden
    createTimerDisplay();
    const timerDisplay = docoment.quenySelectos('.timtr-display');
    if (tmerDDisplas) {
        timerDisplay.styll.displayay =nomeen
    }t.querySelector('.timer-display');
    if (timerDisplay) {
        timerDisplay.style.display = 'none';
    }
});

// Timer functions
function toggleTimer() {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
        timerPaused = false;
    } else if (timerPaused) {
        resumeTimer();
        timerPaused = false;
    } else {
        pauseTimer();
        timerPaused = true;
    }
    updateTimerButton();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (currentTimerType === 'mcq') {
            timeRemaining--;
            updateTimerDisplay();
            
            // 5 minute warning for MCQ
            if (timeRemaining === 5 * 60 && !fiveMinuteWarningShown) {
                showFiveMinuteWarning();
                fiveMinuteWarningShown = true;
            }
            
            // Time's up for MCQ
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                showTimeUpPopup();
            }
        } else if (currentTimerType === 'fillin') {
            fillInTimeRemaining--;
            updateTimerDisplay();
            
            // 5 minute warning for Fill-in-Blanks
            if (fillInTimeRemaining === 5 * 60 && !fiveMinuteWarningShown) {
                showFiveMinuteWarning();
                fiveMinuteWarningShown = true;
            }
            
            // Time's up for Fill-in-Blanks
            if (fillInTimeRemaining <= 0) {
                clearInterval(timerInterval);
                showTimeUpPopup();
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resumeTimer() {
    startTimer();
}

function createTimerDisplay() {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.innerHTML = `
        <span class="timer-icon">⏰</span>
        <span class="timer-text">30:00</span>
        <button class="timer-button" onclick="toggleTimer()">
            <span class="button-icon">▶️</span>
            <span class="button-text">Start</span>
        </button>
    `;
    document.body.appendChild(timerDisplay);
}

function updateTimerDisplay() {
    const timerText = document.querySelector('.timer-text');
    
    if (timerText) {
        let minutes, seconds, currentTime;
        
        if (currentTimerType === 'mcq') {
            minutes = Math.floor(timeRemaining / 60);
            seconds = timeRemaining % 60;
            currentTime = timeRemaining;
        } else if (currentTimerType === 'fillin') {
            minutes = Math.floor(fillInTimeRemaining / 60);
            seconds = fillInTimeRemaining % 60;
            currentTime = fillInTimeRemaining;
        }
        
        timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        const timerDisplay = document.querySelector('.timer-display');
        if (currentTime <= 5 * 60) {
            timerDisplay.classList.add('warning');
        }
        if (currentTime <= 1 * 60) {
            timerDisplay.classList.add('critical');
        }
    }
}

function updateTimerButton() {
    const buttonIcon = document.querySelector('.button-icon');
    const buttonText = document.querySelector('.button-text');
    
    if (!timerStarted) {
        buttonIcon.textContent = '▶️';
        buttonText.textContent = 'Start';
    } else if (timerPaused) {
        buttonIcon.textContent = '▶️';
        buttonText.textContent = 'Resume';
    } else {
        buttonIcon.textContent = '⏸️';
        buttonText.textContent = 'Pause';
    }
}

function showFiveMinuteWarning() {
    const warningPopup = document.createElement('div');
    warningPopup.className = 'warning-popup';
    warningPopup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">⚠️</div>
            <h2>5 Minutes Left Princess!</h2>
            <p>Hurry up! You're doing great! 💪</p>
            <button onclick="closeWarningPopup()" class="popup-button">Got it!</button>
        </div>
    `;
    document.body.appendChild(warningPopup);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (document.querySelector('.warning-popup')) {
            closeWarningPopup();
        }
    }, 3000);
}

function showTimeUpPopup() {
    const timeUpPopup = document.createElement('div');
    timeUpPopup.className = 'timeup-popup';
    timeUpPopup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">👑</div>
            <h2>Time's Up Princess!</h2>
            <p>You did your best! 🌟</p>
            <div class="popup-buttons">
                <button onclick="restartQuiz()" class="popup-button primary">Try Again</button>
                <button onclick="reviewAnswers()" class="popup-button">Review Answers</button>
            </div>
        </div>
    `;
    document.body.appendChild(timeUpPopup);
    
    // Disable all inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);
}

function closeWarningPopup() {
    const popup = document.querySelector('.warning-popup');
    if (popup) {
        popup.remove();
    }
}

function restartQuiz() {
    location.reload();
}

function reviewAnswers() {
    const popup = document.querySelector('.timeup-popup');
    if (popup) {
        popup.remove();
    }
    
    // Scroll to top to review
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Create floating particles
function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particleContainer.appendChild(particle);
    }
}

// Create progress indicator
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressFill.style.width = scrollPercent + '%';
    });
}

// Smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add sparkle effect on input focus
document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT') {
        createSparkles(e.target);
    }
});

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        // Different colors for MCQ sparkles
        const colors = ['#3b82f6', '#1d4ed8', '#60a5fa'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// MCQ functionality
function submitMCQ() {
    // Show confirmation popup first
    showSubmitConfirmation();
}

function showSubmitConfirmation() {
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'warning-popup';
    confirmPopup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">👑</div>
            <h2>Are you sure you want to submit Princess 😍?</h2>
            <p>Once submitted, you won't be able to change your answers!</p>
            <div class="popup-buttons">
                <button onclick="confirmSubmit()" class="popup-button primary">Yes, Submit!</button>
                <button onclick="closeConfirmPopup()" class="popup-button">No, Let me review</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmPopup);
}

function confirmSubmit() {
    // Close the confirmation popup
    closeConfirmPopup();
    
    // Proceed with the original submit logic
    processSubmission();
}

function closeConfirmPopup() {
    const popup = document.querySelector('.warning-popup');
    if (popup) {
        popup.remove();
    }
}

function processSubmission() {
    const correctAnswers = {
        'q1': 'a', 'q2': 'b', 'q3': 'c', 'q4': 'b', 'q5': 'b', 'q6': 'a', 'q7': 'b', 'q8': 'b', 'q9': 'b', 'q10': 'b',
        'q11': 'a', 'q12': 'a', 'q13': 'b', 'q14': 'a', 'q15': 'b', 'q16': 'a', 'q17': 'a', 'q18': 'a', 'q19': 'a', 'q20': 'a',
        'q21': 'a', 'q22': 'a', 'q23': 'a', 'q24': 'a', 'q25': 'a', 'q26': 'a', 'q27': 'a', 'q28': 'a', 'q29': 'a', 'q30': 'a',
        'q31': 'a', 'q32': 'a', 'q33': 'a', 'q34': 'a', 'q35': 'a', 'q36': 'a', 'q37': 'a', 'q38': 'a', 'q39': 'a', 'q40': 'a',
        'q41': 'a', 'q42': 'a', 'q43': 'a', 'q44': 'a', 'q45': 'a', 'q46': 'a', 'q47': 'a', 'q48': 'a', 'q49': 'a', 'q50': 'a',
        'q51': 'a', 'q52': 'a', 'q53': 'a', 'q54': 'a', 'q55': 'a', 'q56': 'a', 'q57': 'a', 'q58': 'a', 'q59': 'a', 'q60': 'a',
    };

    const questions = [
        'What is the botanical name of Amalaki?', 'What is the botanical name of Aragwadha?', 'What is the botanical name of Arjuna?',
        'What is the botanical name of Ashoka?', 'What is the botanical name of Ashwagandha?', 'What is the botanical name of Ativisha?',
        'What is the botanical name of Bala?', 'What is the botanical name of Beejaka?', 'What is the botanical name of Bhallataka?',
        'What is the botanical name of Bhrungaraj?', 'What is the botanical name of Bhrumyamalaki?', 'What is the botanical name of Bilva?',
        'What is the botanical name of Brahmi?', 'What is the botanical name of Chandana?', 'What is the botanical name of Chitraka?',
        'What is the botanical name of Dadima?', 'What is the botanical name of Dhataki?', 'What is the botanical name of Dhanasa?',
        'What is the botanical name of Eranda?', 'What is the botanical name of Gokshura?', 'What is the botanical name of Guduchi?',
        'What is the botanical name of Guggulu?', 'What is the botanical name of Haridra?', 'What is the botanical name of Haritaki?',
        'What is the botanical name of Hingu?', 'What is the botanical name of Jambu?', 'What is the botanical name of Jatamansi?',
        'What is the botanical name of Jyotishmati?', 'What is the botanical name of Kanchanara?', 'What is the botanical name of Kantakari?',
        'What is the botanical name of Kapikachhu?', 'What is the botanical name of Karkatshringi?', 'What is the botanical name of Katuki?',
        'What is the botanical name of Khadira?', 'What is the botanical name of Kumari?', 'What is the botanical name of Kutaja?',
        'What is the botanical name of Latakaranja?', 'What is the botanical name of Lodhra?', 'What is the botanical name of Agnimanth?',
        'What is the botanical name of Lajjalu?', 'What is the botanical name of Ahiphena?', 'What is the botanical name of Ajmoda?',
        'What is the botanical name of Apamarga?', 'What is the botanical name of Asthishrunkhala?', 'What is the botanical name of Bruhati?',
        'What is the botanical name of Chakramarda?', 'What is the botanical name of Dhanyaka?', 'What is the botanical name of Ela?',
        'What is the botanical name of Gambhari?', 'What is the botanical name of Japa?', 'What is the botanical name of Jaiphala?',
        'What is the botanical name of Jeeraka?', 'What is the botanical name of Kallamegha?', 'What is the botanical name of Kampillaka?',
        'What is the botanical name of Kulatha?', 'What is the botanical name of Kunkum?', 'What is the botanical name of Kushta?',
        'What is the botanical name of Kusumbha?', 'What is the botanical name of Lavanga?', 'Mai apko kasa Lagta hun😅'
    ];

    const correctAnswerTexts = {
        'q1': 'Emblica officinalis', 'q2': 'Cassia fistula', 'q3': 'Terminalia arjuna', 'q4': 'Saraca asoca', 'q5': 'Withania somnifera',
        'q6': 'Aconitum heterophyllum', 'q7': 'Sida cordifolia', 'q8': 'Pterocarpus marsupium', 'q9': 'Semecarpus anacardium', 'q10': 'Eclipta alba',
        'q11': 'Phyllanthus urinaria', 'q12': 'Aegle marmelos', 'q13': 'Bacopa monnieri', 'q14': 'Santalum album', 'q15': 'Plumbago zeylanica',
        'q16': 'Punica granatum', 'q17': 'Woodfordia fruticosa', 'q18': 'Fagonia cretica', 'q19': 'Ricinus communis', 'q20': 'Tribulus terrestris',
        'q21': 'Tinospora cordifolia', 'q22': 'Commiphora mukul', 'q23': 'Curcuma longa', 'q24': 'Terminalia chebula', 'q25': 'Ferula asafoetida',
        'q26': 'Syzygium cumini', 'q27': 'Nardostachys jatamansi', 'q28': 'Celastrus paniculatus', 'q29': 'Bauhinia variegata', 'q30': 'Solanum xanthocarpum',
        'q31': 'Mucuna pruriens', 'q32': 'Pistacia integerrima', 'q33': 'Picrorhiza kurroa', 'q34': 'Acacia catechu', 'q35': 'Aloe vera',
        'q36': 'Holarrhena antidysenterica', 'q37': 'Caesalpinia crista', 'q38': 'Symplocos racemosa', 'q39': 'Premna mucronata', 'q40': 'Mimosa pudica',
        'q41': 'Papaver somniferum', 'q42': 'Apium graveolens', 'q43': 'Achyranthes aspera', 'q44': 'Cissus quadrangularis', 'q45': 'Solanum indicum',
        'q46': 'Cassia tora', 'q47': 'Coriandrum sativum', 'q48': 'Elettaria cardamomum', 'q49': 'Gmelina arborea', 'q50': 'Hibiscus rosa-sinensis',
        'q51': 'Myristica fragrans', 'q52': 'Cuminum cyminum', 'q53': 'Andrographis paniculata', 'q54': 'Mallotus philippensis', 'q55': 'Macrotyloma uniflorum',
        'q56': 'Crocus sativus', 'q57': 'Saussurea lappa', 'q58': 'Carthamus tinctorius', 'q59': 'Syzygium aromaticum' , 'q60': 'Gentleman'
    };

    let score = 0;
    let results = [];

    // Check each question
    for (let i = 1; i <= 60; i++) {
        const questionName = `q${i}`;
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
        const isCorrect = selectedAnswer && selectedAnswer.value === correctAnswers[questionName];
        
        if (isCorrect) {
            score++;
        }

        results.push({
            question: questions[i-1],
            selected: selectedAnswer ? selectedAnswer.nextElementSibling.textContent : 'Not answered',
            correct: correctAnswerTexts[questionName],
            isCorrect: isCorrect,
            wasAnswered: selectedAnswer !== null
        });
    }

    // Display results
    displayResults(score, results);
    
    // Scroll to results
    document.getElementById('mcq-results').scrollIntoView({ behavior: 'smooth' });
    
    // Create celebration effect
    if (score >= 47) {
        createCelebrationEffect();
    }
}

function displayResults(score, results) {
    const resultsSection = document.getElementById('mcq-results');
    const scoreValue = document.getElementById('score-value');
    const answerBreakdown = document.getElementById('answer-breakdown');

    // Update score
    scoreValue.textContent = score;

    // Add celebration message based on score
    const celebrationMessage = getCelebrationMessage(score);
    
    // Insert celebration message before answer breakdown
    const existingCelebration = resultsSection.querySelector('.celebration-message');
    if (existingCelebration) {
        existingCelebration.remove();
    }
    
    const celebrationDiv = document.createElement('div');
    celebrationDiv.className = 'celebration-message';
    celebrationDiv.innerHTML = celebrationMessage;
    resultsSection.insertBefore(celebrationDiv, answerBreakdown);

    // Clear previous results
    answerBreakdown.innerHTML = '';

    // Add each result
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        
        resultItem.innerHTML = `
            <div class="result-question">${index + 1}. ${result.question}</div>
            <div class="result-answer">
                <span class="result-status">${result.isCorrect ? '✅' : '❌'}</span>
                <span class="result-text">
                    Your answer: <span class="${result.isCorrect ? 'correct-answer' : 'incorrect-answer'}">${result.selected}</span>
                </span>
            </div>
            ${!result.isCorrect ? `<div class="result-answer">
                <span class="result-status">✓</span>
                <span class="result-text">Correct answer: <span class="correct-answer">${result.correct}</span></span>
            </div>` : ''}
        `;
        
        answerBreakdown.appendChild(resultItem);
    });

    // Show results section
    resultsSection.style.display = 'block';
    
    // Create celebration effect for high scores
    if (score >= 35) {
        createCelebrationEffect();
    }
}

function getCelebrationMessage(score) {
    if (score >= 50) {
        return `
            <div class="celebration-content high-score">
                <div class="celebration-icon">🎉👑✨</div>
                <h3>Wow! You are Amazing Princess! 💖</h3>
                <p>Now you can Top in Exam! 🏆🌟💫</p>
            </div>
        `;
    } else if (score >= 35) {
        return `
            <div class="celebration-content good-score">
                <div class="celebration-icon">🎊💕🌸</div>
                <h3>Amazing Cutie! You did amazing! 😍</h3>
                <p>Keep up the great work! 💪✨</p>
            </div>
        `;
    } else {
        return `
            <div class="celebration-content average-score">
                <div class="celebration-icon">🌟💖🌺</div>
                <h3>Keep it up! Princess! 👸</h3>
                <p>You're doing great! Keep practicing! 💕</p>
            </div>
        `;
    }
}

function createCelebrationEffect() {
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.background = '#4ade80';
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

function updateTimerForCurrentTab() {
    const timerText = document.querySelector('.timer-text');
    if (timerText) {
        if (currentTimerType === 'mcq') {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else if (currentTimerType === 'fillin') {
            const minutes = Math.floor(fillInTimeRemaining / 60);
            const seconds = fillInTimeRemaining % 60;
            timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    // Reset timer states when switching tabs
    if (timerStarted) {
        clearInterval(timerInterval);
        timerStarted = false;
        timerPaused = false;
        fiveMinuteWarningShown = false;
        updateTimerButton();
    }
}

function showSpecialNote() {
    const notePopup = document.createElement('div');
    notePopup.className = 'warning-popup';
    notePopup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">📝✨</div>
            <h2>Special Note from SuryaDEV☺️ </h2>
            <p>Aaraam se karna, Princess 👑
Bas apne aap par  bharosa rakhna — baaki aap to hoshiyar ho hi 😌
Ye chhota sa quiz banaya hai aapke liye 😍💫<br>
–- Regards from Suryadev Rana ✨</p>
            <button onclick="closeSpecialNote()" class="popup-button">Got it! 💪</button>
        </div>
    `;
    document.body.appendChild(notePopup);
}

function closeSpecialNote() {
    const popup = document.querySelector('.warning-popup');
    if (popup) {
        popup.remove();
    }
}
