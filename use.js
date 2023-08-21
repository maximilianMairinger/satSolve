const { solve } = require("./index")

const query = `
((a or d) and !c and !b) and ((a or b or c) and !d) or
((a or b or c) and !d) and ((b or c or d) and !a)
`

const out = solve(query).findAll()



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