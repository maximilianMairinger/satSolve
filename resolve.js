const { solve } = require("./index")
const { parseAstTreeToLang, lang, operators } = require("./parse")

let query = `(a or !b) and (w or e or k) and (c or b)`


const ast = solve(query).getAstTree()

function findVar(ast, variable, ignoreClauseIndex, wantAsTrue = true) {
  let clauseIndex = 0
  for (const el of ast) {
    if (el instanceof Array) {
      if (clauseIndex === ignoreClauseIndex) {
        clauseIndex++
        continue
      }
      let i = 0
      for (const e of el) {
        
        if (e === variable) {
          if (wantAsTrue) {
            if (el[i-1] !== operators.not) return { clauseIndex, i }
          }
          else {
            if (el[i-1] === operators.not) return { clauseIndex, i }
          }
        }
        i++
      }
      clauseIndex++
    }
    
  }
}


function nthIndex(str, pat, n){
  var L= str.length, i= -1;
  while(n-- && i++<L){
    i= str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

function range(n) {
  return Array.from(Array(n).keys())
}

function indentCount(str, to, char = "(") {
  return nthIndex(str, char, to + 1)
}

function mkIndent(count, char = " ") {
  let s = ""
  for (const e of range(count)) {
    s += char
  }
  return s
}

function print(s) {
  console.log(s)
}


let currentAst = ast




const str = parseAstTreeToLang(ast, lang.limbool, true)
print(str)
let clauseIndex = 0
for (const el of currentAst) {
  if (el instanceof Array) {
    let i = 0
    for (const e of el) {
      if (typeof e === "string") {
        const res = findVar(ast, e, clauseIndex, el[i-1] === operators.not)
        if (res !== undefined) {
          const myClauseIndex = clauseIndex
          const otherClauseIndex = res.clauseIndex
          const smallerClauseIndex = Math.min(myClauseIndex, otherClauseIndex)
          const biggerClauseIndex = Math.max(myClauseIndex, otherClauseIndex)

          const smallerClauseIndent = indentCount(str, smallerClauseIndex)
          let biggerClauseIndent = indentCount(str, biggerClauseIndex)

          const smallerClauseIndentClose = indentCount(str, smallerClauseIndex, ")")
          const biggerClauseIndentClose = indentCount(str, biggerClauseIndex, ")")
          
          const smallerMark = mkIndent(smallerClauseIndentClose + 1 - smallerClauseIndent, "^")
          const biggerMark = mkIndent(biggerClauseIndentClose + 1 - biggerClauseIndent, "^")
          const markIndent = smallerMark.length
          biggerClauseIndent = biggerClauseIndent - smallerClauseIndent - markIndent

          print(mkIndent(smallerClauseIndent) + smallerMark + mkIndent(biggerClauseIndent) + biggerMark)
          return
        }
      }
      i++
    }
    clauseIndex++
  }
  
}







// console.log(out)
