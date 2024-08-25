import apiResponseHandler from "../utilites/apiResponseHanlder.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const Auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : req.body?.token;

    if (!token) {
      return apiResponseHandler.sendError(
        401,
        false,
        "Access denied. Token not provided.",
        function (response) {
          res.json(response);
        }
      );
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      apiResponseHandler.sendResponse(
        401,
        false,
        "Invalid token. Please provide a valid token for authentication.",
        function (response) {
          return res.json(response);
        }
      );
    }
    return next();
  } catch (error) {
    apiResponseHandler.sendError(
      401,
      false,
      "Invalid token. Please provide a valid token for authentication.",
      function (response) {
        return res.json(response);
      }
    );
  }
};

const onlyUserAccess = (req, res, next) => {
  try {
    if (req.user.role !== "User") {
      return apiResponseHandler.sendResponseMsg(
        400,
        false,
        "Access Denied, this is Protected route for user  only.",
        function (response) {
          res.json(response);
        }
      );
    }
  } catch (error) {
    apiResponseHandler.sendError(
      401,
      false,
      "user role not matching",
      function (response) {
        return res.json(response);
      }
    );
  }
  return next();
};

const onlyAdminAccess = (req, res, next) => {
  try {
    const secert = req.headers["x-api-key"];
    if (!secert || secert !== process.env.ADMIN_API_KEY) {
      return apiResponseHandler.sendResponseMsg(
        400,
        false,
        "Access Denied, this is Protected route for Admin only.",
        function (response) {
          res.json(response);
        }
      );
    }
  } catch (error) {
    return apiResponseHandler.sendError(
      401,
      false,
      "user role not matching",
      function (response) {
        return res.json(response);
      }
    );
  }
  return next();
};

export { onlyUserAccess, onlyAdminAccess, Auth };
