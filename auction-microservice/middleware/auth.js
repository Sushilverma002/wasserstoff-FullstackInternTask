import AuctionModel from "../models/auction.js";
import apiResponseHandler from "../utilites/apiResponseHandler.js";
import { config } from "dotenv";
config();
const adminOnly = (req, res, next) => {
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
export default adminOnly;
