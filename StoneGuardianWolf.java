package animals;

public class StoneGuardianWolf extends Animal {
	public StoneGuardianWolf() {
		super('W');
	}

	public Attack fight(char c) {
		switch (c) {
		case 'B':
			return Attack.SCISSORS;
		case 'L':
			return Attack.SCISSORS;
		case 'S': // A motherly sacrifice
			return Attack.SUICIDE;
		default:
			int n = (int) (Math.random() * 3);
			if (n < 1)
				return Attack.PAPER;
			if (n < 2)
				return Attack.ROCK;
			return Attack.SCISSORS;
		}
	}

	public Move move() {
		char[][] surr = this.surroundings;
		int[][] clairvoyance = new int[3][3];

		for (int i = 0; i < 3; i++)
			for (int j = 0; j < 3; j++)
				clairvoyance[i][j] = 1;

		boolean seeNoStone = true;

		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 3; j++) {
				switch (surr[i][j]) {
				case 'L':
					if (i < 1 && j < 1) {
						clairvoyance[1][0] += 50;
						clairvoyance[0][1] += 50;
					}

					if (i == 1 && j < 1) { // above
						clairvoyance[1][1] += 50;
					}

					if (i < 1 && j == 1) { // left
						clairvoyance[1][1] += 50;
					}
					break;

				case 'S': // seek stones for protection
					seeNoStone = false;
					clairvoyance[i][j] += 999; // Only hugs!
					if (i < 2)
						clairvoyance[i + 1][j] -= 10;
					if (j < 2)
						clairvoyance[i][j + 1] -= 10;
					if (i > 0)
						clairvoyance[i - 1][j] -= 10;
					if (j > 0)
						clairvoyance[i][j - 1] -= 10;
					break;

				case 'B': // ignore bears
					break;

				case 'W':
					// skip self
					if (i == 1 && j == 1)
						continue;
					int m = 25; // avoid wolves
					clairvoyance[i][j] += m * 3;
					if (i < 2)
						clairvoyance[i + 1][j] += m;
					if (j < 2)
						clairvoyance[i][j + 1] += m;
					if (i > 0)
						clairvoyance[i - 1][j] += m;
					if (j > 0)
						clairvoyance[i][j - 1] += m;
					break;

				default:
					clairvoyance[i][j] += 0;
				}
			} // for loop
		} // for loop

		int size = clairvoyance[1][1];
		int x = 1;
		int y = 1;

		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 3; j++) {
				if (i != 1 || j != 1)
					continue;
				int tmp = clairvoyance[i][j];
				if (tmp < size) {
					size = tmp;
					x = i;
					y = j;
				}
			}
		}

		if (seeNoStone) { // Find a pet stone! :3
			if (Math.random() < .5 || clairvoyance[1][2] >= 45) {
				// try move right
				if (clairvoyance[2][1] < 45)
					return Move.RIGHT;
			}

			// try down instead
			if (clairvoyance[1][2] < 45)
				return Move.DOWN;
		}

		if (x == 0 && y == 1)
			return Move.LEFT;
		if (x == 2 && y == 1)
			return Move.RIGHT;
		if (x == 1 && y == 0)
			return Move.UP;
		if (x == 1 && y == 2)
			return Move.DOWN;

		return Move.HOLD;
	}
}
