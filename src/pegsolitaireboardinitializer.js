class PegSolitaireBoardInitializer {

    static isValidInitString(str) {
        if(!this.isInitStringValidSize(str)) {
            return false;
        }

        if(!this.doesInitStringContainValidChars(str)) {
            return false;
        }

        if(this.doesInitStringBeginOrEndWithDelimeters(str)) {
            return false;
        }

        if(!this.doesInitStringHaveEqualRowLengths(str)) {
            return false;
        }

        return true;
    }

    static isInitStringValidSize(str) {
        return str && str.length > 0;
    }

    static doesInitStringContainValidChars(str) {
        return /^[\d.o/]+$/.test(str); //only contains numbers, ".", "o", and "/" characters
    }

    static doesInitStringBeginOrEndWithDelimeters(str) {
        return str[0] === "/" || str[str.length-1] === "/";
    }

    static doesInitStringHaveEqualRowLengths(str) {
        let rowLengths = this.getRowLengthsFromInitString(str);
        return rowLengths.every(length => length === rowLengths[0]);
    }

    static getRowLengthsFromInitString(str) {
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

    static getBoardFromInitString(str) {
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

module.exports = {
    PegSolitaireBoardInitializer
};