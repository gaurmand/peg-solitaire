const {MovePerformingPegSolitaire} = require('./Moveperformingpegsolitaire');

class SaveablePegSolitaire extends MovePerformingPegSolitaire {

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
};

module.exports = {
    SaveablePegSolitaire
};