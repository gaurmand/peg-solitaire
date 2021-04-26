const {PegSolitaireBoard} = require('./pegsolitaireboard');

class MoveComputingPegSolitaire extends PegSolitaireBoard {
    constructor(str) {
        super(str);
        this.updateMoves();
    }

    updateMoves() {
        this.moves = this.getValidMoves();
    }

    getValidMoves() {
        let moves = [];

        for(let i = 0; i < this.holes.length; i++) {
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

        return moves;
    }

    getMoves() {
        return this.moves.slice();
    }

    isValidMove(move) {
        if(!move || !Array.isArray(move.hole) || !Array.isArray(move.srcPeg)) {
            return false;
        }

        let index = this.moves.findIndex(imove => imove.srcPeg[0] == move.srcPeg[0] && imove.srcPeg[1] == move.srcPeg[1] && 
                                                imove.hole[0] == move.hole[0] && imove.hole[1] == move.hole[1]);
        return index >= 0;
    }

    isCompleted() {
        return this.moves.length === 0;
    }

    printMoves() {
        console.log(this.moves)
    }
};

module.exports = {
    MoveComputingPegSolitaire
};