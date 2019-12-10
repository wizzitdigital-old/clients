const fs = require("fs");

const { name, version } = require("../package.json");
const meta = JSON.stringify({ name, version });

fs.writeFile("./src/meta.json", meta, "utf8", function(err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.");
    return console.log(err);
  }
  console.log("Saved meta.json");
});
