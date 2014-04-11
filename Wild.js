/**
	* JS port of http://codegolf.stackexchange.com/questions/25347/survival-game-create-your-wolf
	*	@author @hannyajin
	*/

var AttackEnum = {
	ROCK: 'R',
	PAPER: 'P',
	SCISSORS: 'S',
	SUICIDE: 'D'
}

var MoveEnum = {
	UP: 'U',
	RIGHT: 'R',
	DOWN: 'D',
	LEFT: 'L',
	HOLD: 'H'
}

var stage;

var GLOBAL = {
	SEED: 2,
	FPS: 60,
	SIM_SPEED: 4, // iterations per tick
	SIM_DELAY: 1, // tick delay (ms)
	SUBMISSIONS: 1,
	stageWidth: 320,
	stageHeight: 320,
	lock: false,
	rounds: 50,
	iterations: 250,
	swap: true
}

var Tools = {
	createEmptyBoard: function(size) {
		var arr = [];
		for (var i = 0; i < size; i++) {
			arr[i] = [];
			for (var j = 0; j < size; j++) {
				arr[i][j] = [];
			}
		}
		return arr;
	},

	SIZE: Math.round(Math.sqrt((GLOBAL.SUBMISSIONS + 3)) * 20)
}

var DATA = {
	rounds: 0,
	wolves: 0,
	bears: 0,
	lions: 0,
	stones: 0,

	reset: function() {
			DATA.rounds = 0;
			DATA.wolves = 0;
			DATA.bears = 0;
			DATA.lions = 0;
			DATA.stones = 0;
	},

	getAvgOf: function(animal) {
		return ((animal / DATA.rounds) || 0).toFixed(1);
	},

	stringAverage: function() {
		var str = "";
		str += "Wolves avg: " + ((DATA.wolves / DATA.rounds) || 0).toFixed(1) + "\n";
		str += "Bears avg: " + ((DATA.bears / DATA.rounds) || 0).toFixed(1) + "\n";
		str += "Lions avg: " + ((DATA.lions / DATA.rounds) || 0).toFixed(1) + "\n";
		str += "Stones avg: " + ((DATA.stones / DATA.rounds) || 0).toFixed(1) + "\n";
		return str;
	},

	printAvarage: function() {
		console.log(DATA.stringAverage());
	},

	insertData: function(board) {
		DATA.rounds++;

		// temp animals
		var tw = 0,
				tb = 0,
				tl = 0,
				ts = 0;

		var SIZE = board[0].length;

		// loop through current board and save animal data
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {
				if (board[i][j].length < 1) // empty
					continue;
				var animal = board[i][j][0] || null;
				if (animal != null) {
					// found enimal
					switch (animal.char) {
						case 'W':
							tw++;
							break;
						case 'B':
							tb++;
							break;
						case 'L':
							tl++;
							break;
						case 'S':
							ts++;
							break;
					}
				}
			}	// for loop
		} // for loop

		console.log("Wolves on board: " + tw);

		DATA.wolves += tw;
		DATA.bears += tb;
		DATA.lions += tl;
		DATA.stones += ts;

		console.log("Inserted, rounds: " + DATA.rounds);
	}
}

var newBorder = function(x, y, w, h, color) {
	if (!color)
		color = "white";

	var border = new createjs.Shape();
	border.snapToPixel = true;
	border.graphics.setStrokeStyle(1).beginStroke(color).rect(0,0,w,h);
	border.x = x;
	border.y = y;
	return border;
}

var newBlock = function(x, y, w, h, color) {
	if (!color)
		color = "white";

	var border = new createjs.Shape();
	border.snapToPixel = true;
	border.graphics.setStrokeStyle(1).beginFill(color).rect(0,0,w,h);
	border.x = x;
	border.y = y;
	return border;
}

// info (modified of stats.js - https://github.com/mrdoob/stats.js)
var info = new Info();
info.setMode(0);
info.domElement.style.position = 'absolute';
info.domElement.style.left = '20px';
info.domElement.style.top = '75px';
$(function() {
	$('#gameContainer').append( info.domElement );
})


