const { solve } = require("./dist/cjs/index")
const fs = require("fs")



const query = fs.readFileSync("query.sat").toString()


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