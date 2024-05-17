const { solve } = require("./index")



// console.log(hoistCommonAttributesIntoGroup(`
// <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 36">
//   <path a d/>
//   <path a b c/>
//   <path b c d/>
// </svg>
// `))

const startingPos1 = ["(x ∧ ¬y ∧ ¬z)", "(x ∧ ¬y ∧ z)"]

const startingPos2 = [
  "!z & !zNxt & !xNxt & !yNxt & x & !y",
  "!z & zNxt & !xNxt & !yNxt & x & !y",
  "!z & !zNxt & xNxt & !yNxt & x & !y",
  "!z & !zNxt & xNxt & yNxt & x & !y",
  "!z & zNxt & !xNxt & yNxt & x & !y",
  "!z & !zNxt & !xNxt & yNxt & x & !y",
  "!z & zNxt & xNxt & !yNxt & x & !y",
  "z & zNxt & !xNxt & yNxt & x & !y"
]



const query = `
(xNxt ↔ (¬z)∧yNxt ↔ (x∨y)∧zNxt ↔ z)
and (
${startingPos2.join(" or ")}
)`

const out = solve(query).findAll()
console.log(out)


for (const line of out) {
  let s = []
  for (const k in line) {
    if (!line[k]) {
      s.push(`!${k}`)
    } else {
      s.push(k)
    }
  }
  console.log(s.join(" & "))
}
// console.log(out)
console.log("count:", out.length)


// // rule out these solutions
// let s = ""
// for (const e of out) {
//   s += `(${Object.keys(e).map(k => e[k] ? `!${k}` : k).join(" | ")}) & `
// }
// console.log(s)