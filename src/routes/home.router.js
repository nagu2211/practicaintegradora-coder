import express from "express";


export const HomeRouter = express.Router();

HomeRouter.get("/", async (_, res) => {
    try {
      return res.status(200).render("home",{});
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  });
  