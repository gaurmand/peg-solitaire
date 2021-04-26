const {MoveHistoryPegSolitaire} = require('./movehistorypegsolitaire');

class SaveablePegSolitaire extends MoveHistoryPegSolitaire {

    constructor(str) {
        super(str);
        this.initialState = this.saveState();
    }

    reset() {
        this.restoreState(this.initialState);
        this.initialState = this.saveState();
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
};

module.exports = {
    SaveablePegSolitaire
};