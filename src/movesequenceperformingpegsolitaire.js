const {SaveablePegSolitaire} = require('./saveablepegsolitaire');

class MoveSequencePerformingPegSolitaire extends SaveablePegSolitaire {

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
};

module.exports = {
    MoveSequencePerformingPegSolitaire
};