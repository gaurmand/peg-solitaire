const readline = require('readline');

const {EnglishPegSolitaire} = require('./englishpegsolitaire');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let game = new EnglishPegSolitaire();
game.print();
console.log("");
promptMove();

function promptMove() {
    rl.question('Enter your move (e.g. \"e-x\"): ', (moveStr) => {
        if(moveStr == "moves" || moveStr == "m") {
            game.printMoves();
        } else if(moveStr == "print" || moveStr == "p") {
            game.print();
        } else if(moveStr == "holes" || moveStr == "h") {
            game.printHoles();
        } else if(moveStr == "reset" || moveStr == "r") {
            game.reset();
        } else if(moveStr == "undo" || moveStr == "u") {
            game.undo();
        } else if(moveStr == "solve" || moveStr == "s") {
            let solution = game.solve();
            if(solution.length <= 0) {
                console.log("No solution found");
            } else {
                console.log(solution);
            }
        } else if(moveStr == "quit" || moveStr == "q") {
            rl.close();
            return;
        } else {
            let moves = EnglishPegSolitaire.stringToMoveSequence(moveStr);
            if(game.isValidMoveSequence(moves)) {
                game.performMoveSequence(moves);
                console.log("");
                game.print();
                console.log("");
    
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
