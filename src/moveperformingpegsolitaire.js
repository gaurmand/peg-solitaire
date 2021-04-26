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

module.exports = {
    MovePerformingPegSolitaire
};