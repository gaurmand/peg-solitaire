const {MoveSequencePerformingPegSolitaire} = require('./movesequenceperformingpegsolitaire');

class SolvablePegSolitaire extends MoveSequencePerformingPegSolitaire {
    constructor(str) {
        super(str);
        this.searchTimeLimit = SolvablePegSolitaire.DEFAULT_SEARCH_TIME_LIMIT;
    }

    setSearchTimeLimit(limit) {
        if(limit > 0) {
            this.searchTimeLimit = limit;
        }
    }

    solve(getStateID, isGoalState, randomize = false) {
        let originalState = this.saveState();
        this.getStateID = getStateID;
        this.isGoalState = isGoalState;

        let res = this.DFSSearch(randomize);

        this.restoreState(originalState);
        return res;
    }

    DFSSearch(randomize = false) {
        this.initializeSearch();
        while(this.stack.length > 0) {
            if(Date.now() - this.searchStartTime > this.searchTimeLimit) {
                return null;
            }
            this.popNode();
            if(this.isGoalState()) {
                return this.moveHistory.slice();;
            }

            if(randomize) {
                SolvablePegSolitaire.randomizeArray(this.moves);
            }
            this.expandNode()
        }
        return null;
    }

    initializeSearch() {
        let rootState = this.saveState();
        rootState.moveHistory = [];
        this.stack = [rootState];
        this.explored = new Set([this.getStateID()]);

        this.numExploredStates = 0;
        this.numRepeatedStates = 0;
        this.searchStartTime = Date.now();
    }

    popNode() {
        let currState = this.stack.pop();
        this.restoreState(currState); 
    }

    expandNode() {
        this.moves.forEach(move => {
            this.performMove(move, false);

            let hash = this.getStateID();
            if(this.explored.has(hash)) {
                this.numRepeatedStates++;
            } else {
                this.explored.add(hash);
                let newState = this.saveState();
                this.stack.push(newState);
                this.numExploredStates++;
            }
            this.undo(false);
        });
    }

    printSearchStats() {
        console.log("Time: " + (Date.now()-this.searchStartTime)/1000 + " s");
        console.log("n: " + this.numExploredStates);
        console.log("r: " + this.numRepeatedStates);
    }

    static randomizeArray(arr) {
        for(let i=0; i<arr.length; i++) {
            let randomIndex1 = Math.floor(Math.random() * arr.length);
            let randomIndex2 = Math.floor(Math.random() * arr.length);

            let temp = arr[randomIndex1];
            arr[randomIndex1] = arr[randomIndex2];
            arr[randomIndex2] = temp;
        }
    }
};

SolvablePegSolitaire.DEFAULT_SEARCH_TIME_LIMIT = 60000;

module.exports = {
    SolvablePegSolitaire
};