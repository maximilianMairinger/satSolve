import { parseAstTreeToLang, parseSATStringToAST, operators, langIndex, operatorsSelfContaining, AST } from "./parse"
export { parseAstTreeToLang, parseSATStringToAST, operators, langIndex, operatorsSelfContaining } from "./parse"
import Logic from "logic-solver"

// const sol = new Logic.Solver()


const operatorToLogicSolverKeyword = {
  [operators.and]: "and",
  [operators.or]: "or",
  [operators.not]: "not",
  [operators.implies]: "implies",
  [operators.implies_reverse]: "implies",
  [operators.xor]: "xor",
  [operators.iff]: "iff"
}

function formulateClause(token) {
  if (token instanceof Array) {
    return createForumla(token)
  }
  else if (typeof token === "string") {
    return token
  }
}


function createForumla(astTree) {
  let forumla

  for (let i = 0; i < astTree.length; i++) {
    let token = astTree[i]
    let nextToken = astTree[i + 1]

    
    if (typeof token === "symbol") {
      if (token === operators.not) {
        if (forumla === undefined) {
          let count = 0
          while (token === operators.not) {
            i++
            count++
            token = astTree[i]
          }
          const clause = formulateClause(token)
          if (clause === undefined) throw new Error("Invalid syntax")
          forumla = count % 2 === 0 ? clause : Logic.not(clause)
        }
        else throw new Error("Invalid syntax")
        continue
      }


      const nextClause = formulateClause(nextToken)
      if (nextClause === undefined) {
        if (nextToken === operators.not) {
          let count = 0
          while (nextToken === operators.not) {
            i++
            count++
            nextToken = astTree[i + 1]
          }
          
          const nextClause = formulateClause(nextToken)
          if (nextClause === undefined) throw new Error("Invalid syntax")
          i++
          forumla = Logic[operatorToLogicSolverKeyword[token]](forumla, count % 2 === 0 ? nextClause : Logic.not(nextClause))
        }
        else throw new Error("Invalid syntax")
      }
      else if (operatorToLogicSolverKeyword[token] !== undefined) {
        i++
        if (token === operators.implies_reverse) forumla = Logic[operatorToLogicSolverKeyword[token]](nextClause, forumla)
        else forumla = Logic[operatorToLogicSolverKeyword[token]](forumla, nextClause)
      }
      else throw new Error("Invalid operator")
    }
    else if (typeof token === "string") {
      if (forumla === undefined) {
        forumla = token
      }
      else throw new Error("Invalid syntax")
    }
    else if (token instanceof Array) {
      if (forumla === undefined) {
        forumla = createForumla(token)
      }
      else throw new Error("Invalid syntax")
    }
  }
  return forumla
}

function memoizeVar(fn) {
  let cache
  return function() {
    if (cache === undefined) cache = fn()
    return cache
  }
}

export function solve(astString_solver: string | Logic.Solver) {
  let getSolver = undefined
  let errorAst = undefined 
  let error = undefined
  let astTree = undefined
  if (typeof astString_solver === "string") {
    const astString = astString_solver
    try {
      astTree = parseSATStringToAST(astString)
    }
    catch (e) {
      errorAst = error = new Error("Error parsing the input to a astTree. This really shouldnt happen even with wrong syntax :/")
    }
    
  
    
  
    getSolver = memoizeVar(() => {
      let solver = new Logic.Solver();
      let errorSolver = undefined
      if (error === undefined) {
        try {
          solver.require(createForumla(astTree))
        }
        catch(e) {
          error = errorSolver = new Error("Error parsing the astTree to a solver. This may happen because you provided a term with wrong syntax. Please check your input. You may view the successfully produced astTree (with getAstTree()) to debug the problem.")
          console.error(e)
        }
      }
      return solver
    })
  }
  else {
    getSolver = () => astString_solver
  }
  

  return {
    findOne() {
      const solver = getSolver()
      if (error) throw error
      return solver.solve()?.getMap() as {[key: string]: boolean}
    },
    findAll() {
      const solver = getSolver()
      if (error) throw error
      
      let allSolutions = [];
      let curSolution = null;
      while ((curSolution = solver.solve())) {
        allSolutions.push(curSolution.getMap());
        solver.forbid(curSolution.getFormula());
      }
      return allSolutions as {[key: string]: boolean}[]
    },
    getSolver() {
      const solver = getSolver()
      if (error) throw error
      return solver as Logic.Solver
    },
    getAstTree() {
      if (errorAst) throw errorAst
      return astTree as AST
    }
  }
}



