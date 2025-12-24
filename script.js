
// Jade - start
let gameStarted = false;
let isPaused = false;
let gameFinished = false;

let startTime = null;
let elapsedTime = 0;
let timerId = null;

window.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;
    if (!currentPage.includes("index.html")) {
        const level = sessionStorage.getItem("gameDifficulty");
        if (level) {
            startTimer();
        }
    }
});

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
    // 3-1. add 'hidden' to 
    document.getElementById('pause-overlay').classList.add('hidden');
    isPaused = false;
    // call the function - game start
    // 3-2. reset
    elapsedTime = 0;
    // 3-3. start timer
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
}

// 2. when the user click Play Again button
document.getElementById('play-again-btn')?.addEventListener('click', handlePlayAgain)
function handlePlayAgain(){
    // 2-1. add 'hidden' class to result
    document.getElementById('result-overlay').classList.add('hidden');
    // 2-2. call function - game start
}

// 3. when the user click Home button
document.getElementById('result-menu-btn')?.addEventListener('click', function(){
   window.location.href = "../index.html";
});

// Jade - end


// Jose - start
//======================
//== select level ==
//======================

let selectedDifficulty = null;

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    
    // Remove selected class from all buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    event.target.closest('.difficulty-btn').classList.add('selected');
    
    // Enable start button
    document.getElementById('startBtn').disabled = false;
}

function startGame() {
    if (selectedDifficulty) {
        // Store difficulty in sessionStorage for the game to use
        sessionStorage.setItem('gameDifficulty', selectedDifficulty);
        // You can navigate to the game page or initialize the game here
       // alert(`Starting ${selectedDifficulty} game!`);
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
            window.location.href = './pages/settings.html';
        });
    }
    
    if (creditsBtn) {
        creditsBtn.addEventListener('click', openCredits);
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
        musicVolume: 70,
        soundVolume: 80,
        musicEnabled: true,
        soundEnabled: true
    };
    
    localStorage.setItem('musicVolume', 70);
    localStorage.setItem('soundVolume', 80);
    localStorage.setItem('musicEnabled', 'true');
    localStorage.setItem('soundEnabled', 'true');
    
    loadAudioSettings();
    alert('Settings reset to default!');
}

function initBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
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

// Santiago - end
