const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const row = 20;
const col = column = 10;
const sq = squareSize = 20;
const vacant = "#FFF";

// draw a square

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x*sq, y*sq, sq, sq);

    ctx.strokeStyle = "Black";
    ctx.strokeRect(x*sq, y*sq, sq, sq);
}

// create the board

let board = [];

for(r = 0; r < row; r++){
    board[r] = [];
    for(c = 0; c < col; c++){
        board[r][c] = vacant;
    }
}

// draw the board

function drawBoard(){
    for(r = 0; r < row; r++){
        for(c = 0; c < col; c++){
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

// initate a piece

let p = new Piece(pieces[0][0], pieces[0][1]);

// The object piece

function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // we need to control the pieces
    this.x = 3;
    this.y = 0;
}

//  fill function

Piece.prototype.fill = function(color){
    for(r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // draw only occupied squares
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece

Piece.prototype.unDraw = function(){
    this.fill(vacant);
}

// move down the piece

Piece.prototype.moveDown = function(){
    this.unDraw();
    this.y++;
    this.draw();
}

// move Right the piece

Piece.prototype.moveRight = function(){
    this.unDraw();
    this.x++;
    this.draw();
}

// move Left the piece

Piece.prototype.moveLeft = function(){
    this.unDraw();
    this.x--;
    this.draw();
}

// rotate the piece

Piece.prototype.rotate = function(){
    this.unDraw();
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
}

// collision function

Piece.prototype.collision = function(x,y,piece){
    for(r = 0; r < this.piece.length; r++){
        for(c = 0; c < this.piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
        }
    }
}


// control the piece

document.addEventListener("keydown", control);

function control(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
        dropStart = Date.now();
    }
}

// drop the piece every 1sec

let dropStart = Date.now();
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    requestAnimationFrame(drop);
}

drop();
