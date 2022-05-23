const express = require("express");
const port = 3000;

const app = express();
console.log(`Worker Number ${process.pid} started`);

app.get("/api/nocluster", function (req, res) {
  console.time("noclusterApi");
  const base = 8;
  let result = 0;
  //This loops 8 to the power of 7 times, performs a math power function and returns the base to the exponent power
  for (let i = Math.pow(base, 7); i >= 0; i--) {
    result += i + Math.pow(i, 10); //adds it to a number in each loop and assigns to the result variable
  }
  console.timeEnd("noclusterApi");

  console.log(`Result is ${result} - on process ${process.pid}`); //Console logs the result
  res.send(`Result number is ${result}`); //returns result as the response
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
