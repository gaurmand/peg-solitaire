class PegSolitaireState {
    constructor(str) {
        if(!PegSolitaireState.isValidInitString(str)) {
            throw new Error("Invalid initialization string");
        }

        this.board = [[]];
        this.holes = new Set();
        this.numValidPositions = 0;

        let row = 0;
        let col = 0;
        let isDigit = char => /^\d+$/.test(char);

        [...str].forEach(char => {
            if(isDigit(char)) {
                let num = parseInt(char);
                for(let i=col; i<col+num; i++) {
                    this.board[row].push(" ");
                }
                col = col+num;
            } else {
                switch(char) {
                    case "o":
                        this.holes.add(row.toString() + col.toString());
                    case ".":
                        this.board[row].push(char);
                        col++
                        this.numValidPositions++;
                        break; 
                    case "/":
                        row++;
                        col = 0;
                        this.board.push([]);
                        break;
                    default:
                        throw new Error("Invalid initialization string");
                }
            }
        });

        this.minRow = 0;
        this.minCol = 0;
        this.maxRow = this.board.length - 1;
        this.maxCol = this.board[0].length - 1;
        this.updateMoves();
    }

    updateMoves() {
        this.moves = new Set(this.computeMoves().map(move => PegSolitaireState.getMoveKey(move)));
    }

    getMoves() {
        return [...this.moves]
    }

    computeMoves() {
        let moves = [];
        this.holes.forEach(holeStr => {
            let row = parseInt(holeStr[0]);
            let col = parseInt(holeStr[1]);
            let hole = [row, col];

            //check above peg
            if(row-2 >= this.minRow && this.board[row-2][col] === "." && this.board[row-1][col] === ".") {
                moves.push({srcPeg: [row-2,col], hole: hole});
            }
            //check below peg
            if(row+2 <= this.maxRow && this.board[row+2][col] === "." && this.board[row+1][col] === ".") {
                moves.push({srcPeg: [row+2,col], hole: hole});
            }
            //check left peg
            if(col-2 >= this.minCol && this.board[row][col-2] === "." && this.board[row][col-1] === ".") {
                moves.push({srcPeg: [row,col-2], hole: hole});
            }
            //check right peg
            if(col+2 <= this.maxCol && this.board[row][col+2] === "." && this.board[row][col+1] === ".") {
                moves.push({srcPeg: [row,col+2], hole: hole});
            }
        });
        return moves;
    }

    performMove(move) {
        let hole = move.hole;
        let srcPeg = move.srcPeg;
        let [row, col] = hole;

        //determine position of jumped peg
        let jumpedPeg = PegSolitaireState.getJumpedPeg(move);

        //replace moved & jumped pegs with holes
        this.board[srcPeg[0]][srcPeg[1]] = "o";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = "o";
        this.holes.add(PegSolitaireState.getPositionKey(srcPeg));
        this.holes.add(PegSolitaireState.getPositionKey(jumpedPeg));

        //replace hole that peg jumped into with the peg
        this.holes.delete(PegSolitaireState.getPositionKey(hole));
        this.board[row][col] = ".";

        this.updateMoves();
    }

    performMoveSequence(moves) {
        moves.forEach(move => this.performMove(move));
    }

    isValidMove(move) {
        //check if move contains hole and source peg
        if(!move.hole || !move.srcPeg || !Array.isArray(move.hole) || !Array.isArray(move.srcPeg)) {
            return false;
        }

        //check if move is in move set
        return this.moves.has(PegSolitaireState.getMoveKey(move));
    }

    isValidMoveSequence(moves) {
        if(!Array.isArray(moves) || moves.length <= 0) {
            return false;
        } else if(moves.length <= 1) {
            return this.isValidMove(moves[0]);
        } else {
            let saveState = this.save();
            for (let i=0; i<moves.length; i++) {
                if(!this.isValidMove(moves[i])) {
                    this.restore(saveState);
                    return false;
                }
                this.performMove(moves[i]);
            }
            this.restore(saveState);
            return true;
        }     
    }

    print() {
        console.log(this.board.map(row => row.join(" ")).join("\n"))
    }

    printHoles() {
        console.log([...this.holes])
    }

    printMoves() {
        console.log([...this.moves])
    }

    save() {
        return {
            board: this.board.map(row => row.slice()),
            holes: new Set(this.holes)
        };
    }

    restore(save) {
        this.board = save.board;
        this.holes = save.holes;
        this.updateMoves();
    }

    
    static isValidInitString(str) {
        //check if string is valid size
        if(!str || str.length === 0) {
            return false;
        }

        //check if string contains only ".", "o", and "/" characters
        if(!/^[\d.o/]+$/.test(str)) {
            return false;
        }

        //check if string doesnt start or end with "/"
        if(str[0] === "/" || str[str.length-1] === "/") {
            return false;
        }

        //check if string creates a rectangular board array (Note: the board itself doesn't necessarily have to be rectangular)
        let isDigit = char => /^\d+$/.test(char);
        let rowLengths = str.split("/").map(rowStr => {
            let length = 0;
            [...rowStr].forEach(char => {
                if(isDigit(char)) {
                    length += parseInt(char);
                } else {
                    length++;
                }
            });
            return length;
        });
        if(!rowLengths.every(length => length === rowLengths[0])) {
            return false;
        }

        return true;
    }

    static getJumpedPeg(move) {
        let srcPeg = move.srcPeg;
        let [row, col] = move.hole;

        if(srcPeg[1] === col) {
            if(srcPeg[0] === row-2) {
                //peg above hole
                return [row-1, col];
            } else if(srcPeg[0] == row+2){
                //peg below hole
                return [row+1, col];
            }
        } else if(srcPeg[0] === row) {
            if(srcPeg[1] === col-2) {
                //peg left of hole
                return [row, col-1];
            } else if(srcPeg[1] == col+2){
                //peg right of hole
                return [row, col+1];
            }
        }
        return [];
    }

    static getMoveKey(move) {
        return move.srcPeg[0].toString() + move.srcPeg[1].toString() + move.hole[0].toString() + move.hole[1].toString();
    }

    static getPositionKey(hole) {
        return hole[0].toString() + hole[1].toString();
    }
};

PegSolitaireState.INITIAL_EUROPEAN_STATE = "2...2/1.....1/......./...o.../....../1.....1/2...2";

class EnglishPegSolitaire extends PegSolitaireState{
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
        return EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(PegSolitaireState.getPositionKey(pos));
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