var Game = {
	board: Tools.createEmptyBoard(Tools.SIZE),
	rounds: GLOBAL.rounds,
	iterations: GLOBAL.iterations,
	isRunning: false,
	
	// easy simple determinstic RNG
	random: function() {
		return Math.random();
		/*var x = Math.sin(GLOBAL.SEED++) * 11111;
		return (x - Math.floor(x));*/
	},

	restart: function() {
		if (!GLOBAL.lock) {
			GLOBAL.lock = true;

			// start from empty board
			Game.board = Tools.createEmptyBoard(Tools.SIZE);

			var w = GLOBAL.stageWidth;
			var h = GLOBAL.stageHeight;

			stage.removeAllChildren();

			stage.addChild(newBorder(1,1,w-1,h-1));

			stage.update();

			// populate
			for (var i = 0; i < 4; i++) {
				switch(i) {
					case 0:
						this.populate(Bear, 100);
						break;
					case 1:
						this.populate(Lion, 100);
						break;
					case 2:
						this.populate(TestWolf, 100);
						break;
					default:
						this.populate(Stone, 100);
						break;
				}
			}

			setTimeout(function(){
				GLOBAL.lock = false;
			}, 500);
		}
	},

	init: function(canvas, fps) {

		setTimeout(function() {

			info.setMode(0);
			info.setAll( 'Starting...' );

			console.log("Starting...");

			// start from fresh board
			Game.board = Tools.createEmptyBoard(Tools.SIZE);

			if (!canvas) {
				console.error("Provide the canvas element id to draw on.");
				return;
			}

			Game.rounds = 0;
			Game.iterations = 0;
			Game.isRunning = true;

			// reset data
			DATA.reset();

			// set canvas size
			canvas.width = GLOBAL.stageWidth;
			canvas.height = GLOBAL.stageHeight;

			stage = new createjs.Stage(canvas);
			stage.regX = .5;
			stage.regY = .5;

			var w = GLOBAL.stageWidth;
			var h = GLOBAL.stageHeight;

			stage.addChild(newBorder(1,1,w-1,h-1));

			stage.update();

			// populate
			for (var i = 0; i < 4; i++) {
				switch(i) {
					case 0:
						Game.populate(Bear, 100);
						break;
					case 1:
						Game.populate(Lion, 100);
						break;
					case 2:
						Game.populate(TestWolf, 100);
						break;
					default:
						Game.populate(Stone, 100);
						break;
				}
			}

			setTimeout(Game.simulate, 400);

			createjs.Ticker.on("tick", Game.tick);
			createjs.Ticker.setFPS( GLOBAL.FPS );

		}, Game.isRunning ? 1000 : 500); // setTimeout
	}, // init

	printBoard: function() {
		var size = Tools.SIZE;

		// flipped ( print horizontal first )
		var line = ""
		for (var i = 0; i < size / 2 + 1; i++)
			line += '* ';
		console.log(line);

		for (var j = 0; j < size; j++) {
			var str = "";
			for (var i = 0; i < size; i++) {
				var animal = this.board[i][j][0];
				if (animal != null)
					str += this.board[i][j][0].char;
				else
					str += '.';
			}
			console.log('*' + str + '*');
		}
		console.log(' ' + line);
	},

	drawBoard: function() {
		var size = Tools.SIZE;
		stage.removeAllChildren();

		var w = GLOBAL.stageWidth / Tools.SIZE,
				h = GLOBAL.stageHeight / Tools.SIZE;

		var newBox = function(x, y, color) {
			var b = new createsh.Shape();
			b.snapToPixel = true;
			b.graphics.setStrokeStyle(1).beginStroke(color).rect(0,0,w,h);
			b.x = x;
			b.y = y;
			return b;
		}

		for (var j = 0; j < size; j++) {
			for (var i = 0; i < size; i++) {
				var animal = this.board[i][j][0];
				if (animal != null) {
					var b = newBlock(i * w + 1, j * h + 1, w - 1, h - 1, animal.color || "white");
					stage.addChild(b);
				}
			}
		}

		stage.addChild(newBorder(1,1,GLOBAL.stageWidth-1,GLOBAL.stageHeight-1));
	},

	stop: function() {
		Game.isRunning = false;
		info.setAll("Stopped.");

	},

	simulate: function() {
		if (!Game.isRunning) {
			console.log("Game isn't running");
			return;
		}

		info.setInfo1('Iterations: ' + Game.iterations + "\nRounds: " + Game.rounds);

		var limit = Math.min(GLOBAL.SIM_SPEED, 75);
		for (var i = 0; i < limit; i++) {

			if (Game.iterations < GLOBAL.iterations) {			
				Game.iterate();
				Game.collide();
				Game.iterations++;
			} else {

				Game.iterations = 0;
				//Game.rounds++;
				console.log("round: " + Game.rounds++ + " Complete.")

				DATA.insertData( Game.board );
				DATA.printAvarage();

				// display averages after round
				info.setInfo2(DATA.stringAverage());

				// display it to the html
				$("#BearCount span").text( DATA.getAvgOf(DATA.bears) );
				$("#LionCount span").text( DATA.getAvgOf(DATA.lions) );
				$("#StoneCount span").text( DATA.getAvgOf(DATA.stones) );
				$("#WolfCount span").text( DATA.getAvgOf(DATA.wolves) );

				// check if done
				if (!(Game.rounds <= GLOBAL.rounds)) {
					Game.isRunning = false;
					console.log(Wolf);
					console.log("DONE!")

					info.appendInfo("\nDone!");
					// switch to average view when done.
					setTimeout(function() { if (!Game.isRunning) info.setMode(1); }, 800);

					Game.drawBoard();
					stage.update();

					return;
				}

				Game.restart();
				Game.drawBoard();
				stage.update();
			}

		}	// for loop

		// continue to next step
		setTimeout( Game.simulate, Math.max(1, GLOBAL.SIM_DELAY));
	},

	tick: function() {
		// Game.printBoard();
		//statssetinfo.begin();
		if (this.getFPS() < 100) {
			Game.drawBoard();
			stage.update();
		}
		//stats.end();
	},

	populate: function(species, num) {
		while (num > 0) {
			var row = Math.floor(Game.random() * Tools.SIZE),
					col = Math.floor(Game.random() * Tools.SIZE);
					// console.log("row: " + row + ", col: " + col);
			if (this.board[row][col].length < 1) {
				var babyAnimal = Object.create(species);
				this.board[row][col].push( babyAnimal );
				num--;
			}
		}
	},

	getArea: function(x, y) { // animal position (x,y)
		var SIZE = Tools.SIZE;
		var area = new Array(3);
		for (var i = 0; i < 3; i++) {
			area[i] = new Array(3);
			for (var j = 0; j < 3; j++) {
				var tx = (x + i - 1 + SIZE) % SIZE,
						ty = (y + j - 1 + SIZE) % SIZE;
				var animal = this.board[tx][ty][0];
				area[i][j] = animal != null ? this.board[tx][ty][0].char : ' ';
			}
		}
		return area;
	},

	iterate: function() {
		// create new board to save changes to
		var newBoard = Tools.createEmptyBoard(Tools.SIZE);

		var SIZE = Tools.SIZE;

		// loop through current board and save changes to newBoard
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {
				if (this.board[i][j].length < 1)
					continue;
				var animal = this.board[i][j][0];
				if (animal != null) {
					// give animal its surroundings
					animal.surroundings = this.getArea(i,j);

					// check animals desired move
					switch ( animal.move() ) {
						case MoveEnum.LEFT:
							newBoard[(i - 1 + SIZE) % SIZE][j].push(animal);
							break;
						case MoveEnum.RIGHT:
							newBoard[(i + 1) % SIZE][j].push(animal);
							break;
						case MoveEnum.DOWN:
							newBoard[i][(j + 1) % SIZE].push(animal);
							break;
						case MoveEnum.UP:
							newBoard[i][(j - 1 + SIZE) % SIZE].push(animal);
							break;
						default:
							newBoard[i][j].push(animal);
					}
				}
			}	// for loop
		} // for loop

		// update the current board to reflect the changes
		this.board = newBoard;
	},

	// check for collisions, collisions will trigger fights
	collide: function() {
		var SIZE = Tools.SIZE;

		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {

				var cell = this.board[i][j];
				while (cell.length > 1) {

					// grab two unique indexes at random
					var r1, r2;
					r1 = Math.floor(Game.random() * cell.length);
					do {
						r2 = Math.floor(Game.random() * cell.length);
					} while (r1 === r2)

					// get the corresponding animals
					var a1 = cell[r1];
					var a2 = cell[r2];

					// THERE CAN BE ONLY ONE!
					var atk1 = a1.fight(a2);
					var atk2 = a2.fight(a1);

					// decide the winner
					if (atk1 === atk2) {
							// if both chose the same attack, pick winner at random
							cell.splice(Game.random() > 0.5 ? r1 : r2, 1);
					} else {
						switch (atk1) {
							case AttackEnum.PAPER:
								cell.splice( atk2 === AttackEnum.SCISSORS ? r1 : r2, 1);
								break;
							case AttackEnum.ROCK:
								cell.splice( atk2 === AttackEnum.PAPER ? r1 : r2, 1);
								break;
							case AttackEnum.SCISSORS:
								cell.splice( atk2 === AttackEnum.ROCK ? r1 : r2, 1);
								break;
							default: // no matches (error)
								// kill the animal that gave unrecognized attack
								cell.splice(r1, 1);
						}
					}
				}
			} // for loop
		} // for loop
	}


}

