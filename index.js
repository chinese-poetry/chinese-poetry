const fs = require("fs");

const poems = require("./shijing/shijing.json");
// const poems = require("./test.json");

const length = poems.length;

const poem = poems[Math.floor(Math.random() * length)];
// const poem = poems[0];

const str = `${poem.title} - ${poem.chapter} - ${
  poem.section
} \n${poem.content.join("\n")}`;
console.log(str);
fs.writeFileSync("./poem.txt", str);
