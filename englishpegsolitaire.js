const {PegSolitaire} = require('./pegsolitaire');

class EnglishPegSolitaire extends PegSolitaire{
    constructor(initStr = EnglishPegSolitaire.INTIAL_STATE) {
        super(initStr);
    }

    /**
     * Prints the current board state and also the position key next to it (optional)
     * @param {Boolean} printPosKey - print position key option
     */
    print(printPosKey = true) {
        console.log(this.board.map((row, i) => row.join(" ") + (printPosKey ? "  |  " + EnglishPegSolitaire.POSITION_TO_STRING_ARRAY[i].map(pos => !pos ? " " : pos).join(" ") : "")).join("\n"))
    }

    /**
     * Prints the hole list
     */
    printHoles() {
        console.log(this.holes.map(hole => EnglishPegSolitaire.positionToString(hole)).sort().join(", "));
    }

    /**
     * Prints the move list
     */
    printMoves() {
        console.log(this.moves.map(move => EnglishPegSolitaire.moveToString(move)).sort().join(", "));
    }

    /**
     * Returns true if the puzzle is in the solved state
     * @returns {Boolean}
     */
    isSolved() {
        return this.holes.length === 32 && this.board[3][3] === ".";
    }

    isOnePegRemaining() {
        return this.holes.length === 32
    }

    /**
     * Returns a move sequence that will take the puzzle into the solved state from its current state
     * If not solvable, returns null
     * Caution: Search time is limited, if the time limit is reached, assumes configuration is not solvable 
     * @returns {Array|null} - The move sequence (array of move strings)
     */
    solve() {
        let solution = super.solve(()=>this.stateToInt(), ()=>this.isSolved());
        if(solution) {
            return solution.map(move => EnglishPegSolitaire.moveToString(move)).join(", ");
        } else {
            return null;
        }
    }
    
    /**
     * Returns a move sequence that will take the puzzle into a state with one peg remaining at any location
     * If not solvable, returns null
     * Caution: Search time is limited, if the time limit is reached, assumes configuration is not solvable 
     * @returns {Array|null} - The move sequence (array of move strings)
     */
    altSolve() {
        let solution = super.solve(()=>this.stateToInt(), ()=>this.isOnePegRemaining(), true);
        if(solution) {
            return solution.map(move => EnglishPegSolitaire.moveToString(move)).join(", ");
        } else {
            return null;
        }
    }

