// Jade - start
let isPaused = false;

let startTime = null;
let elapsedTime = 0;
let timerId = null;

let flippedCards = [];
let matchedPairs = 0;
let movements = 0;

let rows, columns, pairs;

window.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    if (!currentPage.includes("index.html")) {
        const level = sessionStorage.getItem("gameDifficulty");
        if (level) {
            initGame();
            startTimer();
        }
    }
});

//======= playing game - start ======
function flipCard() {
    if (flippedCards.includes(this)) return;

    if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
        // Play click sound
        if (audioSettings.soundEnabled) {
            const clickSound = new Audio('../Audio/clickselect.mp3');
            clickSound.volume = audioSettings.soundVolume / 100;
            clickSound.play().catch(e => console.log('Audio playback prevented'));
        }

        this.classList.add("flipped");
        // this.querySelector('.card-back-emoji').style.visibility = "visible";
        // this.querySelector('.card-front').style.visibility = "hidden";

        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    movements++;
    document.getElementById('moves').textContent = movements;

    let isMatch = true;

    for (let i = 1; i < flippedCards.length; i++) {
        if (flippedCards[i].dataset.emoji !== flippedCards[0].dataset.emoji) {
            isMatch = false;
            break;
        }
    }

    if (isMatch) {
        matchedPairs++;
        document.getElementById('pairs').textContent = matchedPairs + '/' + pairs;

        if (audioSettings.soundEnabled) {
            const correctSound = new Audio('../Audio/correct.mp3');
            correctSound.volume = audioSettings.soundVolume / 100;
            correctSound.play().catch(e => console.log('Audio playback prevented'));
        }

        const message = characterMessages[Math.floor(Math.random() * characterMessages.length)];
        messageText.textContent = message;
        messageBubble.classList.remove('hidden');

        setTimeout(() => {
            messageBubble.classList.add('hidden');
        }, 3000);

        if (matchedPairs === pairs) {
            endGame();
        }
    } else {
        if (audioSettings.soundEnabled) {
            const errorSound = new Audio('../Audio/error.mp3');
            errorSound.volume = audioSettings.soundVolume / 100;
            errorSound.play().catch(e => console.log('Audio playback prevented'));
        }

        const message = failureMessages[Math.floor(Math.random() * failureMessages.length)];
        messageText.textContent = message;
        messageBubble.classList.remove('hidden');

        setTimeout(() => {
            messageBubble.classList.add('hidden');
        }, 3000);

        for (let card of flippedCards) {
            card.classList.remove('flipped');
        }
    }

    flippedCards = [];
}

//======= playing game - end ======

// when the ingame page is loaded
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(updateTimer, 1000); // every second
}

function updateTimer() {
    elapsedTime = Date.now() - startTime
    document.getElementById('time').textContent = renderTime(elapsedTime);
}

// update timer in game every second
function renderTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

function pauseTimer() {
    if(!isPaused) return;
    clearInterval(timerId);
    elapsedTime = Date.now() - startTime;
}

// ===========
// == Pause ==
// ===========
// 1. when the user click Pause button
document.getElementById('pause-btn')?.addEventListener('click', handlePause);
function handlePause(){
    // Play click sound
    if (audioSettings.soundEnabled) {
        const clickSound = new Audio('../Audio/clickselect.mp3');
        clickSound.volume = audioSettings.soundVolume / 100;
        clickSound.play().catch(e => console.log('Audio playback prevented'));
    }

    // 1-1. remove 'hidden' class from 'pause-overlay'
    document.getElementById('pause-overlay').classList.remove('hidden');
    // 1-2. stop timer and change value (isPaused=true)
    isPaused = true;
    pauseTimer();
    // 1-3. update UI (elapsed time, difficulty ...)
    // document.getElementById('pause-difficulty').textContent = '난이도';
    document.getElementById('pause-time').textContent = renderTime(elapsedTime);
    document.getElementById('pause-difficulty').textContent = sessionStorage.getItem("gameDifficulty");
}