var Animal = {
	char: '',
	surroundings: [],
	MAP_SIZE: Tools.SIZE,

	fight: function(opponent) {
		return AttackEnum.SUICIDE;
	},

	move: function() {
		return AttackEnum.HOLD;
	}
}

var Bear = Object.create(Animal);
Bear.char = 'B';
Bear.color = "green";
Bear.counter = -1;

Bear.fight = function(opponent) {
	return AttackEnum.PAPER;
}

Bear.move = function() {
	if (++this.counter == 16)
		this.counter = 0;
	switch (Math.floor(this.counter / 4)) {
		case 0: return MoveEnum.DOWN;
		case 1: return MoveEnum.RIGHT;
		case 2: return MoveEnum.UP;
		default: return MoveEnum.LEFT;
	}
}

var Lion = Object.create(Animal);
Lion.char = 'L';
Lion.color = "yellow";
Lion.toggle = true;

Lion.fight = function(opponent) {
	return Math.random() > 0.5 ? AttackEnum.PAPER : AttackEnum.SCISSORS;
}

Lion.move = function() {
	this.toggle = !this.toggle;
	return this.toggle ? MoveEnum.DOWN : MoveEnum.RIGHT;
}

var Stone = Object.create(Animal);
Stone.char = 'S';
Stone.color = "gray";
Stone.fight = function(opponent) {
	return AttackEnum.ROCK;
}
Stone.move = function() {
	return MoveEnum.HOLD;
}

