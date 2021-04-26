class PegSolitaireBoardInitializer {

    static isValidBoardString(str) {
        if(!this.isBoardStringValidSize(str)) {
            return false;
        }

        if(!this.doesBoardStringContainValidChars(str)) {
            return false;
        }

        if(this.doesBoardStringBeginOrEndWithDelimeters(str)) {
            return false;
        }

        if(!this.doesBoardStringHaveEqualRowLengths(str)) {
            return false;
        }

        return true;
    }

    static isBoardStringValidSize(str) {
        return str && str.length > 0;
    }

    static doesBoardStringContainValidChars(str) {
        return /^[\d.o/]+$/.test(str); //only contains numbers, ".", "o", and "/" characters
    }

    static doesBoardStringBeginOrEndWithDelimeters(str) {
        return str[0] === "/" || str[str.length-1] === "/";
    }

    static doesBoardStringHaveEqualRowLengths(str) {
        let rowLengths = this.getRowLengthsFromBoardString(str);
        return rowLengths.every(length => length === rowLengths[0]);
    }

    static getRowLengthsFromBoardString(str) {
        let rows = str.split("/");
        let rowLengths = rows.map(rowStr => this.getRowLengthFromRowString(rowStr));
        return rowLengths;
    }

    static getRowLengthFromRowString(rowStr) {
        let isDigit = char => /^\d+$/.test(char);

        let length = 0;
        [...rowStr].forEach(char => {
            if(isDigit(char)) {
                length += parseInt(char);
            } else {
                length++;
            }
        });
        return length;
    }

    static getBoardFromString(str) {
        let isDigit = char => /^\d+$/.test(char);

        let board = [[]];
        let holes = [];
        let numValidPositions = 0;
        let row = 0;
        let col = 0;

        [...str].forEach(char => {
            if(isDigit(char)) {
                let num = parseInt(char);
                for(let i = col; i < col + num; i++) {
                    board[row].push(" ");
                }
                col += num;
            } else {
                switch(char) {
                    case "o":
                        holes.push([row, col]);
                    case ".":
                        board[row].push(char);
                        col++
                        numValidPositions++;
                        break; 
                    case "/":
                        row++;
                        col = 0;
                        board.push([]);
                        break;
                    default:
                        throw new Error("Invalid initialization string");
                }
            }
        });

        return {board, holes, numValidPositions};
    }
};

class PegSolitaireBoard {
    constructor(str) {
        if(!PegSolitaireBoardInitializer.isValidBoardString(str)) {
            throw new Error("Invalid initialization string");
        }

        let res = PegSolitaireBoardInitializer.getBoardFromString(str);
        this.board = res.board;
        this.holes = res.holes;
        this.numValidPositions = res.numValidPositions;

        this.minRow = 0;
        this.minCol = 0;
        this.maxRow = this.board.length - 1;
        this.maxCol = this.board[0].length - 1;
    }

    getboard() {
        return this.board.map(row => row.slice());
    }

    print() {
        console.log(this.board.map(row => row.join(" ")).join("\n"))
    }
    
    printHoles() {
        console.log(this.holes)
    }
}

module.exports = {
    PegSolitaireBoard
};