const {PositionedPegSolitaire} = require('./positionedpegsolitaire');

class EuropeanPegSolitaire extends PositionedPegSolitaire {
    static INTIAL_STATE = "2...2/1.....1/......./...o.../......./1.....1/2...2";

    static POSITION_TO_STRING_ARRAY = [
        ["", "", "a", "b", "c", "", ""],
       ["", "y", "d", "e", "f", "z", ""],
      ["g", "h", "i", "j", "k", "l", "m"],
      ["n", "o", "p", "x", "P", "O", "N"],
      ["M", "L", "K", "J", "I", "H", "G"],
       ["", "Z", "F", "E", "D", "Y", ""],
        ["", "", "C", "B", "A", "", ""],
    ];

    static STRING_TO_POSITION_MAP = new Map([
                                  ["a",[0,2]], ["b",[0,3]], ["c",[0,4]], 
        ["y",[1,1]], ["d",[1,2]], ["e",[1,3]], ["f",[1,4]], ["z",[1,5]], 
        ["g",[2,0]], ["h",[2,1]], ["i",[2,2]], ["j",[2,3]], ["k",[2,4]], ["l",[2,5]], ["m",[2,6]], 
        ["n",[3,0]], ["o",[3,1]], ["p",[3,2]], ["x",[3,3]], ["P",[3,4]], ["O",[3,5]], ["N",[3,6]], 
        ["M",[4,0]], ["L",[4,1]], ["K",[4,2]], ["J",[4,3]], ["I",[4,4]], ["H",[4,5]], ["G",[4,6]], 
        ["Z",[5,1]], ["F",[5,2]], ["E",[5,3]], ["D",[5,4]], ["Y",[5,5]], 
                                  ["C",[6,2]], ["B",[6,3]], ["A",[6,4]]
    ]);

    constructor(initStr = EuropeanPegSolitaire.INTIAL_STATE) {
        super(initStr);
        PositionedPegSolitaire.POSITION_TO_STRING_ARRAY = EuropeanPegSolitaire.POSITION_TO_STRING_ARRAY;
        PositionedPegSolitaire.STRING_TO_POSITION_MAP = EuropeanPegSolitaire.STRING_TO_POSITION_MAP;
        PositionedPegSolitaire.isValidPosition = EuropeanPegSolitaire.isValidPosition;
    }

    static isValidPosition(pos) {
        return Array.isArray(pos) && pos.length >= 2 && pos[0] >= 0 && pos[0] <= 6 && pos[1] >= 0 && pos[1] <= 6;
    }

    isSolved() {
        return this.holes.length === 36;
    }

    solve() {
        let solution = super.solve(() => this.stateToInt(), () => this.isSolved());
        if(solution) {
            return EuropeanPegSolitaire.moveSequenceToString(solution);
        } else {
            return null;
        }
    }

     stateToInt() {
        const g = char => (char === "." ? "1" : "0");
        const b = this.board;

        const r0 =                           g(b[0][2]) + g(b[0][3]) + g(b[0][4]);
        const r1 =              g(b[1][1]) + g(b[1][2]) + g(b[1][3]) + g(b[1][4]) + g(b[1][5]);
        const r2 = g(b[2][0]) + g(b[2][1]) + g(b[2][2]) + g(b[2][3]) + g(b[2][4]) + g(b[2][5]) + g(b[2][6]);
        const r3 = g(b[3][0]) + g(b[3][1]) + g(b[3][2]) + g(b[3][3]) + g(b[3][4]) + g(b[3][5]) + g(b[3][6]);
        const r4 = g(b[4][0]) + g(b[4][1]) + g(b[4][2]) + g(b[4][3]) + g(b[4][4]) + g(b[4][5]) + g(b[4][6]);
        const r5 =              g(b[5][1]) + g(b[5][2]) + g(b[5][3]) + g(b[5][4]) + g(b[5][5]);
        const r6 =                           g(b[6][2]) + g(b[6][3]) + g(b[6][4]);

        return parseInt(r0 + r1 + r2 + r3 + r4 + r5 + r6, 2);
    }
};

module.exports = {
    EuropeanPegSolitaire
};