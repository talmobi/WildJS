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
	SEED: 1,
	FPS: 10,
	SUBMISSIONS: 1,
	stageWidth: 320,
	stageHeight: 320
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

var Game = {
	board: Tools.createEmptyBoard(Tools.SIZE),
	
	// easy simple determinstic RNG
	random: function() {
		return Math.random();
		var x = Math.sin(GLOBAL.SEED++) * 11111;
		return (x - Math.floor(x));
	},

	init: function(canvas) {
		// set canvas size
		canvas.width = GLOBAL.stageWidth;
		canvas.height = GLOBAL.stageHeight;

		if (!canvas) {
			console.error("Provide the canvas element id to draw on.");
			return;
		}

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
					this.populate(Bear, 100);
				case 1:
					this.populate(Lion, 100);
				case 2:
					this.populate(Wolf, 100);
				default:
					this.populate(Stone, 100);
			}
		}

		createjs.Ticker.on("tick", this.tick);
		createjs.Ticker.setFPS( GLOBAL.FPS );
	},

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

	tick: function() {
		Game.iterate();
		Game.collide();
		
		
		Game.drawBoard();
		// Game.printBoard();
		stage.update();
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
							newBoard[i][(j - 1 + SIZE) % SIZE].push(animal);
							break;
						case MoveEnum.UP:
							newBoard[i][(j + 1) % SIZE].push(animal);
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
Bear.color = "brown";
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
	var surroundings = this.surroundings;
	if (surroundings != null) {
		if (Math.random() < 0.2)
			return MoveEnum.HOLD;
		switch( Math.floor(Math.random() * 4) ) {
			case 0: return MoveEnum.RIGHT;
			case 1: return MoveEnum.UP;
			case 2: return MoveEnum.LEFT;
			default: MoveEnum.DOWN;
		}
	} else {
		console.error("surroundings is: " + surroundings);
	}
}