// 2. when the user click Resume button
document.getElementById('resume-btn')?.addEventListener('click', handleResume);
function handleResume(){
    // 2-1. add 'hidden' class to 'pause-overlay'
    document.getElementById('pause-overlay').classList.add('hidden');
    // 2-2. restart timer
    startTimer();
    isPaused = false;
}

// 3. when the user click Restart button
document.getElementById('restart-btn')?.addEventListener('click', handleRestart);
function handleRestart(){
    document.getElementById('time').textContent = '00:00';
    // 3-1. add 'hidden' to 
    document.getElementById('pause-overlay').classList.add('hidden');
    isPaused = false;
    // call the function - game start
    // 3-2. reset
    elapsedTime = 0;
    // 3-3. start timer
    initGame();
    startTimer();
}

// 4. when the user click Home button
document.getElementById('menu-btn')?.addEventListener('click', handleMenu);
function handleMenu(){
    // 4-1. go to index page
    clearInterval(timerId);
    isPaused = false;
    window.location.href = "../index.html";
}


// ============
// == Result ==
// ============
// 1. When the game finish
function endGame() {
    // 1-1. Stop timer
    clearInterval(timerId);
    // 1-2. make result overlay visible
    document.getElementById('result-overlay').classList.remove('hidden');
    // 1-3. call function which calculates rating
    
    // 1-4. update UI
    document.getElementById('result-time').textContent = renderTime(elapsedTime);
    document.getElementById('result-moves').textContent = movements;
    document.getElementById('result-difficulty').textContent = sessionStorage.getItem("gameDifficulty");

    let starsCount = calculateStars(elapsedTime, movements, pairs);
    let stars = '';
    for (let index = 0; index < starsCount; index++) {
        stars += '⭐️';
    }
    document.getElementById('result-rating').textContent = stars;
}

// 2. when the user click Play Again button
document.getElementById('play-again-btn')?.addEventListener('click', handlePlayAgain)
function handlePlayAgain(){
    // 2-1. add 'hidden' class to result
    document.getElementById('result-overlay').classList.add('hidden');
    // 2-2. call function - game start
    document.getElementById('time').textContent = '00:00';
    isPaused = false;
    elapsedTime = 0;
    initGame();
    startTimer();
}

// 3. when the user click Home button
document.getElementById('result-menu-btn')?.addEventListener('click', function(){
   window.location.href = "../index.html";
});

function calculateStars(timeMs, moves, pairs) {
    const baseTimePerPair = 8000;
    const baseMovesPerPair = 2;

    const timeScore = timeMs / (pairs * baseTimePerPair);
    const moveScore = moves / (pairs * baseMovesPerPair);

    const averageScore = (timeScore + moveScore) / 2;

    let stars = 3;
    if (averageScore > 1.5) stars = 1;
    else if (averageScore > 1.0) stars = 2;

    return stars;
}

// Jade - end


// Jose - start
//======================
//== select level ==
//======================

let selectedDifficulty = null;

function selectDifficulty(difficulty) {
    // Play click sound
    // if (audioSettings.soundEnabled) {
    //     const clickSound = new Audio('./Audio/clickselect.mp3');
    //     clickSound.volume = audioSettings.soundVolume / 100;
    //     clickSound.play().catch(e => console.log('Audio playback prevented'));
    // }

    selectedDifficulty = difficulty;
    
    // Remove selected class from all buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    event.target.closest('.difficulty-btn').classList.add('selected');
    //Play click sound
        if (audioSettings.soundEnabled) {
            const clickSound = new Audio('./Audio/clickselect.mp3');
            clickSound.volume = audioSettings.soundVolume / 100;
            clickSound.play().catch(e => console.log('Audio playback prevented'));
        }

        // 
    // Enable start button
    document.getElementById('startBtn').disabled = false;
}

function startGame() {
    if (selectedDifficulty) {
        // Store difficulty in sessionStorage for the game to use
       
        // You can navigate to the game page or initialize the game here
       // alert(`Starting ${selectedDifficulty} game!`);
        if (audioSettings.soundEnabled) {
            const clickSound = new Audio('./Audio/clickselect.mp3');
            clickSound.volume = audioSettings.soundVolume / 100;
            clickSound.play().catch(e => console.log('Audio playback prevented'));
        }
        sessionStorage.setItem('gameDifficulty', selectedDifficulty);

        window.location.href = './pages/game-normal-mode.html'; // Uncomment when you have a game page
       
    }
}

