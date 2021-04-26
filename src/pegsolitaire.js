const {PegSolitaireBoardInitializer} = require('./pegsolitaireboardinitializer');

class PegSolitaire {
    constructor(str) {
        if(!PegSolitaireBoardInitializer.isValidInitString(str)) {
            throw new Error("Invalid initialization string");
        }

        let res = PegSolitaireBoardInitializer.getBoardFromInitString(str);
        this.board = res.board;
        this.holes = res.holes;
        this.numValidPositions = res.numValidPositions;

        this.minRow = 0;
        this.minCol = 0;
        this.maxRow = this.board.length - 1;
        this.maxCol = this.board[0].length - 1;

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

    undoMove(move, updateMoves = true) {
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

    saveState() {
        return {
            board: this.board.map(row => row.slice()),
            holes: this.holes.slice()
        };
    }

    restoreState(state) {
        this.board = state.board;
        this.holes = state.holes;
        this.updateMoves();
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