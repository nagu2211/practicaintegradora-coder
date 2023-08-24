import express from "express";

export const loggerTest = express.Router();

loggerTest.get("/", (req, res) => {
    req.logger.info("entering an important process");

  req.logger.info(
    "STEP 1: " +
      new Date().toLocaleTimeString() +
      new Date().getUTCMilliseconds()
  );
  try {
    gdfshjsdjgsjdfgjsdgfjhdsgfgjhsgjhsgdf();
  } catch (error) {
    req.logger.warn(error.message);
  }

  req.logger.info(
    "STEP 2: " +
      new Date().toLocaleTimeString() +
      new Date().getUTCMilliseconds()
  );

  try {
    sdfsdgsfd();
  } catch (error) {
    req.logger.error(error.message);
    return res
      .status(400)
      .json({ msg: "something important went wrong no continue" });
  }

  res.send({ message: "end of the process!" });
  });