// ===== SETTINGS & CREDITS FUNCTIONS =====
// Audio Settings
let audioSettings = {
    musicVolume: localStorage.getItem('musicVolume') || 70,
    soundVolume: localStorage.getItem('soundVolume') || 80,
    musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false'
};

// Load settings on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadAudioSettings();
    initBackgroundMusic();
});

function loadSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const creditsBtn = document.getElementById('credits-btn');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            // Play click sound
            if (audioSettings.soundEnabled) {
                const clickSound = new Audio('./Audio/clickselect.mp3');
                clickSound.volume = audioSettings.soundVolume / 100;
                clickSound.play().catch(e => console.log('Audio playback prevented'));
            }
            window.location.href = './pages/settings.html';
        });
    }
    
    if (creditsBtn) {
        creditsBtn.addEventListener('click', () => {
            // Play click sound
            if (audioSettings.soundEnabled) {
                const clickSound = new Audio('./Audio/clickselect.mp3');
                clickSound.volume = audioSettings.soundVolume / 100;
                clickSound.play().catch(e => console.log('Audio playback prevented'));
            }
            openCredits();
        });
    }
}

function loadAudioSettings() {
    const musicVol = document.getElementById('musicVolume');
    const soundVol = document.getElementById('soundVolume');
    const musicToggle = document.getElementById('musicToggle');
    const soundToggle = document.getElementById('soundToggle');
    
    if (musicVol) {
        musicVol.value = audioSettings.musicVolume;
        document.getElementById('musicVolumeValue').textContent = audioSettings.musicVolume + '%';
    }
    
    if (soundVol) {
        soundVol.value = audioSettings.soundVolume;
        document.getElementById('soundVolumeValue').textContent = audioSettings.soundVolume + '%';
    }
    
    if (musicToggle) {
        musicToggle.checked = audioSettings.musicEnabled;
    }
    
    if (soundToggle) {
        soundToggle.checked = audioSettings.soundEnabled;
    }
}

function updateMusicVolume(value) {
    audioSettings.musicVolume = value;
    localStorage.setItem('musicVolume', value);
    document.getElementById('musicVolumeValue').textContent = value + '%';
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) {
        bgMusic.volume = value / 100;
    }
    console.log('Music volume set to:', value + '%');
}

function updateSoundVolume(value) {
    audioSettings.soundVolume = value;
    localStorage.setItem('soundVolume', value);
    document.getElementById('soundVolumeValue').textContent = value + '%';
    console.log('Sound effects volume set to:', value + '%');
}

function toggleMusic() {
    const isEnabled = document.getElementById('musicToggle').checked;
    audioSettings.musicEnabled = isEnabled;
    localStorage.setItem('musicEnabled', isEnabled);
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) {
        if (isEnabled) {
            bgMusic.play().catch(e => console.log('Autoplay prevented'));
        } else {
            bgMusic.pause();
        }
    }
    console.log('Music', isEnabled ? 'enabled' : 'disabled');
}

function toggleSound() {
    const isEnabled = document.getElementById('soundToggle').checked;
    audioSettings.soundEnabled = isEnabled;
    localStorage.setItem('soundEnabled', isEnabled);
    console.log('Sound effects', isEnabled ? 'enabled' : 'disabled');
}

function resetSettings() {
    audioSettings = {
        musicVolume: 50,
        soundVolume: 90,
        musicEnabled: true,
        soundEnabled: true
    };
    
    localStorage.setItem('musicVolume', 50);
    localStorage.setItem('soundVolume', 90);
    localStorage.setItem('musicEnabled', 'true');
    localStorage.setItem('soundEnabled', 'true');
    
    loadAudioSettings();
    alert('Settings reset to default!');
}

function initBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    // Play click sound
    if (audioSettings.soundEnabled) {
        const clickSound = new Audio('./Audio/clickselect.mp3');
        clickSound.volume = audioSettings.soundVolume / 100;
        clickSound.play().catch(e => console.log('Audio playback prevented'));
    }

    if (!bgMusic) return;
    
    bgMusic.volume = audioSettings.musicVolume / 100;
    
    if (audioSettings.musicEnabled) {
        bgMusic.play().catch(e => console.log('Autoplay prevented'));
    }
}

function goBack() {
    window.location.href = '../index.html';
}

function openCredits() {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function closeCredits() {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Close credits overlay when clicking outside
window.addEventListener('click', (e) => {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay && e.target === overlay) {
        closeCredits();
    }
});
// Jose - end



// Santiago - start
// document.addEventListener('DOMContentLoaded', () => {
function initGame(){
    movements = 0;
    matchedPairs = 0;

    document.getElementById('moves').textContent = movements;

    const board = document.getElementById('board');
    if (!board) return;

    const emojis = [
        "😈","😭","🤑","🤮","😍","😡","😂","🤯","🥶","😱","🤩","😏",
        "😇","🤔","😴","🥳","😜","😢","😎","🤡","👻","💀","☠️","🤖"
    ];

    let difficulty = sessionStorage.getItem("gameDifficulty") || "easy";
    

    switch(difficulty){
        case "easy":
            rows = 3; columns = 4; pairs = 6; // 4x3
            break;
        case "medium":
            rows = 3; columns = 6; pairs = 9; // 6x3
            break;
        case "impossible":
            rows = 3; columns = 10; pairs = 15; // 10x3
            break;
        default:
            rows = 3; columns = 4; pairs = 6;
    }

    const totalCards = pairs*2;

    board.innerHTML = '';

    board.style.gridTemplateColumns = `repeat(${columns}, var(--card-width))`;
    board.style.gridTemplateRows = `repeat(${rows}, var(--card-height))`;

    let selectedEmojis = emojis.slice(0, pairs);
    let cardImages = [];
    selectedEmojis.forEach(emoji => { cardImages.push(emoji); cardImages.push(emoji); });

    for (let i = cardImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }

    cardImages.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"><span>?</span></div>
                <div class="card-back"><span class="card-back-emoji">${emoji}</span></div>
            </div>`;
        // card.addEventListener('click', () => card.classList.toggle('flipped'));
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    document.getElementById('pairs').textContent = '0/' + pairs;
// });
};
// Santiago - end

// GIF Character Messages - Caracteres con mensajes
const characterMessages = [
    "¡Great job! 🎉",
    "You're doing amazing!",
    "Keep going! 💪",
    "Nice move! 👍",
    "Awesome! ⭐",
    "You got this! 🚀",
    "Fantastic! 🌟",
    "Way to go! 🎯",
    "Impressive! 💡",
    "Excellent work! 🏆"
];

const failureMessages = [
    "You were close! 😅",
    "Try again! 🤔",
    "Almost there! 💪",
    "Not quite! 😔",
    "Keep trying! 🔄",
    "You'll get it next time! 🎯",
    "Better luck next time! 🍀",
    "So close! 📏",
    "Don't give up! 💪",
    "One more time! 🔁"
];

let messageIndex = 0;

// Get elements
const gifCharacter = document.getElementById('gif-character');
const messageBubble = document.getElementById('message-bubble');
const messageText = document.getElementById('message-text');

// Click on gif to show random message
if (gifCharacter) {
    gifCharacter.addEventListener('click', () => {
        showRandomMessage();
    });
}

function showRandomMessage() {
    // Get random message
    const randomIndex = Math.floor(Math.random() * characterMessages.length);
    const message = characterMessages[randomIndex];
    
    // Display message
    messageText.textContent = message;
    messageBubble.classList.remove('hidden');
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageBubble.classList.add('hidden');
    }, 3000);
}

// Optional: Show message when game starts
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gif-character')) {
        // Show initial message after 1 second
        setTimeout(() => {
            showRandomMessage();
        }, 1000);
    }
});