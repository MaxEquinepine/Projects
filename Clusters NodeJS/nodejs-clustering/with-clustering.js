const express = require("express");
const port = 3001;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length; //totalCPUs is assigned to the number of CPU cores available (8 for me)

if (cluster.isMaster) {
  //Check whether the cluster is a master
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Parent ${process.pid} is running`);

  // Fork number of instances(workers) to the available cores
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork(); //used to start the worker processes
  }

  cluster.on("exit", (worker, code, signal) => {
    //If a worker dies, then another one can be created immediately
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  //if it's not a master process, a worker will call the start function
  start();
}

function start() {
  //I'm creating instances that will share port 3001
  //and be capable of handling requests made to that port
  const app = express();
  console.log(`Worker ${process.pid} started`);

  app.get("/api/withcluster", function (req, res) {
    console.time("withclusterApi");
    const base = 8;
    let result = 0;
    for (let i = Math.pow(base, 7); i >= 0; i--) {
      result += i + Math.pow(i, 10);
    }
    console.timeEnd("withclusterApi");

    console.log(`Result is ${result} - on process ${process.pid}`);
    res.send(`Result number is ${result}`);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
