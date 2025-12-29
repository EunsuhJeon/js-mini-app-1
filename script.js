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
    const board = document.getElementById('board');
    if (board) {
        const urlParams = new URLSearchParams(window.location.search);
        let level = urlParams.get('level') || sessionStorage.getItem("gameDifficulty") || "easy";
        sessionStorage.setItem("gameDifficulty", level);

        initGame();
        startTimer();
    }
});

// ===== Playing Game =====
function flipCard() {
    if (flippedCards.includes(this)) return;

    if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
        if (audioSettings.soundEnabled) {
            const clickSound = new Audio('../Audio/clickselect.mp3');
            clickSound.volume = audioSettings.soundVolume / 100;
            clickSound.play().catch(e => console.log('Audio playback prevented'));
        }

        this.classList.add("flipped");
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    movements++;
    document.getElementById('moves').textContent = movements;

    let isMatch = flippedCards.every(card => card.dataset.emoji === flippedCards[0].dataset.emoji);

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
        setTimeout(() => messageBubble.classList.add('hidden'), 3000);

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
        setTimeout(() => messageBubble.classList.add('hidden'), 3000);

        flippedCards.forEach(card => card.classList.remove('flipped'));
    }

    flippedCards = [];
}

// ===== Timer =====
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    document.getElementById('time').textContent = renderTime(elapsedTime);
}

function renderTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function pauseTimer() {
    if (!isPaused) return;
    clearInterval(timerId);
    elapsedTime = Date.now() - startTime;
}

// ===== Pause =====
document.getElementById('pause-btn')?.addEventListener('click', handlePause);
function handlePause() {
    if (audioSettings.soundEnabled) {
        const clickSound = new Audio('../Audio/clickselect.mp3');
        clickSound.volume = audioSettings.soundVolume / 100;
        clickSound.play().catch(e => console.log('Audio playback prevented'));
    }

    document.getElementById('pause-overlay').classList.remove('hidden');
    isPaused = true;
    pauseTimer();
    document.getElementById('pause-time').textContent = renderTime(elapsedTime);
    document.getElementById('pause-difficulty').textContent = sessionStorage.getItem("gameDifficulty");
}

document.getElementById('resume-btn')?.addEventListener('click', handleResume);
function handleResume() {
    document.getElementById('pause-overlay').classList.add('hidden');
    startTimer();
    isPaused = false;
}

document.getElementById('restart-btn')?.addEventListener('click', handleRestart);
function handleRestart() {
    document.getElementById('time').textContent = '00:00';
    document.getElementById('pause-overlay').classList.add('hidden');
    isPaused = false;
    elapsedTime = 0;
    initGame();
    startTimer();
}

document.getElementById('menu-btn')?.addEventListener('click', handleMenu);
function handleMenu() {
    clearInterval(timerId);
    isPaused = false;
    window.location.href = "../index.html";
}

// ===== Result =====
function endGame() {
    clearInterval(timerId);
    document.getElementById('result-overlay').classList.remove('hidden');

    document.getElementById('result-time').textContent = renderTime(elapsedTime);
    document.getElementById('result-moves').textContent = movements;
    document.getElementById('result-difficulty').textContent = sessionStorage.getItem("gameDifficulty");

    const starsCount = calculateStars(elapsedTime, movements, pairs);
    let stars = '';
    for (let i = 0; i < starsCount; i++) stars += '⭐️';
    document.getElementById('result-rating').textContent = stars;

    let resultMessage = '';
    if (starsCount === 3) resultMessage = "Godlike";
    else if (starsCount === 2) resultMessage = "Good job";
    else resultMessage = "You can do it better";

    document.querySelector('.result-title').textContent = resultMessage;
}

document.getElementById('play-again-btn')?.addEventListener('click', handlePlayAgain);
function handlePlayAgain() {
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('time').textContent = '00:00';
    isPaused = false;
    elapsedTime = 0;
    initGame();
    startTimer();
}

document.getElementById('result-menu-btn')?.addEventListener('click', () => {
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

// ===== Difficulty Selection =====
let selectedDifficulty = null;

function selectDifficulty(difficulty, event) {
    selectedDifficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.closest('.difficulty-btn').classList.add('selected');

    if (audioSettings.soundEnabled) {
        const clickSound = new Audio('./Audio/clickselect.mp3');
        clickSound.volume = audioSettings.soundVolume / 100;
        clickSound.play().catch(e => console.log('Audio playback prevented'));
    }

    document.getElementById('startBtn').disabled = false;
}

function startGame() {
    if (selectedDifficulty) {
        if (audioSettings.soundEnabled) {
            const clickSound = new Audio('./Audio/clickselect.mp3');
            clickSound.volume = audioSettings.soundVolume / 100;
            clickSound.play().catch(e => console.log('Audio playback prevented'));
        }
        sessionStorage.setItem('gameDifficulty', selectedDifficulty);
        window.location.href = './pages/game-normal-mode.html?level=' + selectedDifficulty;
    }
}

// ===== Settings & Audio =====
let audioSettings = {
    musicVolume: localStorage.getItem('musicVolume') || 70,
    soundVolume: localStorage.getItem('soundVolume') || 80,
    musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false'
};

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

    if (musicToggle) musicToggle.checked = audioSettings.musicEnabled;
    if (soundToggle) soundToggle.checked = audioSettings.soundEnabled;
}

function updateMusicVolume(value) {
    audioSettings.musicVolume = value;
    localStorage.setItem('musicVolume', value);
    document.getElementById('musicVolumeValue').textContent = value + '%';
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) bgMusic.volume = value / 100;
}

