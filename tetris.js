const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "purple"],
    [O, "yellow"],
    [L, "orange"],
    [I, "cyan"],
    [J, "blue"]
];

const canvas = document.getElementById("tetris"),
ctx = canvas.getContext("2d");
const infoLevel = document.getElementById("level");
const infoScore = document.getElementById("score");
const infoLines = document.getElementById("lines");
let board = [], lines = 0, score = 0, level = 1, 
gameOver = false, rPiece, interval = 1000, levelScore = 1200;

const ROW = 20, COL = 10, SQ = 20,
EMPTY = "darkblue";

$("#record").val(!localStorage.getItem("maxScore") ? 0 : localStorage.getItem("maxScore"));

for(let r = 0; r < ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = EMPTY;
    }
}

drawBoard();

//small canvas
const nextCanvas = document.getElementById("nextPiece"),
nextCtx = nextCanvas.getContext("2d");

clearNextBoard();

let tetrominoSequence = [];
tetrominoSequence = generateSequence();
rPiece = tetrominoSequence[0];
rPiece.nextTetromino = tetrominoSequence[1].tetromino;
rPiece.nTetrominoColor = tetrominoSequence[1].color;
rPiece.drawNext();


let dropStart = Date.now();
drop();

document.addEventListener("keydown", (e) => {
    if(e.key == "ArrowLeft"){
        rPiece.moveLeft();
        dropStart = Date.now();
    }
    else if(e.key == "ArrowUp"){
        rPiece.rotate();
        dropStart = Date.now();
    }
    else if(e.key == "ArrowRight"){
        rPiece.moveRight();
        dropStart = Date.now();
    }
    else if(e.key == "ArrowDown"){
        rPiece.moveDown();
    }
}, false);