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

    /**
     * Computes all possible moves from the current state and updates the moves property
     */
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

    /**
     * Returns true if there are no more moves possible, false otherwise
     * @returns {Boolean}
     */
    isCompleted() {
        return this.moves.length === 0;
    }

    /**
     * Performs the given move and updates the internal state
     * @param {Object} move - The move to perform
     * @param {Boolean} updateMoves - Option to update the moves (defaults to true)
     */
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

    /**
     * Performs the given move sequence and updates the internal state
     * @param {Array} moves - The move sequence to perform
     */
    performMoveSequence(moves) {
        moves.forEach(move => this.performMove(move, false));
        this.updateMoves();
    }

    /**
     * Undos the last move performed and updates the internal state
     * @param {Boolean} updateMoves - Option to update the moves (defaults to true)
     */
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

    /**
     * Returns true if a move is valid according to the current board state, false otherwise
     * @param {Object} move - The move object
     * @returns {Boolean}
     */
    isValidMove(move) {
        //check if move contains hole and source peg
        if(!move || !Array.isArray(move.hole) || !Array.isArray(move.srcPeg)) {
            return false;
        }

        //check if move is in move set
        let res = this.moves.findIndex(imove => imove.srcPeg[0] == move.srcPeg[0] && imove.srcPeg[1] == move.srcPeg[1] && imove.hole[0] == move.hole[0] && imove.hole[1] == move.hole[1]);
        return res >= 0;
    }

    /**
     *  Returns true if a move sequence is valid according to the current board state, false otherwise
     * @param {Array} moves - The move sequence (array of move objects)
     * @returns {Boolean}
     */
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

    /**
     * Prints the current board state and also the position key next to it (optional)
     */
    print() {
        console.log(this.board.map(row => row.join(" ")).join("\n"))
    }

    /**
     * Prints the move list
     */
    printHoles() {
        console.log(this.holes)
    }

    /**
     * Prints the hole list
     */
    printMoves() {
        console.log(this.moves)
    }

    /**
     * Returns a state object representing the puzzle's current state
     * @returns {Object} - The state object
     */
    saveState() {
        return {
            board: this.board.map(row => row.slice()),
            holes: this.holes.slice(),
            moveHistory: this.moveHistory.slice()
        };
    }

    /**
     * Restores the puzzle's state using the input state pbject
     * @param {*} state - The state object
     */
    restoreState(state) {
        this.board = state.board;
        this.holes = state.holes;
        this.moveHistory = state.moveHistory;
        this.updateMoves();
    }

    /**
     * Resets the puzzle state to its initial state
     */
    reset() {
        this.restoreState(this.initialState);
    }

    /**
     * Returns true if the puzzle is in the solved state
     * Virtual method: meant to be implemented by a subclass
     * @returns {Boolean}
     */
    isSolved() {}

    /**
     * Returns a number represnting the current board state
     * Virtual method: meant to be implemented by a subclass
     * @returns {Number}
     */
    hash() {}

    /**
     * Returns a move sequence that will take the puzzle into the solved state from its current state
     * If not solvable, returns null
     * @returns {Array|null} - The move sequence (array of move objects)
     */
    solve() {
        let originalState = this.saveState();
        let res = this.DFSSearch(() => this.hash(), () => this.isSolved());
        this.restoreState(originalState);
        this.printSearchStats();
        return res;
    }

    DFSSearch(getStateID, isGoal) {
        let rootState = this.saveState();
        rootState.moveHistory = [];
        let stack = [rootState];
        let explored = new Set([getStateID()]);

        this.numExploredStates = 0;
        this.numRepeatedStates = 0;
        this.searchStartTime = Date.now();

        while(stack.length > 0) {

            if(Date.now() - this.searchStartTime > PegSolitaire.SEARCH_TIME_LIMIT) {
                //time limit reached
                console.log("timeout")
                return null;
            }

            //pop node from stack
            let currState = stack.pop();
            this.restoreState(currState);

            if(isGoal()) {
                //successful search
                console.log("success")
                let res = this.moveHistory.slice();
                return res;
            }

            //expand node: push all (unexplored) successor states onto stack
            this.moves.forEach(move => {
                this.performMove(move, false);

                let hash = getStateID();
                if(explored.has(hash)) {
                    //state already explored => do not add to stack
                    this.numRepeatedStates++;
                } else {
                    //state is unexplored => add to stack
                    explored.add(hash);
                    let newState = this.saveState();
                    stack.push(newState);
                    this.numExploredStates++;
                }
                this.undo(false);
            });
        }
        
        //failed search
        console.log("fail")
        return null;
    }

    printSearchStats() {
        console.log("Time: " + (Date.now()-this.searchStartTime)/1000 + " s");
        console.log("n: " + this.numExploredStates);
        console.log("r: " + this.numRepeatedStates);
    }

    /**
     * Returns true if the initialization string is valid, false otherwise
     * @param {String} str 
     * @returns {Boolean}
     */
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

PegSolitaire.SEARCH_TIME_LIMIT = 30000;

module.exports = {
    PegSolitaire
};