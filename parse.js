const operators = {
  and: Symbol("and"),
  or: Symbol("or"),
  not: Symbol("not"),
  implies: Symbol("implies"),
  implies_reverse: Symbol("impliesReverse"),
  iff: Symbol("iff"),
  xor: Symbol("xor")
};

exports.operators = operators

operators["&"] = operators.and
operators["∧"] = operators.and
operators["^"] = operators.and

operators["|"] = operators.or
operators["∨"] = operators.or


operators["¬"] = operators.not
operators["!"] = operators.not
operators["-"] = operators.not

operators["⇒"] = operators.implies
operators["→"] = operators.implies
operators["=>"] = operators.implies
operators["->"] = operators.implies
operators["==>"] = operators.implies
operators["-->"] = operators.implies
operators["then"] = operators.implies



operators["reverseimplies"] = operators.implies_reverse
operators["reverse_implies"] = operators.implies_reverse
operators["impliesreverse"] = operators.implies_reverse
operators["isimpliedby"] = operators.implies_reverse
operators["is_implied_by"] = operators.implies_reverse
operators["is_implied"] = operators.implies_reverse
operators["if"] = operators.implies_reverse
operators["<="] = operators.implies_reverse
operators["<-"] = operators.implies_reverse
operators["<=="] = operators.implies_reverse
operators["<--"] = operators.implies_reverse
operators["←"] = operators.implies_reverse
operators["⇐"] = operators.implies_reverse


operators["⊕"] = operators.xor
operators["⊻"] = operators.xor

operators["<=>"] = operators.iff
operators["<->"] = operators.iff
operators["⇔"] = operators.iff
operators["↔"] = operators.iff
operators["<==>"] = operators.iff
operators["<-->"] = operators.iff


function operatorsHas(key) {
  return key.toLowerCase() in operators
}

function operatorsGet(key) {
  return operators[key.toLowerCase()]
}


const langIndex = {
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

exports.langIndex = langIndex


const closingBracketIndex = {
  "(": ")",
  "[": "]",
  "{": "}"
}


function parseAstTreeToLang(astTree, lang = langIndex.limbool, pretty = true) {
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
        if (operatorsHas(curCar)) {
          tree.push(operatorsGet(curCar))
        }
        else {
          tree.push(curVar)
        }
        curVar = ""
      }
    }
    else if (curCar === "/" && satString[1] === "/") {
      satString = satString.slice(2)
      while(satString.length > 0 && satString[0] !== "\n") {
        satString = satString.slice(1)
      }
    }
    else if (curCar === "/" && satString[1] === "*") {
      satString = satString.slice(2)
      while(satString.length > 0 && !(satString[0] === "*" && satString[1] === "/")) {
        satString = satString.slice(1)
      }
      satString = satString.slice(2)
    }
    else if (curCar === "(" || curCar === "[" || curCar === "{") {
      tree.push(parseSATStringToAST(satString.slice(1)))
      satString = satString.substring(findMatchingCloseBracket(satString), satString.length)
    }
    else if (curCar === ")" || curCar === "]" || curCar === "}") {
      if (curVar !== "") tree.push(curVar)
      return tree
    }
    else if (operatorsHas(curCar)) {
      if (curVar !== "") {
        tree.push(curVar)
        curVar = ""
      }
      tree.push(operatorsGet(curCar))
      if ((curCar === "&" && satString[1] === "&") || (curCar === "|" && satString[1] === "|")) {
        satString = satString.substring(1, satString.length)
      }
    }
    else {
      curVar += curCar
    }

    satString = satString.substring(1, satString.length)
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

