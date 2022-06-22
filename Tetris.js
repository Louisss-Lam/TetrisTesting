const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const row = 20;
const col = column = 10;
const sq = squareSize = 20;
const vacant = "#FFF";

// draw a square

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*sq, y*sq, sq, sq);

    ctx.strokeStyle = "Black";
    ctx.strokeRect(x*sq, y*sq, sq, sq);
}

// create the board

let board = [];

for (r = 0; r < row; r++) {
    board[r] = [];
    for (c = 0; c < col; c++) {
        board[r][c] = vacant;
    }
}

// draw the board

function drawBoard() {
    for (r = 0; r < row; r++) {
        for (c = 0; c < col; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// The pieces and their colors

const pieces = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

// generate random pieces

function randomPiece() {
    let r = randomN = Math.floor(Math.random() * pieces.length)
    return new Piece(pieces[r][0], pieces[r][1])
}

let p = randomPiece();

// The object piece

function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}

//  fill function

Piece.prototype.fill = function(color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function() {
    this.fill(this.color);
}

// undraw a piece

Piece.prototype.unDraw = function() {
    this.fill(vacant);
}

// move down the piece

Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}

// move Right the piece

Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    } else {

    }  
}

// move Left the piece

Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    } else {

    }
}

// rotate the piece

Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > col / 2) {
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        } else { 
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    } else {

    }
}

let score = 0;

Piece.prototype.lock = function() {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    for (r = 0; r < row; r++) {
        let isRowFull = true;

        for (c = 0; c < col; c++) {
            isRowFull = isRowFull && (board[r][c] != vacant);    
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < col; c++) {
                    board[y][c] = board[y-1][c];
                }
            }
            for (c = 0; c < col; c++) {
                board[0][c] = vacant;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();

    //update the score
    scoreElement.innerHTML = score;

}

// collision function

Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            //conditions
            if (newX < 0 || newX >= col || newY >= row) {
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece on the board
            if (board[newY][newX] != vacant) {
                return true;
            }
        }
    }
    return false;
}


// control the piece

document.addEventListener("keydown", control);

function control(event) { 
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
        dropStart = Date.now();
    }
}

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;

function drop() {
    let now = Date.now();
    let delta = now - dropStart;

    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) { 
        requestAnimationFrame(drop);
    }
}

drop();
