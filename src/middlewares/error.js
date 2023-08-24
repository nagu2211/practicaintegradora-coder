import Errors from "../services/errors/enums.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case Errors.REQUIRED_FIELDS:
      res
        .status(400)
        .json({ status: "error", error:error });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
