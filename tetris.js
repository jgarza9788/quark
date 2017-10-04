var canvas = document.getElementById('board');
var ctx = canvas.getContext("2d");
var linecount = document.getElementById('lines');
var nextPiece = document.getElementById('next');
var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
var width = 10;
var height = 20;
var tilesz = 24;
var state = "start"; //start , pause, gameover game
var startMenu = document.getElementById('start');
var pauseMenu = document.getElementById('pause');
var goMenu = document.getElementById('gameover');
canvas.width = width * tilesz;
canvas.height = height * tilesz;

var board = [];
for (var r = 0; r < height; r++) {
	board[r] = [];
	for (var c = 0; c < width; c++) {
		board[r][c] = "";
	}
}


var pieceCnt = 0;
var nP;

function newPiece() 
{
	console.log("generate new piece");

	var p;

	if (pieceCnt == 0)
	{
		p = pieces[parseInt(Math.random() * pieces.length, 10)];
	}
	else
	{
		p = nP;
	}
	
	pieceCnt +=1;
	nP = pieces[parseInt(Math.random() * pieces.length, 10)];
	showNextPiece();
	console.log(p[2]);

	// document.getElementById("unpausebutton").backgroundColor = p[1];

	return new Piece(p[0], p[1]);
}

function showNextPiece()
{
	// console.log("show next piece");
	// console.log(nP);
	// console.log(nP[2]);

	// -webkit-mask-box-image: url("I.png");
	// nextPiece.src="res/" + nP[2] + ".png";

	// nextPiece.style.mask = "res/" + nP[2] + ".png";
	nextPiece.style = "-webkit-mask-box-image: url(\"res/"+ nP[2] +".png\");";
	nextPiece.style.backgroundColor = nP[1];
}


function drawSquare(x, y) 
{
	ctx.fillRect(x * tilesz, y * tilesz, tilesz, tilesz);
	var ss = ctx.strokeStyle;

	ctx.strokeStyle = "#4b4b4b";
	// ctx.strokeStyle = "#000"
	ctx.lineWidth = 4;
	ctx.strokeRect(x * tilesz, y * tilesz, tilesz, tilesz);
	// ctx.strokeStyle = "#000";
	// ctx.strokeRect(x * tilesz + 3*tilesz/8, y * tilesz + 3*tilesz/8, tilesz/4, tilesz/4);
	ctx.strokeStyle = ss;
}

function Piece(patterns, color) {
	this.pattern = patterns[0];
	this.patterns = patterns;
	this.patterni = 0;

	this.color = color;

	// console.log("width: " + width);
	// console.log("this.pattern.length: " + this.pattern.length);
	this.x = width/2-parseInt(Math.ceil(this.pattern.length/2), 10);
	this.y = -2;
}


//rotate right
Piece.prototype.rotate = function() 
{
	var nudge = 0;
	var nextpat = this.patterns[(this.patterni + 1) % this.patterns.length];

	if (this._collides(0, 0, nextpat)) {
		// Check kickback
		nudge = this.x > width / 2 ? -1 : 1;
	}

	if (!this._collides(nudge, 0, nextpat)) {
		this.undraw();
		this.x += nudge;
		this.patterni = (this.patterni + 1) % this.patterns.length;
		this.pattern = this.patterns[this.patterni];
		this.draw();
	}
};

//rotateleft
Piece.prototype.rotateleft = function() 
{
	var nudge = 0;
	var nextpat = this.patterns[(this.patterni + 3) % this.patterns.length];

	if (this._collides(0, 0, nextpat)) {
		// Check kickback
		nudge = this.x > width / 2 ? -1 : 1;
	}

	if (!this._collides(nudge, 0, nextpat)) {
		this.undraw();
		this.x += nudge;
		this.patterni = (this.patterni + 3) % this.patterns.length;
		this.pattern = this.patterns[this.patterni];
		this.draw();
	}
};

var WALL = 1;
var BLOCK = 2;
Piece.prototype._collides = function(dx, dy, pat) 
{
	for (var ix = 0; ix < pat.length; ix++) {
		for (var iy = 0; iy < pat.length; iy++) {
			if (!pat[ix][iy]) {
				continue;
			}

			var x = this.x + ix + dx;
			var y = this.y + iy + dy;
			if (y >= height || x < 0 || x >= width) {
				return WALL;
			}
			if (y < 0) {
				// Ignore negative space rows
				continue;
			}
			if (board[y][x] !== "") {
				return BLOCK;
			}
		}
	}

	return 0;
};

Piece.prototype.down = function() 
{
	if (this._collides(0, 1, this.pattern)) 
	{
		this.lock();
		piece = newPiece();
	} 
	else 
	{
		this.undraw();
		this.y++;
		this.draw();
	}
};

Piece.prototype.putdown = function()
{
	while(!this._collides(0, 1, this.pattern))
	{
		this.undraw();
		this.y++;
		this.draw();
	}
}

Piece.prototype.moveRight = function() {
	if (!this._collides(1, 0, this.pattern)) {
		this.undraw();
		this.x++;
		this.draw();
	}
};

