
// Jade - start
let gameStarted = false;
let isPaused = false;
let gameFinished = false;

let startTime = null;
let elapsedTime = 0;
let timerId = null;

const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');

// when the ingame page is loaded
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerId = setInterval(updateTimer, 1000); // every second
}

function updateTimer() {
    elapsedTime = Date.now() - startTime
    renderTime(elapsedTime);
}

// update timer in game every second
function renderTime(ms) {
    const seconds = Math.floor(ms / 1000);
    document.getElementById('time').textContent = seconds;
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
if(pauseBtn){
    pauseBtn.addEventListener('click', handlePause);
    function handlePause(){
        // 1-1. remove 'hidden' class from 'pause-overlay'
        document.getElementById('pause-overlay').classList.remove('hidden');
        // 1-2. stop timer and change value (isPaused=true)
        isPaused = true;
        pauseTimer();
        // 1-3. update UI (elapsed time, difficulty ...)
        // document.getElementById('pause-difficulty').textContent = '난이도';
    }
}

// 2. when the user click Resume button
if(resumeBtn){
    resumeBtn.addEventListener('click', handleResume);
    function handleResume(){
        // 2-1. add 'hidden' class to 'pause-overlay'
        document.getElementById('pause-overlay').classList.add('hidden');
        // 2-2. restart timer
        // startTimer();
        isPaused = false;
    }
}

// 3. when the user click Restart button
if(restartBtn){
    restartBtn.addEventListener('click', handleRestart);
    function handleRestart(){
        // 3-1. add 'hidden' to 
        document.getElementById('pause-overlay').classList.add('hidden');
        isPaused = false;
        // call the function - game start
        // 3-2. reset
        // 3-2. start timer
    }
}

// 4. when the user click Home button
if(menuBtn){
    menuBtn.addEventListener('click', handleMenu);
    function handleMenu(){
        // 4-1. go to index page
        // clearInterval(timerId);
        isPaused = false;
        window.location.href = "../index.html";
    }
}


// ============
// == Result ==
// ============
// 1. When the game finish
function endGame() {
    // 1-1. Stop timer
    // clearInterval(timerId);
    const seconds = Math.floor(elapsedTime / 1000);
    // 1-2. make result overlay visible
    document.getElementById('result-overlay').classList.remove('hidden');
    // 1-3. call function which calculates rating

    // 1-4. update UI
    document.getElementById('result-time').textContent = seconds;
}

// 2. when the user click Play Again button
// 2-1. add 'hidden' class to result
// 2-2. call function - game start

// 3. when the user click Home button
//document.getElementById('result-menu-btn').addEventListener('click', function(){
  //  window.location.href = "index.html";
//});

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

// Jose - end

// Santiago - start

// Santiago - end
