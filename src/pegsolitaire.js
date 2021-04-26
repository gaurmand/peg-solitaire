const {MoveComputingPegSolitaire} = require('./movecomputingpegsolitaire');

class MovePerformingPegSolitaire extends MoveComputingPegSolitaire {
    constructor(str) {
        super(str);
    }

    performMove(move, updateMoves = true) {
        let hole = move.hole.slice();
        let srcPeg = move.srcPeg.slice();
        let jumpedPeg = MovePerformingPegSolitaire.getJumpedPeg(move);

        this.addHole(srcPeg);
        this.addHole(jumpedPeg);
        this.replaceHoleWithPeg(hole);

        if(updateMoves) {
            this.updateMoves();
        }
    }
    undoMove(move, updateMoves = true) {
        let hole = move.hole.slice();
        let srcPeg = move.srcPeg.slice();
        let jumpedPeg = MovePerformingPegSolitaire.getJumpedPeg(move);

        this.replaceHoleWithPeg(srcPeg);
        this.replaceHoleWithPeg(jumpedPeg);
        this.addHole(hole);

        if(updateMoves) {
            this.updateMoves();
        }
    }

    addHole(holePos) {
        this.board[holePos[0]][holePos[1]] = "o";
        this.holes.push(holePos);
    }

    replaceHoleWithPeg(holePos) {
        this.board[holePos[0]][holePos[1]] = ".";
        let index = this.holes.findIndex(hole => hole[0] == holePos[0] && hole[1] == holePos[1]);
        this.holes.splice(index, 1);
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

class PegSolitaire extends MovePerformingPegSolitaire {
    performMoveSequence(moves) {
        moves.forEach(move => this.performMove(move, false));
        this.updateMoves();
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
}

module.exports = {
    PegSolitaire
};