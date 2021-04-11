const {EnglishPegSolitaire} = require('./englishpegsolitaire');
const {PegSolitaire } = require('./pegsolitaire');

let numTrials = parseInt(process.argv[2]);
let searchlimit = parseInt(process.argv[3]);
numTrials = numTrials > 0 ?  numTrials : 20;

let game = new EnglishPegSolitaire();
let solutionSet = new Set();
let lastPegPositionCount = new Map();
let searchTime = 0;

if(searchlimit) {
    game.setSearchTimeLimit(searchlimit)
};

//perform experiment
console.log("Solutions found: ")
for(let i=0; i<numTrials; i++) {
    let solution = game.altSolve();
    if(!solution || solutionSet.has(solution)) {
        continue;
    }
    console.log(solution);
    searchTime += Date.now() - game.searchStartTime;
    solutionSet.add(solution);
    lastPegPosition = solution[solution.length-1];
    let count = lastPegPositionCount.get(lastPegPosition)
    if(count) {
        lastPegPositionCount.set(lastPegPosition, count + 1);
    } else {
        lastPegPositionCount.set(lastPegPosition, 1);
    }
}

//print stats
console.log("\nNum of trials: " + numTrials);
console.log("Num of solutions found: " + solutionSet.size);
let avgSearchTime = solutionSet.size === 0 ? 0 : searchTime/solutionSet.size;
console.log("Avg search time: " + (0.001*avgSearchTime).toFixed(2) + " s");
console.log("\nLast peg positions:");
for (let [key, value] of lastPegPositionCount.entries()) {
    let pos = EnglishPegSolitaire.stringToPosition(key);
    console.log(`${key} (${pos[0]},${pos[1]}): ${value}`);
  }