let config = require("./config");
const dbURL = config.DBURL;
const { createLogger, transports, format } = require("winston");
require("winston-mongodb");
const logger = createLogger({
  transports: [
    new transports.File({
      filename: "info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      level: "error",
      db: dbURL,
      options: { useUnifiedTopology: true },
      collection: "logs",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
