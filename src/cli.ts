#!/usr/bin/env node
import { program } from "commander"
import reqPackageJson, { reqPackagePath } from "req-package-json"
const config = reqPackageJson()
import {promises as fs} from "fs"
import { solve } from "./index"


program
  .version(config.version)
  .description(config.description)
  .name(config.name)
  .option('--single', 'Only return a single solution')
  .argument('<file>', 'file to process')
  .action(async (fileName, options) => {
    const fileContent = await fs.readFile(fileName, "utf8")
    const solver = solve(fileContent)

    if (options.single) {
      const result = solver.findOne()
      console.log(result)
      printResultsInLimbool([result])
    }
    else {
      const results = solver.findAll()
      console.log(results)
      printResultsInLimbool(results)
      console.log("Count:", results.length)
    }
  })

.parse(process.argv)
  

function printResultsInLimbool(results: object[]) {
  for (const line of results) {
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
}