const readline = require('readline');

const {EnglishPegSolitaire} = require('./ps');


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
        if(moveStr == "moves") {
            console.log(game.getMoves());
        }else if(moveStr == "print") {
            game.print();
        }else if(moveStr == "holes") {
            game.printHoles();
        }else if(moveStr == "q") {
            rl.close();
            return;
        } else if(!game.isValidMove(moveStr)) {
            console.error("Invalid move");
        } else {
            game.performMove(moveStr);
            console.log("");
            game.print();
            // console.log(game.state.save());
            console.log("");

            if(game.isSolved()) {
                console.log("Congratulations, you solved the puzzle!");
                rl.close();
                return;
            }
        }
        promptMove();
    });
}