function updateSoundVolume(value) {
    audioSettings.soundVolume = value;
    localStorage.setItem('soundVolume', value);
    document.getElementById('soundVolumeValue').textContent = value + '%';
}

function toggleMusic() {
    const isEnabled = document.getElementById('musicToggle').checked;
    audioSettings.musicEnabled = isEnabled;
    localStorage.setItem('musicEnabled', isEnabled);
    const bgMusic = document.getElementById('backgroundMusic');
    if (bgMusic) isEnabled ? bgMusic.play().catch(e => console.log('Autoplay prevented')) : bgMusic.pause();
}

function toggleSound() {
    const isEnabled = document.getElementById('soundToggle').checked;
    audioSettings.soundEnabled = isEnabled;
    localStorage.setItem('soundEnabled', isEnabled);
}

function resetSettings() {
    audioSettings = { musicVolume: 50, soundVolume: 90, musicEnabled: true, soundEnabled: true };
    localStorage.setItem('musicVolume', 50);
    localStorage.setItem('soundVolume', 90);
    localStorage.setItem('musicEnabled', 'true');
    localStorage.setItem('soundEnabled', 'true');
    loadAudioSettings();
    alert('Settings reset to default!');
}

function initBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    if (!bgMusic) return;
    bgMusic.volume = audioSettings.musicVolume / 100;
    if (audioSettings.musicEnabled) bgMusic.play().catch(e => console.log('Autoplay prevented'));
}

function goBack() { window.location.href = '../index.html'; }

function openCredits() {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function closeCredits() {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay) overlay.classList.add('hidden');
}

window.addEventListener('click', (e) => {
    const overlay = document.getElementById('creditsOverlay');
    if (overlay && e.target === overlay) closeCredits();
});

// ===== Game Initialization =====
function initGame() {
    movements = 0;
    matchedPairs = 0;
    document.getElementById('moves').textContent = movements;

    const board = document.getElementById('board');
    if (!board) return;

    const emojis = [
        "😈", "😭", "🤑", "🤮", "😍", "😡", "😂", "🤯", "🥶", "😱", "🤩", "😏",
        "😇", "🤔", "😴", "🥳", "😜", "😢", "😎", "🤡", "👻", "💀", "☠️", "🤖"
    ];

    let difficulty = sessionStorage.getItem("gameDifficulty") || "easy";

    switch(difficulty){
        case "easy": rows=3; columns=4; pairs=6; break;
        case "medium": rows=3; columns=6; pairs=9; break;
        case "impossible": rows=3; columns=10; pairs=15; break;
        default: rows=3; columns=4; pairs=6;
    }

    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${columns}, var(--card-width))`;
    board.style.gridTemplateRows = `repeat(${rows}, var(--card-height))`;

    let selectedEmojis = emojis.slice(0, pairs);
    let cardImages = [];
    selectedEmojis.forEach(emoji => { cardImages.push(emoji); cardImages.push(emoji); });

    for (let i = cardImages.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
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
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    document.getElementById('pairs').textContent = '0/'+pairs;
}

// ===== GIF Character Messages =====
const characterMessages = [
    "¡Great job! 🎉", "You're doing amazing!", "Keep going! 💪",
    "Nice move! 👍", "Awesome! ⭐", "You got this! 🚀",
    "Fantastic! 🌟", "Way to go! 🎯", "Impressive! 💡", "Excellent work! 🏆"
];

const failureMessages = [
    "You were close! 😅", "Try again! 🤔", "Almost there! 💪",
    "Not quite! 😔", "Keep trying! 🔄", "You'll get it next time! 🎯",
    "Better luck next time! 🍀", "So close! 📏", "Don't give up! 💪", "One more time! 🔁"
];

const gifCharacter = document.getElementById('gif-character');
const messageBubble = document.getElementById('message-bubble');
const messageText = document.getElementById('message-text');

if (gifCharacter) {
    gifCharacter.addEventListener('click', showRandomMessage);
}

function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * characterMessages.length);
    messageText.textContent = characterMessages[randomIndex];
    messageBubble.classList.remove('hidden');
    setTimeout(() => messageBubble.classList.add('hidden'), 3000);
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gif-character')) {
        setTimeout(() => showRandomMessage(), 1000);
    }
});