var Wolf = Object.create(Animal);
Wolf.char = 'W';
Wolf.color = "blue";

Wolf.fight = function(opponent) {
	switch (opponent.char) {
		case 'B': return AttackEnum.SCISSORS;
		case 'L': return AttackEnum.SCISSORS;
		case 'S': return AttackEnum.PAPER;
		default: return AttackEnum.ROCK;
	}
}
Wolf.move = function() {
	var surr = this.surroundings;
	if (surr != null) {
		if (Math.random() < 0.2)
			return MoveEnum.HOLD;
		switch( Math.floor(Math.random() * 4) ) {
			case 0: return MoveEnum.RIGHT;
			case 1: return MoveEnum.UP;
			case 2: return MoveEnum.LEFT;
			default: MoveEnum.DOWN;
		}
	} else {
		return MoveEnum.HOLD;
	}
}

// my wolf
var StoneGuardianWolf = Object.create(Wolf);
StoneGuardianWolf.color = "#7f1a1a";
StoneGuardianWolf.heartache = 0;

StoneGuardianWolf.fight = function(opponent) {
	this.heartache--;

	switch (opponent.char) {
		case 'B': return AttackEnum.SCISSORS;
		case 'L': 
			console.log("FIGHTING LION");
			return AttackEnum.SCISSORS;
		case 'S': // A motherly sacrifice
			return AttackEnum.SUICIDE;
		case 'W':
			var n = this.heartache % 3;
			if (n < 1) return AttackEnum.PAPER;
			if (n < 2) return AttackEnum.ROCK;
			return AttackEnum.SCISSORS;
	}
}

