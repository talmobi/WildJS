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
	SEED: 1
}

var Game = {
	MAP_SIZE: 4,
	board: [][],
	random: function() {
		var x = Math.sin(GLOBAL.SEED++) * 10000,
		return x - Math.floor(x);
	}
}

var Wild = {
	MAP_SIZE: Math.round(Math.sqrt((Game.MAP_SIZE + 3) * 20)),
	populate: function(species, num) {
		while (num > 0) {
			var row = Game.random() * Game.MAP_SIZE,
					col = Game.random() * Game.MAP_SIZE;
			if (Game.board[row][col] != null)
				continue;
			Game.board[row][col] = species;
			num--;
		}
	},
	iterate: function() {
		
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