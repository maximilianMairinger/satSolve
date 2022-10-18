const { solve } = require("./index")

const query = `(!A | !B | !C) & (D | !E | C) & (!D | F | !G) & (A | !H | !E) & 
(!F | I | C) & (A | B | !C) & (F | !H | C) & (D | J | !B) & 
(!F | B | C) & (A | !J | E) & (!B | H | !I) & (J | H | E) & 
(!F | !B | !I) & (H | E | !I) & (J | I | !G) & (F | !B | !H) & 
(J | !B | !I) & (!D | J | !C) & (!A | !J | G) & (!A | !F | H) & 
(!A | B | H) & (F | B | !G) & (!J | B | !I) & (!J | B | !E) & 
(J | B | G) & (I | !C | !G) & (D | B | E) & (A | !D | !J) & 
(!H | I | !G) & (!F | I | !G) & (D | !F | I) & (!F | !H | C) & 
(!A | H | !I) & (!D | B | G) & (!B | I | G) & (B | C | !G) & 
(!D | I | C) & (J | H | I) & (!F | H | !I) & (!D | !J | G)`


console.log(solve("a | (b & c)").getAstTree())
