# peg-solitaire
---
### About Peg Solitaire

#### How To Play

A peg solitaire board contains pegs and holes
   - Let "." denote a peg and let "o" denote a hole
   - A possible peg solitaire board is shown below
```
          . . .     
          o . .          
      . . . . . . .     
      . . . o . . .     
      o . . . . . .     
          . . .       
          . . .         
```
A valid peg solitaire move involves choosing a peg to move, jumping it over another peg, landing it in a hole, and finally removing the jumped peg
   - This results in two new holes: the hole where the moved peg 
     originated and the hole where the jumped peg was removed
   - This also results in the original hole being filled by the moved peg
   - Note: We can only jump a peg orthogonally, not diagonally

A possible peg solitaire move is shown below
   - Let "*" denote the peg to be moved and "o" the hole it will be jumped 
     into
  - Results in two new holes and the original hole being filled with the 
    moved peg

```
          . . .                . . .
          . * .                . o .
      . . . . . . .        . . . o . . .
      . . . o . . .   ->   . . . * . . .
      . . . . . . .        . . . . . . .
          . . .                . . .
          . . .                . . .
```
- The goal of the game depends on the type of peg solitaire being played (see below)

#### Types of Peg Solitaire

1) **English Peg Solitaire**: The board starts with one hole in the center and the goal is to end up with only one peg in the center by only performing valid moves
```
      Initial State        Solved State
          . . .                o o o
          . . .                o o o
      . . . . . . .        o o o o o o o
      . . . o . . .        o o o . o o o
      . . . . . . .        o o o o o o o
          . . .                o o o
          . . .                o o o
```
2) **European Peg Solitaire**: The board starts with one hole in the center and the goal is to end up with only one peg anywhere on the board by only performing valid moves
```
      Initial State        Solved State
          . . .                o o o
        . . . . .            o o o o o
      . . . . . . .        o o o . o o o
      . . . o . . .        o o o o o o o
      . . . . . . .        o o o o o o o
        . . . . .            o o o o o
          . . .                o o o
```
3) There are many other variants of peg solitaire, but I haven't implemented any of them :P
#### Board Position Notation

1) **Row-Column Notation**
```
      0 1 2 3 4 5 6
    0     . . .
    1     x . .
    2 . . . . . . .
    3 . . . o . . .
    4 y . . . . . .
    5     . . .
    6     . . .
```
- e.g. position of x = [1, 2]
- e.g. position of y = [4, 0]
- e.g. position of o = [3, 3]

2) **Letter Notation**
```
          . . .                a b c
          x . .                d e f
      . . . . . . .        g h i j k l m
      . . . o . . .        n o p x P O N
      y . . . . . .        M L K J I H G
          . . .                F E D
          . . .                C B A
```
- e.g. position of x = "d"
- e.g. position of y = "M"
- e.g. position of o = "x"
---
### Playing Peg Solitaire

You can play a simple command-line based version of peg solitaire provided you have Node.js installed
```
$ node ps_game.js
    . . .      |      a b c
    . . .      |      d e f
. . . . . . .  |  g h i j k l m
. . . o . . .  |  n o p x P O N
. . . . . . .  |  M L K J I H G
    . . .      |      F E D
    . . .      |      C B A

Enter your move (e.g. "e-x"): e-x

    . . .      |      a b c
    . o .      |      d e f
. . . o . . .  |  g h i j k l m
. . . . . . .  |  n o p x P O N
. . . . . . .  |  M L K J I H G
    . . .      |      F E D
    . . .      |      C B A

Enter your move (e.g. "e-x"): undo

    . . .      |      a b c
    . . .      |      d e f
. . . . . . .  |  g h i j k l m
. . . o . . .  |  n o p x P O N
. . . . . . .  |  M L K J I H G
    . . .      |      F E D
    . . .      |      C B A

Enter your move (e.g. "e-x"): moves
E-x, O-x, e-x, o-x
Enter your move (e.g. "e-x"): holes
x
Enter your move (e.g. "e-x"): solve
O-x, p-P, E-x, H-J, K-I, j-J, l-j, i-k, b-j, a-i, M-K, g-M, J-H, A-I, C-A, j-l, m-k, G-m, h-j, j-l, c-k, P-f, m-k, f-P, P-D, A-I, H-J, J-L, M-K, F-p, o-x
Enter your move (e.g. "e-x"): quit
```
---
### Using the API
```
//Initializing the game
let game = new EnglishPegSolitaire();

//Constructing the move "e-x" from a string
let moveSeq = EnglishPegSolitaire.stringToMoveSequence("e-x");
let move1 = moveSeq[0] //move sequence array contains moves

//Constructing the move "e-x" from peg & hole positions
let pegPos = [1,3]; //e
let holePos = [3,3] //x
let move2 = EnglishPegSolitaire.positionsToMove(pegPos, holePos);

//Check if a move is valid before performing it
if(game.isValidMove(move1)) {
    console.log("The move is valid");
}

//Performing a move
game.performMove(move1);

//Undoing the last move
game.undo();

//Resetting the game to the initial state
game.reset();

//Printing the puzzle board
game.print();

//Get a move sequence that will solve the game
//Note: Will take at most 1 min to complete and might use a lot of memory
//TODO: optimize this function
let solution = game.solve();

//Empty array returned if not solvable (or timeout)
if(solution.length === 0) {
    console.log("The puzzle is not solvable");
}
```