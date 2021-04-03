class PegSolitaire {
    constructor(str) {
        if(!PegSolitaire.isValidInitString(str)) {
            throw new Error("Invalid initialization string");
        }

        this.board = [[]];
        this.holes = [];
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
                        this.holes.push([row, col]);
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
        this.initialState = this.saveState();
        this.updateMoves();
    }

    getMoves() {
        return this.moves
    }

    updateMoves() {
        let moves = [];

        for(let i=0; i<this.holes.length; i++) {
            let hole = this.holes[i].slice();
            let [row, col] = hole;

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
        }
        this.moves = moves;
    }

    isCompleted() {
        return this.moves.length === 0;
    }

    performMove(move, updateMoves = true) {
        let hole = move.hole.slice();
        let srcPeg = move.srcPeg.slice();
        let [row, col] = hole;

        //determine position of jumped peg
        let jumpedPeg = PegSolitaire.getJumpedPeg(move);

        //replace moved & jumped pegs with holes
        this.board[srcPeg[0]][srcPeg[1]] = "o";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = "o";
        this.holes.push(srcPeg);
        this.holes.push(jumpedPeg);

        //replace hole that peg jumped into with the peg
        let res = this.holes.findIndex(ihole => ihole[0] == hole[0] && ihole[1] == hole[1]);
        this.holes.splice(res, 1);
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

    undo(updateMoves = true) {
        let move = this.moveHistory.pop();
        if(!move) {
            return;
        }
        let hole = move.hole.slice();
        let srcPeg = move.srcPeg.slice();
        let [row, col] = hole;

        //determine position of jumped peg
        let jumpedPeg = PegSolitaire.getJumpedPeg(move);

        //replace moved & jumped pegs(now holes) with pegs
        this.board[srcPeg[0]][srcPeg[1]] = ".";
        this.board[jumpedPeg[0]][jumpedPeg[1]] = ".";
        let res = this.holes.findIndex(ihole => ihole[0] == srcPeg[0] && ihole[1] == srcPeg[1]);
        this.holes.splice(res, 1);
        res = this.holes.findIndex(ihole => ihole[0] == jumpedPeg[0] && ihole[1] == jumpedPeg[1]);
        this.holes.splice(res, 1);

        //replace hole that peg jumped into (now a peg) with a hole
        this.holes.push(hole);
        this.board[row][col] = "o";

        //compute all moves and store them
        if(updateMoves) {
            this.updateMoves();
        }
    }

    isValidMove(move) {
        //check if move contains hole and source peg
        if(!move.hole || !move.srcPeg || !Array.isArray(move.hole) || !Array.isArray(move.srcPeg)) {
            return false;
        }

        //check if move is in move set
        let res = this.moves.findIndex(imove => imove.srcPeg[0] == move.srcPeg[0] && imove.srcPeg[1] == move.srcPeg[1] && imove.hole[0] == move.hole[0] && imove.hole[0] == move.hole[0]);
        return res >= 0;
    }

    isValidMoveSequence(moves) {
        if(!Array.isArray(moves) || moves.length <= 0) {
            return false;
        } else if(moves.length <= 1) {
            return this.isValidMove(moves[0]);
        } else {
            let save = this.saveState();
            for (let i=0; i<moves.length; i++) {
                if(!this.isValidMove(moves[i])) {
                    this.restoreState(save);
                    return false;
                }
                this.performMove(moves[i]);
            }
            this.restoreState(save);
            return true;
        }     
    }

    print() {
        console.log(this.board.map(row => row.join(" ")).join("\n"))
    }

    printHoles() {
        console.log(this.holes)
    }

    printMoves() {
        console.log(this.moves)
    }

    saveState() {
        return {
            board: this.board.map(row => row.slice()),
            holes: this.holes.slice(),
            moveHistory: this.moveHistory.slice()
        };
    }

    restoreState(state) {
        this.board = state.board;
        this.holes = state.holes;
        this.moveHistory = state.moveHistory;
        this.updateMoves();
    }

    reset() {
        this.restoreState(this.initialState);
    }

    //virtual methods => meant to be implemented by subclasses
    isSolved() {}
    hash() {}

    solve(limit = 60000) {
        let originalState = this.saveState();
        let rootState = this.saveState();
        rootState.moveHistory = [];
        let fringe = [rootState];
        let explored = new Set([this.hash()]);

        let n = 0;
        let r = 0;
        let start = Date.now();

        let printStats = () => {
            console.log("Time: " + (Date.now()-start)/1000 + " s");
            console.log("n: " + n);
            console.log("r: " + r);
        };

        //DFS search for solved state
        while(fringe.length > 0) {
            let now = Date.now();
            if(now-start >= limit) {
                //time limit reached
                printStats();
                this.restoreState(originalState);
                return [];
            }

            //pop node from stack
            let currState = fringe.pop();
            this.restoreState(currState);

            if(this.isSolved()) {
                //successful search
                let res = this.moveHistory.slice();
                this.restoreState(originalState);
                printStats();
                return res;
            }

            //expand node: push all (unexplored) successor states onto stack
            this.moves.forEach(move => {
                this.performMove(move, false);

                let hash = this.hash();
                if(explored.has(hash)) {
                    //state already explored => do not add to fringe
                    r++;
                } else {
                    //state is unexplored => add to fringe
                    explored.add(hash);
                    let newState = this.saveState();
                    fringe.push(newState);
                    n++;
                }
                this.undo(false);
            });
        }

        //failed search
        printStats();
        this.restoreState(originalState);
        return [];
    }

    static isValidInitString(str) {
        //check if string is valid size
        if(!str || str.length === 0) {
            return false;
        }

        //check if string contains only numbers, ".", "o", and "/" characters
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
};

module.exports = {
    PegSolitaire
};