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
                        this.holes.add(row + "," + col);
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

        // console.log(this.holes);
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

    getMoves() {
        let moves = [];
        this.holes.forEach(hole => {
            let row = parseInt(hole[0]);
            let col = parseInt(hole[2]);

            //check above peg
            if(row-2 >= this.minRow && this.board[row-2][col] === "." && this.board[row-1][col] === ".") {
                moves.push({hole: hole, direction: "d" });
            }
            //check below peg
            if(row+2 <= this.maxRow && this.board[row+2][col] === "." && this.board[row+1][col] === ".") {
                moves.push({hole: hole, direction: "u" });
            }
            //check left peg
            if(col-2 >= this.minCol && this.board[row][col-2] === "." && this.board[row][col-1] === ".") {
                moves.push({hole: hole, direction: "r" });
            }
            //check right peg
            if(col+2 <= this.maxCol && this.board[row][col+2] === "." && this.board[row][col+1] === ".") {
                moves.push({hole: hole, direction: "l" });
            }
        });
        return moves;
    }

    performMove(move) {
        //determine positions of moved & jumped pegs
        let [row, col] = move.hole;
        let movedPeg, jumpedPeg;
        switch(move.direction) {
            case "d":
                movedPeg = [row-2, col];
                jumpedPeg = [row-1, col];
                break;
            case "u":
                movedPeg = [row+2, col];
                jumpedPeg = [row+1, col];
                break;
            case "r":
                movedPeg = [row, col-2];
                jumpedPeg = [row, col-1];
                break;
            case "l":
                movedPeg = [row, col+2];
                jumpedPeg = [row, col+1];
                break;
            default:
                return false;
        }

        //replace moved & jumped pegs with holes
        this.board[movedPeg[0]][movedPeg[1]] = "o";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = "o";
        this.holes.add(movedPeg.join(","));
        this.holes.add(jumpedPeg.join(","));

        //replace hole that peg jumped into with the peg
        this.holes.delete(move.hole.join(","));
        this.board[row][col] = ".";

        // console.log(this.holes);
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

    isValidMove(move) {
        //check if move contains hole and direction
        if(!move.hole || !move.direction) {
            return false;
        }

        //check if hole is in hole array
        if(!this.holes.has(move.hole.join(","))) {
            return false;
        }

        let [row, col] = move.hole;

        //check if hole position is valid position on board
        if(row < this.minRow || row > this.maxRow || col < this.minCol || col > this.maxCol) {
            return false;
        }

        //check if hole is in hole position
        if(this.board[row][col] !== "o") {
            return false;
        }

        //check if pegs are in correct positions around hole
        switch(move.direction) {
            case "d":
                return (row-2 >= this.minRow && this.board[row-2][col] === "." && this.board[row-1][col] === ".");
            case "u":
                return (row+2 <= this.maxRow && this.board[row+2][col] === "." && this.board[row+1][col] === ".");
            case "r":
                return (col-2 >= this.minCol && this.board[row][col-2] === "." && this.board[row][col-1] === ".")
            case "l":
                return (col+2 <= this.maxCol && this.board[row][col+2] === "." && this.board[row][col+1] === ".");
            default:
                return false;
        }
    }

    print() {
        console.log(this.board.map(row => row.join(" ")).join("\n"))
    }

    printHoles() {
        console.log(...this.holes)
    }

    printPosKey() {
        console.log(this.boardPositions.map(row => row.join(" ")).join("\n"))
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
    }

    static getDirection(peg, hole) {
        if(peg[1] === hole[1]) {
            if(peg[0] == hole[0]-2) {
                return "d";
            } else if(peg[0] == hole[0]+2) {
                return "u";
            }
        } else if(peg[0] == hole[0]) {
            if(peg[1] == hole[1]-2) {
                return "r";
            } else if(peg[1] == hole[1]+2) {
                return "l";
            }
        }
        return "";
    }
};

PegSolitaireState.INITIAL_EUROPEAN_STATE = "2...2/1.....1/......./...o.../....../1.....1/2...2";

class EnglishPegSolitaire extends PegSolitaireState{
    constructor(initStr = EnglishPegSolitaire.INTIAL_STATE) {
        super(initStr);
    }

    performMove(moveStr) {
        let moves = EnglishPegSolitaire.getMovesFromString(moveStr);
        moves.forEach(move =>  super.performMove(move));
    }

    isValidMoveString(moveStr) {
        let moves = EnglishPegSolitaire.getMovesFromString(moveStr);
        return this.isValidMoveSequence(moves);
    }

    static getPositionFromArray(pos) {
        if(!pos || pos.length !== 2) {
            return "";
        }
        let key = pos[0].toString() + pos[1].toString();
        return EnglishPegSolitaire.ENGLISH_IP_TO_HP_MAP.get(key);
    }

    static getMovesFromString(moveStr) {
        if(/[a-pA-Px][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = hole position, r = direction of move
            let pos = moveStr[0];
            let direction = moveStr[1];
            let hole = EnglishPegSolitaire.ENGLISH_HP_TO_IP_MAP.get(pos);
            return [{hole, direction}];

        } else if(/^([a-pA-Px]-)+[a-pA-Px]$/.test(moveStr)) {
            //test if string of the form "a-b-c" where a is the starting peg, and b,c are the subsequent holes it's moved to
            let moves = [];
            let positions = moveStr.split("-");
            let src = positions.shift();
            while(positions.length > 0) {
                let peg = EnglishPegSolitaire.ENGLISH_HP_TO_IP_MAP.get(src);
                let hole = EnglishPegSolitaire.ENGLISH_HP_TO_IP_MAP.get(positions[0]);
                let direction = PegSolitaireState.getDirection(peg, hole);
                let move = {hole, direction};

                moves.push(move);
                src = positions.shift();
            }
            return moves;
        }

        return [];
    }

    print() {
        console.log(this.board.map((row, i) => row.join(" ") + "  |  " + EnglishPegSolitaire.POSITION_KEY[i].join(" ")).join("\n"))
    }

    isSolved() {
        return this.holes.size == 32 && !this.holes.has("3,3");
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