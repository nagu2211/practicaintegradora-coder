import winston from "winston"
import { PORT } from "../app.js";

export const devLogger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.colorize({ all: true }),
      })],
  });

export const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.colorize({ all: true }),
          }),
          new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.simple(),
          }),
        ],
  });
  export const addLogger = (req, res, next) => {
    if(PORT == 8080){
        req.logger = devLogger;
        next();
    } else {
        req.logger = prodLogger;
        next();
    }
  };