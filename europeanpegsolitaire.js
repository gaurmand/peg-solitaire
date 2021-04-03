const {PegSolitaire} = require('./pegsolitaire');

class EuropeanPegSolitaire extends PegSolitaire{
    constructor(initStr = EuropeanPegSolitaire.INTIAL_STATE) {
        super(initStr);
    }

    print(printPosKey = true) {
        console.log(this.board.map((row, i) => row.join(" ") + (printPosKey ? "  |  " + EuropeanPegSolitaire.POSITION_KEY[i].join(" ") : "")).join("\n"))
    }

    printHoles() {
        console.log(this.holes.map(hole => EuropeanPegSolitaire.positionToString(hole)).sort().join(", "));
    }

    printMoves() {
        console.log(this.moves.map(move => EuropeanPegSolitaire.moveToString(move)).sort().join(", "));
    }

    isSolved() {
        return this.holes.length === 36;
    }

    solve() {
        return super.solve().map(move => EuropeanPegSolitaire.moveToString(move)).join(", ");
    }

    hash() {
        const getBit = char => (char === "." ? "1" : "0");
        let str =   
            getBit(this.board[0][2]) + getBit(this.board[0][3]) + getBit(this.board[0][4]) + 
            getBit(this.board[1][1]) + getBit(this.board[1][2]) + getBit(this.board[1][3]) + getBit(this.board[1][4]) + getBit(this.board[1][5]) +
            getBit(this.board[2][0]) + getBit(this.board[2][1]) + getBit(this.board[2][2]) + getBit(this.board[2][3]) + getBit(this.board[2][4]) + getBit(this.board[2][5]) + getBit(this.board[2][6]) + 
            getBit(this.board[3][0]) + getBit(this.board[3][1]) + getBit(this.board[3][2]) + getBit(this.board[3][3]) + getBit(this.board[3][4]) + getBit(this.board[3][5]) + getBit(this.board[3][6]) + 
            getBit(this.board[4][0]) + getBit(this.board[4][1]) + getBit(this.board[4][2]) + getBit(this.board[4][3]) + getBit(this.board[4][4]) + getBit(this.board[4][5]) + getBit(this.board[4][6]) + 
            getBit(this.board[5][1]) + getBit(this.board[5][2]) + getBit(this.board[5][3]) + getBit(this.board[5][4]) + getBit(this.board[5][5]) +
            getBit(this.board[6][2]) + getBit(this.board[6][3]) + getBit(this.board[6][4]);

        return parseInt(str, 2);
    }

    static stringToMoveSequence(moveStr) {
        if(/[a-pA-PxyYzZ][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = src peg position, r = direction of move
            let srcPos = moveStr[0];
            let direction = moveStr[1];
            let srcPeg = EuropeanPegSolitaire.stringToPosition(srcPos);
            let [row, col] = srcPeg;

            //determine position of hole
            let hole;
            switch(direction) {
                case "d":
                    hole = [row+2,col];
                    break;
                case "u":
                    hole = [row-2,col];
                    break;
                case "r":
                    hole = [row,col+2];
                    break;
                case "l":
                    hole = [row,col-2];
                    break;
                default:
                    return "";
            }

            return [{srcPeg, hole}];

        } else if(/^([a-pA-PxyYzZ]-)+[a-pA-PxyYzZ]$/.test(moveStr)) {
            //test if string of the form "a-b-c" where a is the starting peg, and b,c are the subsequent holes it's moved to
            let moves = [];
            let positions = moveStr.split("-");
            let src = positions.shift();
            while(positions.length > 0) {
                let srcPeg = EuropeanPegSolitaire.stringToPosition(src);
                let hole = EuropeanPegSolitaire.stringToPosition(positions[0]);
                let move = {srcPeg, hole};

                moves.push(move);
                src = positions.shift();
            }
            return moves;
        }

        return [];
    }

    static stringToPosition(posStr) {
        return EuropeanPegSolitaire.ENGLISH_HP_TO_IP_MAP.get(posStr);
    }

    static positionToString(pos) {
        return EuropeanPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(pos[0].toString() + pos[1].toString());
    }

    static moveToString(move) {
        return EuropeanPegSolitaire.positionToString(move.srcPeg) + "-" + EuropeanPegSolitaire.positionToString(move.hole);
    }
};

EuropeanPegSolitaire.INTIAL_STATE = "2...2/1.....1/......./...o.../......./1.....1/2...2";
EuropeanPegSolitaire.POSITION_KEY = [
    [" ", " ", "a", "b", "c", " ", " "],
    [" ", "y", "d", "e", "f", "z", " "],
    ["g", "h", "i", "j", "k", "l", "m"],
    ["n", "o", "p", "x", "P", "O", "N"],
    ["M", "L", "K", "J", "I", "H", "G"],
    [" ", "Z", "F", "E", "D", "Y", " "],
    [" ", " ", "C", "B", "A", " ", " "],
];

EuropeanPegSolitaire.ENGLISH_HP_TO_IP_MAP = new Map([
    ["a",[0,2]], ["b",[0,3]], ["c",[0,4]], 
    ["y",[1,1]], ["d",[1,2]], ["e",[1,3]], ["f",[1,4]], ["z",[1,5]], 
    ["g",[2,0]], ["h",[2,1]], ["i",[2,2]], ["j",[2,3]], ["k",[2,4]], ["l",[2,5]], ["m",[2,6]], 
    ["n",[3,0]], ["o",[3,1]], ["p",[3,2]], ["x",[3,3]], ["P",[3,4]], ["O",[3,5]], ["N",[3,6]], 
    ["M",[4,0]], ["L",[4,1]], ["K",[4,2]], ["J",[4,3]], ["I",[4,4]], ["H",[4,5]], ["G",[4,6]], 
    ["Z",[5,1]], ["F",[5,2]], ["E",[5,3]], ["D",[5,4]], ["Y",[5,5]], 
    ["C",[6,2]], ["B",[6,3]], ["A",[6,4]]
]);

EuropeanPegSolitaire.ENGLISH_IP_TO_HP_MAP = new Map([
    ["02","a"], ["03","b"], ["04","c"], 
    ["11","y"], ["12","d"], ["13","e"], ["14","f"], ["15","z"],
    ["20","g"], ["21","h"], ["22","i"], ["23","j"], ["24","k"], ["25","l"], ["26","m"], 
    ["30","n"], ["31","o"], ["32","p"], ["33","x"], ["34","P"], ["35","O"], ["36","N"], 
    ["40","M"], ["41","L"], ["42","K"], ["43","J"], ["44","I"], ["45","H"], ["46","G"], 
    ["51","Z"], ["52","F"], ["53","E"], ["54","D"], ["55","Y"],
    ["62","C"], ["63","B"], ["64","A"]
]); 

module.exports = {
    EuropeanPegSolitaire
};