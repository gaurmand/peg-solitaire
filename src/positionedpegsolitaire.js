const {SolvablePegSolitaire} = require('./solvablepegsolitaire');

class PositionedPegSolitaire extends SolvablePegSolitaire {
    static POSITION_TO_STRING_ARRAY;
    static STRING_TO_POSITION_MAP;
    static isValidPosition() {};
    
    printHoles() {
        console.log(this.holes.map(hole => PositionedPegSolitaire.positionToString(hole)).sort().join(", "));
    }
    
    printMoves() {
        console.log(PositionedPegSolitaire.moveSequenceToString(this.moves, true));
    }

    print(printPosKey = true) {
        console.log(this.board.map((row, i) => row.join(" ") + (printPosKey ? "  |  " + PositionedPegSolitaire.POSITION_TO_STRING_ARRAY[i].map(pos => !pos ? " " : pos).join(" ") : "")).join("\n"))
    }

    static stringToPosition(posStr) {
        let pos = PositionedPegSolitaire.STRING_TO_POSITION_MAP.get(posStr);
        if(pos) {
            return pos.slice();
        } else {
            return null;
        }
    }

    static positionToString(pos) {
        return this.isValidPosition(pos) ? PositionedPegSolitaire.POSITION_TO_STRING_ARRAY[pos[0]][pos[1]] : "";
    }

    static stringToMove(moveStr) {
        if(/[a-pA-PxyzYZ][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = src peg position, r = direction of move
            let srcPos = moveStr[0];
            let direction = moveStr[1];
            let srcPeg = this.stringToPosition(srcPos);
            let [row, col] = srcPeg;

            //determine position of hole
            let hole;
            switch(direction) {
                case "d":
                    hole = [row+2,col];
                    break;
                case "u":
                    hole = [row-2,col];
                    break;
                case "r":
                    hole = [row,col+2];
                    break;
                case "l":
                    hole = [row,col-2];
                    break;
                default:
                    return "";
            }

            return {srcPeg, hole};

        } else if(/^[a-pA-PxyzYZ]-[a-pA-PxyzYZ]$/.test(moveStr)) {
            //test if string of the form "a-b" where a is the starting peg, and b is the hole it's moved to
            let srcPeg = this.stringToPosition(moveStr[0]);
            let hole = this.stringToPosition(moveStr[2]);
            return {srcPeg, hole};

        }

        return null;
    }

    static stringToMoveSequence(moveStr) {
        if(/[a-pA-PxyzYZ][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = src peg position, r = direction of move
            let srcPos = moveStr[0];
            let direction = moveStr[1];
            let srcPeg = this.stringToPosition(srcPos);
            let [row, col] = srcPeg;

            //determine position of hole
            let hole;
            switch(direction) {
                case "d":
                    hole = [row+2,col];
                    break;
                case "u":
                    hole = [row-2,col];
                    break;
                case "r":
                    hole = [row,col+2];
                    break;
                case "l":
                    hole = [row,col-2];
                    break;
                default:
                    return "";
            }

            return [{srcPeg, hole}];

        } else if(/^([a-pA-PxyYzZ]-)+[a-pA-PxyYzZ]$/.test(moveStr)) {
            //test if string of the form "a-b-c" where a is the starting peg, and b,c are the subsequent holes it's moved to
            let moves = [];
            let positions = moveStr.split("-");
            let src = positions.shift();
            while(positions.length > 0) {
                let srcPeg = this.stringToPosition(src);
                let hole = this.stringToPosition(positions[0]);
                let move = {srcPeg, hole};

                moves.push(move);
                src = positions.shift();
            }
            return moves;
        }

        return null;
    }

    static moveToString(move) {
        if(!move) {
            return "";
        }

        let src = this.positionToString(move.srcPeg);
        let hole = this.positionToString(move.hole);

        //check if move positions are valid
        if(src && hole) {
            return src + "-" + hole;
        } else {
            return "";
        }
    }

    static moveSequenceToString(moveseq, sort=false) {
        if(!Array.isArray(moveseq)) {
            return false;
        }
        let res = moveseq.map(move => this.moveToString(move))
        if(sort) {
            return res.sort().join(", ");
        } else {
            return res.join(", ");
        }
    }

    static positionsToMove(srcPeg, hole) {
        if(!this.isValidPosition(srcPeg) || !this.isValidPosition(hole)) {
            return null;
        }

        srcPeg = srcPeg.slice();
        hole = hole.slice();
        return {srcPeg, hole};
    }
};

module.exports = {
    PositionedPegSolitaire
};