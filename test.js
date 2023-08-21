const Logic = require('logic-solver'); // Assuming you've imported the Logic Solver library

// Create a new solver
const solver = new Logic.Solver();

const query = `
(((a or d) and !c and !b) and ((a or b or c) and !d)) or
(((a or b or c) and !d) and ((b or c or d) and !a))
`




// Define the formulas
const formula1 = Logic.or('A', 'B', "C");
const formula2 = Logic.or('A', 'B');
const formula3 = Logic.or('A', 'B');

// Add the formulas to the solver
solver.require(formula1);
solver.require(formula2);
solver.require(formula3);

// Create a currently valid solution (you can get this from solving)
const initialSolution = solver.solve();

// Define the weights for each formula
const weights = [5, 3, 4];

// Use the minimizeWeightedSum method
const optimizedSolution = solver.minimizeWeightedSum(initialSolution, [formula1, formula2, formula3], weights);

// Evaluate the optimized solution
const optimizedValue = optimizedSolution.getWeightedSum([formula1, formula2, formula3], weights);

console.log('Optimized solution:', optimizedSolution.getMap());
console.log('Optimized value:', optimizedValue);