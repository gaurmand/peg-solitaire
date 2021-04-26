const {MovePerformingPegSolitaire} = require('./moveperformingpegsolitaire');

class MoveHistoryPegSolitaire extends MovePerformingPegSolitaire {

    constructor(str) {
        super(str);
        this.moveHistory = [];
    }

    performMove(move, updateMoves = true) {
        super.performMove(move, updateMoves);
        this.pushMoveOntoHistory(move);
    }

    undo(updateMoves = true) {
        let move = this.popMoveFromHistory();
        if(move) {
            this.undoMove(move, updateMoves);
        }
    }

    pushMoveOntoHistory(move) {
        this.moveHistory.push(move);
    }

    popMoveFromHistory() {
        return this.moveHistory.pop();;
    }

    getHistory() {
        return this.moveHistory.slice();
    }
};

module.exports = {
    MoveHistoryPegSolitaire
};