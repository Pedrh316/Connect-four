const $player1Score = document.querySelector('.player1 h2');
const $player2Score = document.querySelector('.player2 h2');
let balls = [...document.querySelectorAll('.board span.ball')];

const player1 = {
    element: document.querySelector('.player1 h2'),
    nome:'Player 1',
    cor: 'deepskyblue',
    score: 0,
}

const player2 = {
    element:document.querySelector('.player2 h2'),
    nome:'Player 2',
    cor: 'pink',
    score: 0,
}

const columns = [
    balls.filter(ball => balls.indexOf(ball) % 7 == 0),
    balls.filter(ball => balls.indexOf(ball) % 7 == 1),
    balls.filter(ball => balls.indexOf(ball) % 7 == 2),
    balls.filter(ball => balls.indexOf(ball) % 7 == 3),
    balls.filter(ball => balls.indexOf(ball) % 7 == 4),
    balls.filter(ball => balls.indexOf(ball) % 7 == 5),
    balls.filter(ball => balls.indexOf(ball) % 7 == 6),
];

const rows = [
    balls.filter(ball => balls.indexOf(ball) >= 0 && balls.indexOf(ball) < 7),
    balls.filter(ball => balls.indexOf(ball) >= 7 && balls.indexOf(ball) < 14),
    balls.filter(ball => balls.indexOf(ball) >= 14 && balls.indexOf(ball) < 21),
    balls.filter(ball => balls.indexOf(ball) >= 21 && balls.indexOf(ball) < 28),
    balls.filter(ball => balls.indexOf(ball) >= 28 && balls.indexOf(ball) < 35),
    balls.filter(ball => balls.indexOf(ball) >= 35 && balls.indexOf(ball) < 42),
]

let board = document.querySelector('.board');
let counter = document.querySelector('.time h2');
let interval = null;
let playerRound = player1;

activeBallsListener();
limitRoundTime();

function activeBallsListener(){
    if(innerWidth > 700){
        balls.forEach(ball => ball.addEventListener('click', setBola));        
    }
    balls.forEach(ball => ball.addEventListener('touchstart', setBola));
}

let lastBall = null;
let lastBallbg = null;
let rowIndex = -1;

function setBola({target}){
    limitRoundTime();
    rowIndex = -1;

    columns.forEach(column => {
        if(column.includes(target)){
            lastBall = null;
            lastBallbg = null;
            findEmptyBall(column);            
        }
    }) 
}

function findEmptyBall(column){
    lastBall = column.slice(rowIndex)[0];
    lastBallbg = lastBall.style.backgroundColor;
    if(lastBallbg !== player1.cor && lastBallbg !== player2.cor ){
        lastBall.style.backgroundColor = playerRound.cor;
        combinations();
    } else{
        rowIndex--
        findEmptyBall(column);
    }
}


function combinations(){
    let combinations = [];
    let combinationsColor = [];

    columns.forEach(column => {
        combinations.push(column.slice(0, 4));
        combinations.push(column.slice(1, 5));
        combinations.push(column.slice(2, 6));
    })
    rows.forEach(row => {
        combinations.push(row.slice(0,4));
        combinations.push(row.slice(1,5));
        combinations.push(row.slice(2,6));
        combinations.push(row.slice(3,7));
    })
    
   
    combinations.forEach((combination, i) => {
        combinationsColor[i] = [];
        combination.forEach(ball => {
            combinationsColor[i].push(ball.style.backgroundColor);
        })
    })

    verificaCombinacoes(combinationsColor);
}

let player1Vencedor = false;
let player2Vencedor = false;

function verificaCombinacoes(combinacoesEmCores){

    player1Vencedor = verificaVencedor(player1);
    player2Vencedor = verificaVencedor(player2);
    
    function verificaVencedor(player){
        let vencedor = combinacoesEmCores.some(combination => {
            return combination.every(el => el === player.cor);
        });        
        if(vencedor){
            setTimeout(() => {
                player.score += 1;
                alert(`O player vencedor é ${player.nome}`)
                clear();                
                setScore(player);                
            }, 100);
        }
    }

    verificaEmpate();

    function verificaEmpate(){
        let empate = balls.every(ball => ball.style.backgroundColor !== '')

        if(empate){
            setTimeout(() => {
                alert('Houve um empate!');
                clear();
                limitRoundTime();
            }, 100);
        }
    }

    playerRound = playerRound == player1 ? player2 : player1;
}


function setScore(player){
    player.element.textContent = player.score;
}

function clear(){
    balls.forEach(ball => ball.removeAttribute('style') );
}

function limitRoundTime(){
    clearInterval(interval);
    let startTime = parseInt(Date.now() / 1000);
    let upTime = 30;
    setRoundtime(upTime);

    interval = setInterval(() => {
        upTime = (30) - (parseInt(Date.now() / 1000) - startTime);
        setRoundtime(upTime)
        if(upTime === 0) {
            startTime = parseInt(Date.now() / 1000);
            playerRound = playerRound == player1 ? player2 : player1;
        }
    }, 1000);
}

function setRoundtime(time){
    let playerTurn = document.getElementById('playerTurn');
    playerTurn.textContent = playerRound.nome.slice(-1);
    counter.textContent = time;
}




