class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = 3;
        this.y = -2;

        this.locked = false;
        this.nextTetromino;
        this.nTetrominoColor;
    }

    fill(color) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }
    
    draw() {
        this.fill(this.color);
    }
    
    unDraw() {
        drawBoard();
        this.fill(EMPTY);
    }

    drawNext() {
        setTimeout(() => {
            clearNextBoard();

            for (let r = 0; r < this.nextTetromino[0].length; r++) {
                for (let c = 0; c < this.nextTetromino[0].length; c++) {
                    if (this.nextTetromino[0][r][c]) {
                        if (this.nextTetromino[0].length != 4) {
                            drawSquare(1 + c, 1 + r, this.nTetrominoColor, nextCtx);
                        }
                        else if (this.nextTetromino === PIECES[5][0]) {
                            drawSquare(0.5 + c, 0.5 + r, this.nTetrominoColor, nextCtx);
                        }
                        else {
                            drawSquare(0.5 + c, r, this.nTetrominoColor, nextCtx);
                        }
                    }
                }
            }
        }, interval);        
    }

    moveDown() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            this.locked = true;
        }

    }
    
    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }
    
    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }
    
    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COL / 2) {
                kick = -1;
            } else {
                kick = 1;
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }

                if (this.y + r < 0) {
                    //alert("Game Over");
                    
                    if ((localStorage.getItem("maxScore") && localStorage.getItem("maxScore") < score) || !localStorage.getItem("maxScore")) {
                        localStorage.setItem("maxScore", score);
                    } 

                    $("#logo").hide();
                    $("#myTetris").hide();

                    $("#gameOver").css("display", "");
                    $("#result").text(`Your result: ${score}`);
                    console.log($("#result").text());
                    console.log(score);
                    $("#maxResult").text(`Record: ${localStorage.getItem("maxScore")}`);
                    
                    
                    gameOver = true;
                    break;
                }

                board[this.y + r][this.x + c] = this.color;
            }
        }

        let tmpLines = lines;

        for (let r = 0; r < ROW; r++) {
            let isFullRow = true;
            for (let c = 0; c < COL; c++) {
                isFullRow = isFullRow && (board[r][c] != EMPTY);
            }
            if (isFullRow) {
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                
                for (let c = 0; c < COL; c++) {
                    board[0][c] = EMPTY;
                }
                
                lines++;
            }
        }
        
        drawBoard();

        switch (lines - tmpLines) {
            case 1:
                score += 100;
                break;
            case 2:
                score += 300;
                break;
            case 3:
                score += 700;
                break;     
            case 4:
            score += 1500;
            break;
        }

        if (score >= levelScore && interval != 100) {
            level++;
            interval -= 100;   
            levelScore += 1200; 
        }

        infoLevel.value = level;
        infoScore.value = score;
        infoLines.value = lines;
    }
    
    collision(x, y, piece) {
        for (let r = 0; r < piece.length; r++) {
            for ( let c = 0; c < piece.length; c++) {
                
                if (!piece[r][c]) {
                    continue;
                }
                
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }
                
                if (newY < 0) {
                    continue;
                }
                
                if (board[newY][newX] != EMPTY) {
                    return true;
                }
            }
        }
        return false;
    }
}