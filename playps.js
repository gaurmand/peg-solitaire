const readline = require('readline');

const {EnglishPegSolitaire} = require('./englishpegsolitaire');
const {EuropeanPegSolitaire} = require('./europeanpegsolitaire');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let gameType = process.argv[2];
let GAME;
if(!gameType || gameType.toUpperCase().startsWith("EN")) {
    GAME = EnglishPegSolitaire;
} else if(gameType.toUpperCase().startsWith("EU") ) {
    GAME = EuropeanPegSolitaire;
} else {
    console.log("Incorrect game type specified: use \"english\" or \"european\"");
    process.exit();
}

let game = new GAME();

function printGame() {
    console.log("");
    game.print();
    console.log("");
}

printGame();
promptMove();

function promptMove() {
    rl.question('Enter your move (e.g. \"e-x\"): ', (moveStr) => {
        if(moveStr == "moves" || moveStr == "m") {
            game.printMoves();
        } else if(moveStr == "print" || moveStr == "p") {
            printGame();
        } else if(moveStr == "holes" || moveStr == "h") {
            game.printHoles();
        } else if(moveStr == "reset" || moveStr == "r") {
            game.reset();
            printGame();
        } else if(moveStr == "undo" || moveStr == "u") {
            game.undo();
            printGame();
        } else if(moveStr == "solve" || moveStr == "s") {
            let solution = game.solve();
            if(!solution) {
                console.log("No solution found");
            } else {
                console.log(solution);
            }
        } else if(moveStr == "optsolve" || moveStr == "o") {
            let solution = game.optSolve();
            if(!solution) {
                console.log("No solution found");
            } else {
                console.log(solution);
            }
        } else if(moveStr == "altsolve" || moveStr == "a") {
            let solution = game.altSolve();
            if(!solution) {
                console.log("No solution found");
            } else {
                console.log(solution);
            }
        } else if(moveStr == "quit" || moveStr == "q") {
            rl.close();
            return;
        } else {
            let moves = GAME.stringToMoveSequence(moveStr);

            if(game.isValidMoveSequence(moves)) {
                game.performMoveSequence(moves);
                printGame();
    
                if(game.isCompleted()) {
                    if(game.isSolved()) {
                        console.log("Congratulations, you solved the puzzle!");
                    } else {
                        console.log("Oh no, you have no more remaining moves");
                    }
                    rl.close();
                    return;
                }
            } else {
                console.error("Invalid move");
            }
        }
        promptMove();
    });
}
