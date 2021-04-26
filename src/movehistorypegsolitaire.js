const {PegSolitaire} = require('./movecomputingpegsolitaire');

class MoveHistoryPegSolitaire extends PegSolitaire {

    constructor(str) {
        super(str);
        this.moveHistory = [];
        this.initialState = this.saveState();
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

    reset() {
        this.restoreState(this.initialState);
        this.initialState = this.saveState();
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

    saveState() {
        let state = super.saveState();
        state.moveHistory = this.moveHistory.slice();
        return state;
    }

    restoreState(state) {
        super.restoreState(state);
        this.moveHistory = state.moveHistory;
    }

};

module.exports = {
    MoveHistoryPegSolitaire
};