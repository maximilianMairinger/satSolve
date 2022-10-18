# Sat solver

This is a simple SAT solver with a string based interface, built for easy access. It tries to parse many different commenly used syntaxes into a AST and then solves the problem, returning one or all solutions. You may also only use the AST and provide a solver yourself. The built in solver is [logic-solver](https://www.npmjs.com/package/logic-solver) which itself is based on a js MiniSat implementation.

## Installation

```bash
npm install sat-solver
```

## Usage

> Note that biconditional implications are not supported and implications only in one direction. A incomplete list of supported syntaxes can be found below

```js
const { solve } = require('sat-solver');

solve('a | (b & c)').findOne()  // { a: true, b: false, c: false }

solve('a | (b & c)').findAll()  // [
                                //   { a: true, b: false, c: false },
                                //   { a: true, b: false, c: true },
                                //   { a: true, b: true, c: true },
                                //   { a: true, b: true, c: false },
                                //   { a: false, b: true, c: true }
                                // ]

solve('a | (b & c)').getAstTree() // [ 'a', Symbol(or), [ 'b', Symbol(and), 'c' ] ]

// the operators may be found here
const { operators } = require('sat-solver');

// you may also dig into logic-solver to solve it in a differnt way
solve('a | (b & c)').getSolver()
```

Different syntaxes include (may be mixed)

```js
solve('-a | (b & c)')
solve('!a || (b && c)')
solve('not a or (b and c)')
solve('¬a ∨ (b ∧ c)')

solve("a => b")
solve("a implies b")
solve("a -> b")
solve("a → b")
solve("a ⇒ b")

solve("a xor b")
solve("a ⊻ b")
```


