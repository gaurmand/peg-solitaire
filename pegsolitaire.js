class PegSolitaire {
    constructor(str) {
        if(!PegSolitaire.isValidInitString(str)) {
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

        this.moveHistory = [];
        this.initialState = this.save();
        this.updateMoves();
    }

    getMoves() {
        return [...this.moves]
    }

    updateMoves() {
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
        this.moves = new Set(moves.map(move => PegSolitaire.getMoveKey(move)));
    }

    isCompleted() {
        return this.moves.size === 0;
    }

    performMove(move, updateMoves = true) {
        let hole = move.hole;
        let srcPeg = move.srcPeg;
        let [row, col] = hole;

        //determine position of jumped peg
        let jumpedPeg = PegSolitaire.getJumpedPeg(move);

        //replace moved & jumped pegs with holes
        this.board[srcPeg[0]][srcPeg[1]] = "o";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = "o";
        this.holes.add(PegSolitaire.getPositionKey(srcPeg));
        this.holes.add(PegSolitaire.getPositionKey(jumpedPeg));

        //replace hole that peg jumped into with the peg
        this.holes.delete(PegSolitaire.getPositionKey(hole));
        this.board[row][col] = ".";

        //update move history
        this.moveHistory.push(move);

        //compute all moves and store them
        if(updateMoves) {
            this.updateMoves();
        }
    }

    performMoveSequence(moves) {
        moves.forEach(move => this.performMove(move, false));
        this.updateMoves();
    }

    undo() {
        let move = this.moveHistory.pop();
        if(!move) {
            return;
        }
        let hole = move.hole;
        let srcPeg = move.srcPeg;
        let [row, col] = hole;

        //determine position of jumped peg
        let jumpedPeg = PegSolitaire.getJumpedPeg(move);

        //replace moved & jumped pegs(now holes) with pegs
        this.board[srcPeg[0]][srcPeg[1]] = ".";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = ".";
        this.holes.delete(PegSolitaire.getPositionKey(srcPeg));
        this.holes.delete(PegSolitaire.getPositionKey(jumpedPeg));

        //replace hole that peg jumped into (now a peg) with a hole
        this.holes.add(PegSolitaire.getPositionKey(hole));
        this.board[row][col] = "o";

        //compute all moves and store them
        this.updateMoves();
    }

    isValidMove(move) {
        //check if move contains hole and source peg
        if(!move.hole || !move.srcPeg || !Array.isArray(move.hole) || !Array.isArray(move.srcPeg)) {
            return false;
        }

        //check if move is in move set
        return this.moves.has(PegSolitaire.getMoveKey(move));
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

    reset() {
        this.restore(this.initialState);
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

PegSolitaire.INITIAL_EUROPEAN_STATE = "2...2/1.....1/......./...o.../....../1.....1/2...2";

module.exports = {
    PegSolitaire
};