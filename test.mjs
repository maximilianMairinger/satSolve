import { solve } from "./dist/esm/index.mjs"
import fs from "fs"

const query = fs.readFileSync("query.sat").toString()


const out = solve(query).findOne()
console.log(out)