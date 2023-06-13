import express from "express";
import { userService } from "../services/user.service.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (_, res) => {
  try {
    const users = await userService.getAll();
    return res.status(200).json({
      status: "success",
      msg: "listado de usuarios",
      payload: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.post("/", async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    if (!firstName || !lastName || !email) {
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        payload: {},
      });
    }
    const userCreated = await userService.create({
      firstName,
      lastName,
      email,
    });
    return res.status(201).json({
      status: "success",
      msg: "user created",
      payload: {
        _id: userCreated._id,
        firstName: userCreated.firstName,
        lastName: userCreated.lastName,
        email: userCreated.email,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email || !_id) {
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        payload: {},
      });
    }
    try {
      const userUpdated = await userService.updateOne({
        _id: _id,
        firstName,
        lastName,
        email,
      });

      if (userUpdated.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "user updated",
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "User not found",
          payload: {},
        });
      }
    } catch (e) {
      return res.status(500).json({
        status: "error",
        msg: "db server error while updating user",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const deleted = await userService.deleteOne( _id );
    if (deleted?.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        msg: "user deleted",
        payload: {},
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});
