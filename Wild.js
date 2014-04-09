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

var GLOBAL = {
	SEED: 1,
	MAP_SIZE: 4
}

var Game = {
	SIZE: Math.round(Math.sqrt((GLOBAL.MAP_SIZE + 3) * 20)),
	board: [this.SIZE][this.SIZE][],
	
	// easy simple determinstic RNG
	random: function() {
		var x = Math.sin(GLOBAL.SEED++) * 10000,
		return x - Math.floor(x);
	},


	populate: function(species, num) {
		while (num > 0) {
			var row = Game.random() * this.SIZE,
					col = Game.random() *	this.SIZE;
			if (this.map[row][col].length > 0)
				continue;
			this.map[row][col] = species;
			num--;
		}
	},

	getArea: function(x, y) { // animal position (x,y)
		var area = [3][3];
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var tx = (x + i - 1 + SIZE) % SIZE,
						ty = (y + j - 1+ SIZE) % SIZE;
				area[i][j] = this.board[tx][ty][0].char || ' ';
			}
		}
	},

	iterate: function() {
		// create new board to save changes to
		var newBoard = [this.SIZE][this.SIZE][];

		// loop through current board and save changes to newBoard
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {
				var animal = this.board[i][j];
				if (animal != null && animal instanceof Animal) {
					// give animal its surroundings
					animal.surroundings = this.getArea(i,j);

					// check animals desired move
					switch ( animal.move() ) {
						case MoveEnum.LEFT:
							newBoard[(i - 1 + SIZE) % SIZE][j].push(animal);
							break;
						case MoveEnum.RIGHT
							newBoard[(i + 1) % SIZE][j].push(animal);
							break;
						case MoveEnum.DOWN:
							newBoard[(i][(j - 1 + SIZE) % SIZE].push(animal);
							break;
						case MoveEnum.UP:
							newBoard[(i][(j + 1) % SIZE].push(animal);
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
		for (var i = 0; i < SIZE; i++) {
			for (var j = 0; j < SIZE; j++) {

				var cell = this.board[i][j];
				while (cell.length > 1) {

					// grab two unique indexes at random
					var r1, r2;
					r1 = Game.random() * cell.length;
					do {
						r2 = Game.random() * cell.length;
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
								cell.splice( atk2 === AttackEnum.SCISSORS ? r1 : r2 );
								break;
							case AttackEnum.ROCK:
								cell.splice( atk2 === AttackEnum.PAPER ? r1 : r2 );
								break;
							case AttackEnum.SCISSORS:
								cell.splice( atk2 === AttackEnum.ROCK ? r1 : r2 );
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
	surroundings: [][],
	MAP_SIZE: Wild.MAP_SIZE,

	fight: function(opponent) {
		return AttackEnum.SUICIDE;
	},

	move: function() {
		return AttackEnum.HOLD;
	}
}

var Bear = Object.create(Animal);
Bear.char = 'B';
Bear.counter = -1;

Bear.fight = function(opponent) {
	return AttackEnum.PAPER;
}

Bear.move = function() {
	if (++counter == 16)
		counter = 0;
	switch (counter / 4) {
		case 0: return MoveEnum.DOWN;
		case 1: return MoveEnum.RIGHT;
		case 2: return MoveEnum.UP;
		default: return MoveEnum.LEFT;
	}
}

var Lion = Object.create(Animal);
Lion.char = 'L';
Lion.toggle = true;

Lion.fight = function(opponent) {
	return Math.random() > 0.5 ? AttackEnum.PAPER : AttackEnum.SCISSORS;
}

Lion.move = function() {
	toggle = !toggle;
	return toggle ? MoveEnum.DOWN : MoveEnum.RIGHT;
}

var Stone = Object.create(Animal);
Stone.char = 'S';
Stone.fight = function(opponent) {
	return AttackEnum.ROCK;
}
Stone.move = function() {
	return MoveEnum.HOLD;
}

var Wolf = Object.create(Animal);
Wolf.char = 'W';
Wolf.fight = function(opponent) {
	switch (opponent.char) {
		case 'B': return AttackEnum.SCISSORS;
		case 'L': return AttackEnum.SCISSORS;
		case 'S': return AttackEnum.PAPER;
		default: return AttackEnum.ROCK;
	}
}
Wolf.move = function() {
	if (surroundings[0][1] == null)
		return MoveEnum.UP;
	if (surroundings[1][2] == null)
		return MoveEnum.RIGHT;
	if (surroundings[1][0] == null)
		return MoveEnum.LEFT;
	return Move.DOWN;
}