StoneGuardianWolf.move = function() {
	var surr = this.surroundings;

	var clairvoyance = [];
	for (var i = 0; i < 3; i++)
		clairvoyance[i] = [1, 1, 1];

	var seeNoStone = true;

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (j === 2)
				clairvoyance[i][j] -= 5;

			switch (surr[i][j]) {
				case 'L':
					if (i < 1 && j < 1) {
						clairvoyance[1][0]  += 50;
						clairvoyance[0][1] += 50;
					}

					if (i === 1 && j < 1) { // above
						clairvoyance[1][1] += 50;
					}

					if (i < 1 && j === 1) { // left
						clairvoyance[1][1] += 50;
					}
					break;

				case 'S': // seek stones for protection
					seeNoStone = false;

					clairvoyance[i][j] += 999; // Only hugs!
					if (i < 2)
						clairvoyance[i+1][j] -= 10;
					if (j < 2)
						clairvoyance[i][j+1] -= 10;
					if (i > 0)
						clairvoyance[i-1][j] -= 10;
					if (j > 0)
						clairvoyance[i][j-1] -= 10;
					break;

				case 'B': // ignore bears
					break;

				case 'W':
					// skip self
					if (i === 1 && j === 1)
						continue;
					var m = 25; // avoid wolves
					clairvoyance[i][j] += 100;
					if (i != 1 && j != 1) {
						if (i < 2)
							clairvoyance[i+1][j] += m;
						if (j < 2)
							clairvoyance[i][j+1] += m;
						if (i > 0)
							clairvoyance[i-1][j] += m;
						if (j > 0)
							clairvoyance[i][j-1] += m;
					}
					break;

				default:
					clairvoyance[i][j] += 0;
			}
		} // for loop
	} // for loop

	var size = clairvoyance[1][1];
	var x = 1;
	var y = 1;

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (i != 1 || j != 1)
				continue;
			var tmp = clairvoyance[i][j];
			if (tmp < size) {
				size = tmp;
				x = i;
				y = j;
			}
		}
	}

	if (seeNoStone)
		this.heartache++;

	if (seeNoStone && (this.heartache % 10) === 0 ) { // Find a pet stone! :3
		if ( (this.heartache % 3) < 2 || clairvoyance[1][2] >= 45) {
			// try move right
			if (clairvoyance[2][1] < 45)
				return MoveEnum.RIGHT;
		}

		// try down instead
		if (clairvoyance[1][2] < 45)
			return MoveEnum.DOWN;
	}

	if (x === 0 && y === 1)
		return MoveEnum.LEFT;
	if (x === 2 && y === 1)
		return MoveEnum.RIGHT;
	if (x === 1 && y === 0)
		return MoveEnum.UP;
	if (x === 1 && y === 2)
		return MoveEnum.DOWN;

	return MoveEnum.HOLD;

} // move()

var TestWolf = Object.create(StoneGuardianWolf);