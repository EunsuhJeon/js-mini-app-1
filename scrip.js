let gameStarted = false;
let isPaused = false;
let gameFinished = false;

let time = 0;
let moves = 0;
let timerInterval = null;

// ===========
// == Pause ==
// ===========
// 1. 일시정지 버튼 눌렀을 때 
// 1-1. 오버레이 class 중에 hidden Remove
// 1-2. 타이머 스탑
// 1-3. 현재 시간, 모드 값 가져와서 text 넣기

// 2. Resume 눌렀을 때
// 2-1. 오버레이 class에 hidden 다시 넣고
// 2-2. 타이머 멈춘 시점부터 재개

// 3. Restart 눌렀을 때
// 3-1. 오버레이 class에 hidden 다시 넣고
// 3-2. 카드 재배치, 재 셋팅
// 3-2. 타이머 재개

// 4. Home 버튼 눌렀을 때
// 4-1. index 페이지로 이동


// ============
// == Result ==
// ============
// 1. 카드 다 매칭됐을 때
// 1-1. 타이머 멈추고
// 1-2. 오버레이 히든 제거
// 1-3. 별점 계산 함수 호출
// 1-4. 결과값 채워넣기

// 2. Play Agin 버튼 클릭했을 때
// 2-1. 오버레이에 히든 넣고
// 2-2. 게임 초기셋팅함수 호출

// 3. Home 버튼 클릭
// 3-1. index 페이지로 이동