Piece.prototype.moveLeft = function() {
	if (!this._collides(-1, 0, this.pattern)) {
		this.undraw();
		this.x--;
		this.draw();
	}
};

var lines = 0;
var done = false;
Piece.prototype.lock = function() {
	for (var ix = 0; ix < this.pattern.length; ix++) {
		for (var iy = 0; iy < this.pattern.length; iy++) {
			if (!this.pattern[ix][iy]) {
				continue;
			}

			if (this.y + iy < 0) {
				// Game ends!
				alert("You're done!");
				done = true;
				return;
			}
			board[this.y + iy][this.x + ix] = this.color;
		}
	}

	var nlines = 0;
	for (var y = 0; y < height; y++) {
		var line = true;
		for (var x = 0; x < width; x++) {
			line = line && board[y][x] !== "";
		}
		if (line) {
			for (var y2 = y; y2 > 1; y2--) {
				for (var x = 0; x < width; x++) {
					board[y2][x] = board[y2-1][x];
				}
			}
			for (var x = 0; x < width; x++) {
				board[0][x] = "";
			}
			nlines++;
		}
	}

	if (nlines > 0) {
		lines += nlines;
		drawBoard();
		linecount.textContent = "Lines: " + lines;
	}
};

Piece.prototype._fill = function(color) {
	var fs = ctx.fillStyle;
	ctx.fillStyle = color;
	var x = this.x;
	var y = this.y;


	for (var ix = 0; ix < this.pattern.length; ix++) 
	{
		for (var iy = 0; iy < this.pattern.length; iy++) 
		{
			if (this.pattern[ix][iy]) 
			{
				drawSquare(x + ix, y + iy);
			}
		}
	}
	ctx.fillStyle = fs;
};

Piece.prototype.undraw = function(ctx) {
	this._fill(clear);
};

Piece.prototype.draw = function(ctx) {
	this._fill(this.color);
};

var pieces = [
	[I, "#6be5f2","I"], //Cyan
	[J, "#0054ff","J"], //Blue
	[L, "#f27529","L"], //Orange
	[O, "#d9c72b","O"], //Yellow
	[S, "#a2d92b","S"], //green
	[T, "#a37ef2","T"], //Purple
	[Z, "#f22987","Z"] 	//Red
];
var piece = null;

var dropStart = Date.now();
var downI = {};
document.body.addEventListener("keydown", function (e) {
	if (downI[e.keyCode] !== null) {
		clearInterval(downI[e.keyCode]);
	}
	key(e.keyCode);
	downI[e.keyCode] = setInterval(key.bind(this, e.keyCode), 200);
}, false);
document.body.addEventListener("keyup", function (e) {
	if (downI[e.keyCode] !== null) {
		clearInterval(downI[e.keyCode]);
	}
	downI[e.keyCode] = null;
}, false);

//http://keycode.info/
function key(k) {
	if (done) 
	{
		return;
	}
	if (k == 38) { // Player pressed up
		piece.rotate();
		// dropStart = Date.now();
	}
	if (k == 40) { // Player pressed down
		// piece.down();
		piece.rotateleft();
		// dropStart = Date.now();
	}
	if (k == 37) { // Player holding left
		piece.moveLeft();
		// dropStart = Date.now();
	}
	if (k == 39) { // Player holding right
		piece.moveRight();
		// dropStart = Date.now();
	}
	if (k == 17) //Ctrl
	{
		piece.putdown();
		dropStart = Date.now();
	}
}

function drawBoard() {
	var fs = ctx.fillStyle;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			ctx.fillStyle = board[y][x] || clear;
			drawSquare(x, y, tilesz, tilesz);
		}
	}
	ctx.fillStyle = fs;
}

function main() 
{
	changeState(state);

	if (state != "game")
	{
		return;
	}

	var now = Date.now();
	var delta = now - dropStart;

	if (delta > (1000 - (lines * 10)))
	{
		piece.down();
		dropStart = now;
	}

	if (!done) {
		requestAnimationFrame(main);
	}
}

// var state = "start"; //start , pause, gameover game
// var startMenu = document.getElementById('start');
// var pauseMenu = document.getElementById('pause');
// var goMenu = document.getElementById('gameover');

function changeState(newState)
{
	if (state == newState)
	{
		return;
	}

	if (newState == "start")
	{
		onStart();
	}
	else if (newState == "pause")
	{
		onPause();
	}
	else if (newState == "gameover")
	{
		onGameover()
	}
	else if (newState == "game")
	{
		onGame()
	}

	state = newState;
}

function onStart()
{
	startMenu.style.display = "block";
	pauseMenu.style.display = "none";
	goMenu.style.display = "none";
}

function onPause()
{
	startMenu.style.display = "none";
	pauseMenu.style.display = "block";
	goMenu.style.display = "none";
}

function onGameover()
{
	startMenu.style.display = "none";
	pauseMenu.style.display = "none";
	goMenu.style.display = "block";
}

function onGame()
{
	startMenu.style.display = "none";
	pauseMenu.style.display = "none";
	goMenu.style.display = "none";
}

piece = newPiece();
drawBoard();
linecount.textContent = "Lines: 0";
main();