    optSolve() {
        let solution = super.solve(()=>this.classToInt(), ()=>this.isSolved());
        if(solution) {
            return solution.map(move => EnglishPegSolitaire.moveToString(move)).join(", ");
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

    classToInt() {
        let h = this.getCongruenceClass();

        //choose minimum as equivalence class representative
        let min = h[0];
        for(let i=1; i<8; i++) {
            if(h[i] < min) {
                min = h[i];
            }
        }
        
        return parseInt(min, 2);
    }

    getCongruenceClass() {
        const g = char => (char === "." ? "1" : "0");
        const b = this.board;

        //row bit patterns
        const r0 =                           g(b[0][2]) + g(b[0][3]) + g(b[0][4]);
        const r1 =              g(b[1][1]) + g(b[1][2]) + g(b[1][3]) + g(b[1][4]) + g(b[1][5]);
        const r2 = g(b[2][0]) + g(b[2][1]) + g(b[2][2]) + g(b[2][3]) + g(b[2][4]) + g(b[2][5]) + g(b[2][6]);
        const r3 = g(b[3][0]) + g(b[3][1]) + g(b[3][2]) + g(b[3][3]) + g(b[3][4]) + g(b[3][5]) + g(b[3][6]);
        const r4 = g(b[4][0]) + g(b[4][1]) + g(b[4][2]) + g(b[4][3]) + g(b[4][4]) + g(b[4][5]) + g(b[4][6]);
        const r5 =              g(b[5][1]) + g(b[5][2]) + g(b[5][3]) + g(b[5][4]) + g(b[5][5]);
        const r6 =                           g(b[6][2]) + g(b[6][3]) + g(b[6][4]);

        //column bit patterns
        const c0 =                           g(b[2][0]) + g(b[3][0]) + g(b[4][0]);
        const c1 =              g(b[1][1]) + g(b[2][1]) + g(b[3][1]) + g(b[4][1]) + g(b[5][1]);
        const c2 = g(b[0][2]) + g(b[1][2]) + g(b[2][2]) + g(b[3][2]) + g(b[4][2]) + g(b[5][2]) + g(b[6][2]);
        const c3 = g(b[0][3]) + g(b[1][3]) + g(b[2][3]) + g(b[3][3]) + g(b[4][3]) + g(b[5][3]) + g(b[6][3]);
        const c4 = g(b[0][4]) + g(b[1][4]) + g(b[2][4]) + g(b[3][4]) + g(b[4][4]) + g(b[5][4]) + g(b[6][4]);
        const c5 =              g(b[1][5]) + g(b[2][5]) + g(b[3][5]) + g(b[4][5]) + g(b[5][5]);
        const c6 =                           g(b[2][6]) + g(b[3][6]) + g(b[4][6]);

        //reverse row bit patterns
        const rr0 =                           g(b[0][4]) + g(b[0][3]) + g(b[0][2]);
        const rr1 =              g(b[1][5]) + g(b[1][4]) + g(b[1][3]) + g(b[1][2]) + g(b[1][1]);
        const rr2 = g(b[2][6]) + g(b[2][5]) + g(b[2][4]) + g(b[2][3]) + g(b[2][2]) + g(b[2][1]) + g(b[2][0]);
        const rr3 = g(b[3][6]) + g(b[3][5]) + g(b[3][4]) + g(b[3][3]) + g(b[3][2]) + g(b[3][1]) + g(b[3][0]);
        const rr4 = g(b[4][6]) + g(b[4][5]) + g(b[4][4]) + g(b[4][3]) + g(b[4][2]) + g(b[4][1]) + g(b[4][0]);
        const rr5 =              g(b[5][5]) + g(b[5][4]) + g(b[5][3]) + g(b[5][2]) + g(b[5][1]);
        const rr6 =                           g(b[6][4]) + g(b[6][3]) + g(b[6][2]);

        //reverse column bit patterns
        const rc0 =                           g(b[4][0]) + g(b[3][0]) + g(b[2][0]);
        const rc1 =              g(b[5][1]) + g(b[4][1]) + g(b[3][1]) + g(b[2][1]) + g(b[1][1]);
        const rc2 = g(b[6][2]) + g(b[5][2]) + g(b[4][2]) + g(b[3][2]) + g(b[2][2]) + g(b[1][2]) + g(b[0][2]);
        const rc3 = g(b[6][3]) + g(b[5][3]) + g(b[4][3]) + g(b[3][3]) + g(b[2][3]) + g(b[1][3]) + g(b[0][3]);
        const rc4 = g(b[6][4]) + g(b[5][4]) + g(b[4][4]) + g(b[3][4]) + g(b[2][4]) + g(b[1][4]) + g(b[0][4]);
        const rc5 =              g(b[5][5]) + g(b[4][5]) + g(b[3][5]) + g(b[2][5]) + g(b[1][5]);
        const rc6 =                           g(b[4][6]) + g(b[3][6]) + g(b[2][6]);

        //compute congruent row hashes
        let h0 = r0 + r1 + r2 + r3 + r4 + r5 + r6;
        let h1 = r6 + r5 + r4 + r3 + r2 + r1 + r0;
        let h2 = rr0 + rr1 + rr2 + rr3 + rr4 + rr5 + rr6;
        let h3 = rr6 + rr5 + rr4 + rr3 + rr2 + rr1 + rr0;

        //compute congruent column hashes
        let h4 = c0 + c1 + c2 + c3 + c4 + c5 + c6;
        let h5 = c6 + c5 + c4 + c3 + c2 + c1 + c0;
        let h6 = rc0 + rc1 + rc2 + rc3 + rc4 + rc5 + rc6;
        let h7 = rc6 + rc5 + rc4 + rc3 + rc2 + rc1 + rc0;

        return [h0, h1, h2, h3, h4, h5, h6, h7];
    }

    /**
     * Converts a move string (e.g. "e-x") to a move object (e.g. {srcPeg: [1,3], hole: [3,3]})
     * Returns null if it fails
     * @param {String} moveStr - The move string
     * @returns {Object|null} - The move object
     */
    static stringToMove(moveStr) {
        if(/[a-pA-Px][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = src peg position, r = direction of move
            let srcPos = moveStr[0];
            let direction = moveStr[1];
            let srcPeg = EnglishPegSolitaire.stringToPosition(srcPos);
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

        } else if(/^[a-pA-Px]-[a-pA-Px]$/.test(moveStr)) {
            //test if string of the form "a-b" where a is the starting peg, and b is the hole it's moved to
            let srcPeg = EnglishPegSolitaire.stringToPosition(moveStr[0]);
            let hole = EnglishPegSolitaire.stringToPosition(moveStr[2]);
            return {srcPeg, hole};

        }

        return null;
    }

    /**
     * Converts a move string (e.g. "e-x-E") to a move sequence array (e.g. [{srcPeg: [1,3], hole: [3,3]}, {srcPeg: [3,3], hole: [5,3]}])
     * Returns null if it fails
     * @param {String} moveStr - The move string
     * @returns {Array|null} - The move sequence (an array of move objects)
     */
    static stringToMoveSequence(moveStr) {
        if(/[a-pA-Px][udrl]/.test(moveStr)) {
            //test if string of the form "ar" where a = src peg position, r = direction of move
            let srcPos = moveStr[0];
            let direction = moveStr[1];
            let srcPeg = EnglishPegSolitaire.stringToPosition(srcPos);
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

        } else if(/^([a-pA-Px]-)+[a-pA-Px]$/.test(moveStr)) {
            //test if string of the form "a-b-c" where a is the starting peg, and b,c are the subsequent holes it's moved to
            let moves = [];
            let positions = moveStr.split("-");
            let src = positions.shift();
            while(positions.length > 0) {
                let srcPeg = EnglishPegSolitaire.stringToPosition(src);
                let hole = EnglishPegSolitaire.stringToPosition(positions[0]);
                let move = {srcPeg, hole};

                moves.push(move);
                src = positions.shift();
            }
            return moves;
        }

        return [];
    }

    /**
     * Converts a position string (e.g. "x") to a position (e.g. [3,3]) 
     * Returns null if it fails
     * @param {String} posStr - The position string
     * @returns {Array|null} - The position [row, col]
     */
    static stringToPosition(posStr) {
        //check if position string is valid
        let pos = EnglishPegSolitaire.STRING_TO_POSITION_MAP.get(posStr);
        if(pos) {
            return pos.slice();
        } else {
            return null;
        }
    }

    /**
     * Converts a position (e.g. [3,3]) to a position string (e.g. "x")
     * @param {Array} pos - The position [row, col]
     * @returns {String} - The position string
     */
    static positionToString(pos) {
        return EnglishPegSolitaire.isValidPosition(pos) ? EnglishPegSolitaire.POSITION_TO_STRING_ARRAY[pos[0]][pos[1]] : "";
    }

    /**
     * Converts a move object (e.g. {srcPeg: [1,3], hole: [3,3]}) to a move string (e.g. "e-x")
     * @param {Object} move - The move object
     * @returns {String} - The move string
     */
    static moveToString(move) {
        if(!move) {
            return "";
        }

        let src = EnglishPegSolitaire.positionToString(move.srcPeg);
        let hole = EnglishPegSolitaire.positionToString(move.hole);

        //check if move positions are valid
        if(src && hole) {
            return src + "-" + hole;
        } else {
            return "";
        }
    }

    /**
     * Returns a move object given the positions of the peg and the hole
     * Returns null if it fails
     * @param {Array} srcPeg - The position [row, col] of the peg that moves
     * @param {Array} hole - The position [row, col] of the hole that the peg moves into
     * @returns {Object|null} - The move object
     */
    static positionsToMove(srcPeg, hole) {
        if(!EnglishPegSolitaire.isValidPosition(srcPeg) || !EnglishPegSolitaire.isValidPosition(hole)) {
            return null;
        }

        srcPeg = srcPeg.slice();
        hole = hole.slice();
        return {srcPeg, hole};
    }

    /**
     * Returns true if a position is valid, false if invalid
     * @param {Array} pos - The position [row, col]
     * @returns {Boolean}
     */
    static isValidPosition(pos) {
        return Array.isArray(pos) && pos.length >= 2 && pos[0] >= 0 && pos[0] <= 6 && pos[1] >= 0 && pos[1] <= 6;
    }
};

EnglishPegSolitaire.INTIAL_STATE = "2...2/2...2/......./...o.../......./2...2/2...2";
EnglishPegSolitaire.POSITION_TO_STRING_ARRAY = [
      ["", "", "a", "b", "c", "", ""],
      ["", "", "d", "e", "f", "", ""],
    ["g", "h", "i", "j", "k", "l", "m"],
    ["n", "o", "p", "x", "P", "O", "N"],
    ["M", "L", "K", "J", "I", "H", "G"],
      ["", "", "F", "E", "D", "", ""],
      ["", "", "C", "B", "A", "", ""],
];

EnglishPegSolitaire.STRING_TO_POSITION_MAP = new Map([
                              ["a",[0,2]], ["b",[0,3]], ["c",[0,4]], 
                              ["d",[1,2]], ["e",[1,3]], ["f",[1,4]], 
    ["g",[2,0]], ["h",[2,1]], ["i",[2,2]], ["j",[2,3]], ["k",[2,4]], ["l",[2,5]], ["m",[2,6]], 
    ["n",[3,0]], ["o",[3,1]], ["p",[3,2]], ["x",[3,3]], ["P",[3,4]], ["O",[3,5]], ["N",[3,6]], 
    ["M",[4,0]], ["L",[4,1]], ["K",[4,2]], ["J",[4,3]], ["I",[4,4]], ["H",[4,5]], ["G",[4,6]], 
                              ["F",[5,2]], ["E",[5,3]], ["D",[5,4]], 
                              ["C",[6,2]], ["B",[6,3]], ["A",[6,4]]
]);

module.exports = {
    EnglishPegSolitaire
};