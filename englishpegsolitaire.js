const {PegSolitaire} = require('./pegsolitaire');

class EnglishPegSolitaire extends PegSolitaire{
    constructor(initStr = EnglishPegSolitaire.INTIAL_STATE) {
        super(initStr);
    }

    performMove(moveStr, checkIfValid = true) {
        if(checkIfValid && !this.isValidMove(moveStr)) {
            return false;
        }
        let moves = EnglishPegSolitaire.getMoveSequenceFromString(moveStr);
        this.performMoveSequence(moves);
        return true;
    }

    performMoveSequence(moves) {
        moves.forEach(move => super.performMove(move));
    }

    isValidMove(moveStr) {
        let moves = EnglishPegSolitaire.getMoveSequenceFromString(moveStr);
        return this.isValidMoveSequence(moves); 
    }

    isValidMoveSequence(moves) {
        if(!Array.isArray(moves) || moves.length <= 0) {
            return false;
        } else if(moves.length <= 1) {
            return super.isValidMove(moves[0]);
        } else {
            let saveState = this.save();
            for (let i=0; i<moves.length; i++) {
                if(!super.isValidMove(moves[i])) {
                    this.restore(saveState);
                    return false;
                }
                super.performMove(moves[i]);
            }
            this.restore(saveState);
            return true;
        }     
    }

    print() {
        console.log(this.board.map((row, i) => row.join(" ") + "  |  " + EnglishPegSolitaire.POSITION_KEY[i].join(" ")).join("\n"))
    }

    printHoles() {
        console.log([...this.holes].map(hole => EnglishPegSolitaire.getPositionString(hole)));
    }

    printMoves() {
        console.log([...this.moves].map(move => EnglishPegSolitaire.getMoveString(move)));
    }

    isCompleted() {
        return this.moves.size == 0;
    }

    isSolved() {
        return this.holes.size == 32 && !this.holes.has("3,3");
    }

    static getMoveSequenceFromString(moveStr) {
        if(/[a-pA-Px][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = hole position, r = direction of move
            let holePos = moveStr[0];
            let direction = moveStr[1];
            let hole = EnglishPegSolitaire.getPositionFromString(holePos);
            let [row, col] = hole;

            //determine position of source peg
            let srcPeg;
            switch(direction) {
                case "d":
                    srcPeg = [row+2,col];
                    break;
                case "u":
                    srcPeg = [row-2,col];
                    break;
                case "r":
                    srcPeg = [row,col+2];
                    break;
                case "l":
                    srcPeg = [row,col-2];
                    break;
                default:
                    return "";
            }

            return [{srcPeg, hole}];

        } else if(/^([a-pA-Px]-)+[a-pA-Px]$/.test(moveStr)) {
            //test if string of the form "a-b-c" where a is the starting peg, and b,c are the subsequent holes it's moved to
            let moves = [];
            let positions = moveStr.split("-");
            let src = positions.shift();
            while(positions.length > 0) {
                let srcPeg = EnglishPegSolitaire.getPositionFromString(src);
                let hole = EnglishPegSolitaire.getPositionFromString(positions[0]);
                let move = {srcPeg, hole};

                moves.push(move);
                src = positions.shift();
            }
            return moves;
        }

        return [];
    }

    static getPositionFromString(posStr) {
        return EnglishPegSolitaire.ENGLISH_HP_TO_IP_MAP.get(posStr);
    }

    static getPositionString(pos) {
        return EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(EnglishPegSolitaire.getPositionKey(pos));
    }

    static getMoveString(move) {
        return EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(move.slice(0,2)) + "-" + EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(move.slice(2,4));
    }
};

EnglishPegSolitaire.INTIAL_STATE = "2...2/2...2/......./...o.../......./2...2/2...2";
EnglishPegSolitaire.POSITION_KEY = [
    [" ", " ", "a", "b", "c", " ", " "],
    [" ", " ", "d", "e", "f", " ", " "],
    ["g", "h", "i", "j", "k", "l", "m"],
    ["n", "o", "p", "x", "P", "O", "N"],
    ["M", "L", "K", "J", "I", "H", "G"],
    [" ", " ", "F", "E", "D", " ", " "],
    [" ", " ", "C", "B", "A", " ", " "],
];

EnglishPegSolitaire.ENGLISH_HP_TO_IP_MAP = new Map([
    ["a",[0,2]], ["b",[0,3]], ["c",[0,4]], ["d",[1,2]], ["e",[1,3]], ["f",[1,4]], ["g",[2,0]], ["h",[2,1]], ["i",[2,2]], ["j",[2,3]], ["k",[2,4]], 
    ["l",[2,5]], ["m",[2,6]], ["n",[3,0]], ["o",[3,1]], ["p",[3,2]], ["x",[3,3]], ["P",[3,4]], ["O",[3,5]], ["N",[3,6]], ["M",[4,0]], ["L",[4,1]], 
    ["K",[4,2]], ["J",[4,3]], ["I",[4,4]], ["H",[4,5]], ["G",[4,6]], ["F",[5,2]], ["E",[5,3]], ["D",[5,4]], ["C",[6,2]], ["B",[6,3]], ["A",[6,4]]
]);

EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP = new Map([
    ["02","a"], ["03","b"], ["04","c"], ["12","d"], ["13","e"], ["14","f"], ["20","g"], ["21","h"], ["22","i"], ["23","j"], ["24","k"], 
    ["25","l"], ["26","m"], ["30","n"], ["31","o"], ["32","p"], ["33","x"], ["34","P"], ["35","O"], ["36","N"], ["40","M"], ["41","L"], 
    ["42","K"], ["43","J"], ["44","I"], ["45","H"], ["46","G"], ["52","F"], ["53","E"], ["54","D"], ["62","C"], ["63","B"], ["64","A"]
]); 

module.exports = {
    EnglishPegSolitaire
};