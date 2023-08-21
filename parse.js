const Logic = require("logic-solver")
var solver = new Logic.Solver();

const operators = {
  and: Symbol("and"),
  or: Symbol("or"),
  not: Symbol("not"),
  implies: Symbol("implies"),
  // iff: Symbol("iff"),
  xor: Symbol("xor")
};

exports.operators = operators

operators["AND"] = operators.and
operators["&"] = operators.and
operators["∧"] = operators.and
operators["^"] = operators.and

operators["OR"] = operators.or
operators["|"] = operators.or
operators["∨"] = operators.or


operators["NOT"] = operators.not
operators["¬"] = operators.not
operators["!"] = operators.not
operators["-"] = operators.not

operators["IMPLIES"] = operators.implies
operators["⇒"] = operators.implies
operators["→"] = operators.implies
operators["=>"] = operators.implies
operators["->"] = operators.implies
operators["==>"] = operators.implies
operators["-->"] = operators.implies

operators["XOR"] = operators.xor
operators["⊕"] = operators.xor
operators["⊻"] = operators.xor


const lang = {
  limbool: {
    [operators.and]: "&",
    [operators.or]: "|",
    [operators.not]: "!",
    [operators.implies]: "->",
    [operators.xor]: "xor",
    bracket: {
      open: "(",
      close: ")"
    }
  }
}

exports.lang = lang


const closingBracketIndex = {
  "(": ")",
  "[": "]",
  "{": "}"
}


function parseAstTreeToLang(astTree, lang, pretty = true) {
  let str = ""

  for (let i = 0; i < astTree.length; i++) {
    const cur = astTree[i]
    if (typeof cur === "string") {
      str += cur
    }
    else if (typeof cur === "symbol") {
      if (pretty && cur !== operators.not) str += " "
      str += lang[cur]
      if (pretty && cur !== operators.not) str += " "
    }
    else if (Array.isArray(cur)) {
      str += lang.bracket.open + parseAstTreeToLang(cur, lang, pretty) + lang.bracket.close
    }

  }

  return str
}


// console.log(parseSATStringToAST("-(a & b) | c"))


function parseSATStringToAST (satString) {
  satString = satString.trim()

  const tree = []
  

  let curVar = ""

  while(satString.length > 0) {
    const curCar = satString[0]
    
    if (curCar === " " || curCar === "\t" || curCar === "\n" || curCar === "\r") {
      if (curVar !== "") {
        if (operators[curVar] !== undefined) {
          tree.push(operators[curVar])
        }
        else {
          tree.push(curVar)
        }
        curVar = ""
      }
    }
    else if (curCar === "(" || curCar === "[" || curCar === "{") {
      tree.push(parseSATStringToAST(satString.slice(1)))
      satString = satString.substring(findMatchingCloseBracket(satString), satString.length)
    }
    else if (curCar === ")" || curCar === "]" || curCar === "}") {
      if (curVar !== "") tree.push(curVar)
      return tree
    }
    else if (operators[curCar] !== undefined) {
      if (curVar !== "") {
        tree.push(curVar)
        curVar = ""
      }
      tree.push(operators[curCar])
      if ((curCar === "&" && satString[1] === "&") || (curCar === "|" && satString[1] === "|")) {
        satString = satString.substring(1, satString.length);
      }
    }
    else {
      curVar += curCar
    }

    satString = satString.substring(1, satString.length);
  }

  if (curVar !== "") tree.push(curVar)

  return tree
}


function findMatchingCloseBracket(str) {
  let cumCloseIndex = 0
  let openCount = 0
  while(true) {
    let nextOpenBracket = str.indexOf("(")
    let nextCloseBracket = str.indexOf(")")

    if (nextOpenBracket === -1) nextOpenBracket = Infinity
    if (nextCloseBracket === -1) nextCloseBracket = Infinity

    if (nextOpenBracket > nextCloseBracket) {
      openCount--
      cumCloseIndex += nextCloseBracket + 1
      str = str.substring(nextCloseBracket + 1, str.length)
      if (openCount === 0) return cumCloseIndex - 1
    }
    else {
      openCount++
      cumCloseIndex += nextOpenBracket + 1
      str = str.substring(nextOpenBracket + 1, str.length)
    }
  }
}


exports.parseSATStringToAST = parseSATStringToAST
exports.parseAstTreeToLang = parseAstTreeToLang

