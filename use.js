const { solve } = require("./index")

const query = `(b | !a | !e | c) & 
(b | !d | e | c) & 
(!d | a | c | b) & 
(!e | !a | !d | !c) & 
(!b | !d | c | !a) & 
(!c | !b | !d | e) & 
(!d | !a | !e | b) & 
(b | !e | !c | !a) & 
(!b | !e | !c | a) & 
(!d | !c | b | !e) & 
(!c | !b | !a | !d) & 
(!b | d | a | c) & 
(!e | !c | a | !d) & 
(c | d | !b | a) & 
(!c | a | b | !e) & 
(!b | !e | !a | c) & 
(a | !e | !b | !c) & 
(d | !a | !c | b)`

const out = solve(query).findAll()

console.log(out)
console.log("count:", out.length)


// rule out these solutions
let s = ""
for (const e of out) {
  s += `(${Object.keys(e).map(k => e[k] ? `!${k}` : k).join(" | ")}) & `
}
console.log(s)