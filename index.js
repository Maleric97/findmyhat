import promptSync from "prompt-sync";
const prompt = promptSync({ sigint: true });

// * Game elements/assets constants
const HAT = "^";
const HOLE = "O";
const GRASS = "░";
const PLAYER = "*";

// * UP / DOWN / LEFT / RIGHT / QUIT (DEFAULT) keyboard constants
const UP = "W";
const DOWN = "S";
const LEFT = "A";
const RIGHT = "D";
const QUIT = "Q";

// * MSG_UP / MSG_DOWN / MSG_LEFT / MSG_RIGHT / MSG_ QUIT / MSG_INVALID message constants
const FEEDBACK_UP = "You moved up.";
const FEEDBACK_DOWN = "You moved down.";
const FEEDBACK_LEFT = "Your moved left.";
const FEEDBACK_RIGHT = "Your moved right.";
const FEEDBACK_INVALID = "Invalid entry.";

// * WIN / LOSE / OUT / QUIT messages constants
const FEEDBACK_WIN_MSG = "Congratulations, you won!";
const FEEDBACK_LOSE_MSG = "You fell into a hole. Game over.";
const FEEDBACK_OUT_MSG = "You stepped out of the platform. Game Over";
const FEEDBACK_QUIT_MSG = "You quit the game. Thank you for playing.";

// * MAP ROWS, COLUMNS AND PERCENTAGE
const ROWS = 10;
const COLS = 10;
const PERCENT = .2; // Percentage on the number of holes in the game map

class Field {

  score = 0;

  // * constructor, a built-in method of a class (invoked when an object of a class is instantiated)
  constructor(field = [[]]) {
    this.field = field;
    this.gamePlay = false;
    this.playerX = 0;
    this.playerY = 0;
  }

  // * generateField is a static method, returning a 2D array of the fields
  static generateField(rows, cols, percentage) {

    const map = [[]];

    for (let i = 0; i < rows; i++) {
      map[i] = [];                                            // generate the row for the map

      for (let j = 0; j < cols; j++) {
        map[i][j] = Math.random() > PERCENT ? GRASS : HOLE;   // ~ 80% GRASS, ~ 20% HOLE
      }

    }

    return map; // return the generated 2D array 

  }

  // * welcomeMessage is a static method, displays a string
  static welcomeMsg(msg) {
    console.log(msg);
  }

  // * setHat positions the hat along a random x and y position within field array
  setHat() {
    const x = Math.floor(Math.random() * (ROWS - 1)) + 1;     // establish a random position of X in the field
    const y = Math.floor(Math.random() * (COLS - 1)) + 1;     // establish a random postion of Y in the field
    this.field[x][y] = HAT;                                   // set the HAT along the derived random position this.field[x][y]
  }

  // * printField displays the updated status of the field position
  printField() {
    this.field.forEach(row => console.log(row.join('')));
  }

  // * updateMove displays the move (key) entered by the user
  updateMove(direction) {
    console.log(direction);
  }

  // !! TODO: updateGame Assessment Challenge
  // Check the following conditions:
  // 1. Whether the player fell into HOLE, end the game
  // 2. Whether the player moved out of the map, end the game
  // 3. Whether the player moved to the HAT, wins the game
  // 4. Whether the player moved to a GRASS spot, update the players's position and continue with the game

 updateGame() {
  if (
    this.playerX < 0 || this.playerX >= ROWS ||
    this.playerY < 0 || this.playerY >= COLS
  ) {
    console.log(FEEDBACK_OUT_MSG);
    this.#end();
    return;
  }

  const currentCell = this.field[this.playerX][this.playerY];

  // If player steps on HOLE patch, game over
  if (currentCell === HOLE) {
    console.log(FEEDBACK_LOSE_MSG);
    this.#end();

  // If player steps on HAT patch, game wins
  } else if (currentCell === HAT) {
    console.log(FEEDBACK_WIN_MSG);
    this.score++;
    this.#end();

  // If player is neither on HOLE or PATCH field, updates with grass patch after player moves
  } else {
    this.field[this.playerX][this.playerY] = PLAYER;
  }
}

  // * start() a public method of the class to start the game
  start() {
    this.gamePlay = true;

    this.field[0][0] = PLAYER;   // set the PLAYER position [0][0]
    this.setHat();               // set the HAT position (randomly)

    while (this.gamePlay) {        // while gamePlay is true, ask the user for an input (W), (A), (S), (D) or (Q)

      this.printField();
      const input = prompt("Enter (w)up, (s)down, (a)left, (d)right. Press (q) to quit: ");
      let flagInvalid = false;   // use a flag to determine if the game entry is correct
      let feedback = "";

      const prevX = this.playerX;
      const prevY = this.playerY;

      switch (input.toUpperCase()) {
        case UP:
          feedback = FEEDBACK_UP;
          this.playerX--;
          break;
        case DOWN:
          feedback = FEEDBACK_DOWN;
          this.playerX++;
          break;
        case LEFT:
          feedback = FEEDBACK_LEFT;
          this.playerY--;
          break;
        case RIGHT:
          feedback = FEEDBACK_RIGHT;
          this.playerY++;
          break;
        case QUIT:
          feedback = FEEDBACK_QUIT_MSG;
          this.#end();
          break;
        default:
          feedback = FEEDBACK_INVALID;
          flagInvalid = true;
          break;
      }

      this.updateMove(feedback);

      if (!flagInvalid) {  // flagInvalid is a boolean (if flagInvalid is NOT false (true))
        // update the game
        
        this.field[prevX][prevY] = GRASS;
        this.updateGame();
      }

    }
  }

  //  * end() a private method to end the game
  #end() {
    this.gamePlay = false;
    console.log (`Final score: ${this.score}`);
  }

}

// * Generate a new field - using Field's static method: generateField
const createField = Field.generateField(ROWS, COLS, PERCENT);

// * Generate a welcome message
Field.welcomeMsg("\n************ WELCOME TO FIND YOUR HAT ************\n");

// * Create a new instance of the game
// * by passing createField as a parameter to the new instance of Field
const gameField = new Field(createField);

// * Invoke method start(...) from the instance of game object
gameField.start();

//  ! method #end() cannot be accessed by the instance of Field - it is a private method
// gameField.#end(); // ❌