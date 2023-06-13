import express from "express";


export const chatRouter = express.Router();


chatRouter.get("/", async (_, res) => {
    return res.status(200).render("chat", {});
});
