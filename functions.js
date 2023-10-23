function drawSquare(x, y, color, curCtx = ctx){
    curCtx.fillStyle = color;
    curCtx.fillRect(x * SQ, y * SQ, SQ, SQ);    
    
    curCtx.lineWidth = 0.5;
    switch (color) {
        case EMPTY:
            curCtx.strokeStyle = "cyan";
            curCtx.lineWidth = 0.1;
            break;
        case "yellow":
            curCtx.strokeStyle = "#ffac13";
            break;
        case "purple":
            curCtx.strokeStyle = "#5b074d";
            break;
        case "orange":
            curCtx.strokeStyle = "#fd1f03";
            break;
        default:
            curCtx.strokeStyle = `dark${color}`;
            break;
    }
    
    curCtx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

function drawBoard(){
    for(let r = 0; r < ROW; r++){
        for(let c = 0; c < COL; c++){
            drawSquare(c, r, board[r][c]);
        }
    }
}

function clearNextBoard(){
    for(let r = 0; r < 4; r++){
        for(let c = 0; c < 5; c++){
            drawSquare(c, r, EMPTY, nextCtx);
        }
    }
}

function randomPiece(){
    let r = Math.floor(Math.random() * PIECES.length)
    return new Piece( PIECES[r][0], PIECES[r][1]);
}

function generateSequence() {
    let arr = [];

    for (let i = 0; i < PIECES.length; i++) {
        arr.push(randomPiece());
    }
    return arr;
}

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > interval){
        rPiece.moveDown();

        if (rPiece.locked && !gameOver) {
            tetrominoSequence.splice(0, 1);
            rPiece = tetrominoSequence[0];
            if (tetrominoSequence.length != 1) {
                rPiece.nextTetromino = tetrominoSequence[1].tetromino;
                rPiece.nTetrominoColor = tetrominoSequence[1].color;                
            } else {
                tetrominoSequence = generateSequence();
                rPiece.nextTetromino = tetrominoSequence[0].tetromino;
                rPiece.nTetrominoColor = tetrominoSequence[0].color;
            }
            rPiece.drawNext();            
        }

        dropStart = Date.now();
    }
    if(!gameOver){
        requestAnimationFrame(drop);
    }
}