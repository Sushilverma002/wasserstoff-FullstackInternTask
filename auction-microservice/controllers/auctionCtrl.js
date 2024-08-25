import AuctionModel from "../models/auction.js";
import apiResponseHandler from "../utilites/apiResponseHandler.js";
const auctions = Object();

auctions.create = async (req, res) => {
  try {
    // step 1 : fetch data
    const { item, startPrice, startTime, endTime } = req.body;

    // step 2 : we'll check wheather the same name item is ongoing or upcoming
    const existingAuction = await AuctionModel.findOne({
      item: item,
      status: { $in: ["ongoing", "upcoming"] },
    });

    if (existingAuction) {
      return apiResponseHandler.sendError(
        400,
        false,
        `Auction for the item '${item}' already exists with status '${existingAuction.status}'`,
        (response) => {
          res.json(response);
        }
      );
    }

    // step 3 : some required fields required
    if (!item || !startPrice || !startTime || !endTime) {
      return apiResponseHandler.sendError(
        403,
        false,
        "All fields are required.",
        function (response) {
          res.json(response);
        }
      );
    }

    const auctionDeatils = await AuctionModel.create({
      ...req.body,
    });

    if (auctionDeatils) {
      apiResponseHandler.sendResponse(
        200,
        true,
        auctionDeatils,
        function (response) {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Auction not created",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};
auctions.read = async (req, res) => {
  try {
    // step 1: get all the auction details
    const auctionDeatils = await AuctionModel.find({});

    const secert = req.headers["x-api-key"];

    if (!secert) {
      const auctionDeatils = await AuctionModel.find({ status: "ongoing" });
      return apiResponseHandler.sendResponse(
        200,
        true,
        auctionDeatils,
        function (response) {
          res.json(response);
        }
      );
    }

    if (auctionDeatils) {
      return apiResponseHandler.sendResponse(
        200,
        true,
        auctionDeatils,
        function (response) {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Something went wrong, while fecting auctions.",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};
auctions.readById = async (req, res) => {
  try {
    const { id } = req.params;
    // step 1: get all the auction details
    const auctionDeatils = await AuctionModel.findById(id);

    if (auctionDeatils) {
      apiResponseHandler.sendResponse(
        200,
        true,
        auctionDeatils,
        function (response) {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Somethin went wrong, while fecting auctions.",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};
auctions.update = async (req, res) => {
  try {
    const { id } = req.body;

    // step 1 : some required fields required
    if (!id) {
      return apiResponseHandler.sendError(
        403,
        false,
        "Auction id is required field",
        function (response) {
          res.json(response);
        }
      );
    }

    //step 2: check whether this item exist or not
    const ItemDeatils = await AuctionModel.findById(id);

    if (!ItemDeatils) {
      return apiResponseHandler.sendError(
        400,
        false,
        "Item not exist in Auction.",
        (response) => {
          res.json(response);
        }
      );
    }

    //step 3: update the details
    const updateDeatils = await AuctionModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    //step 4: return reponse data udpated successfully
    if (updateDeatils) {
      delete updateDeatils._doc.password;
      return apiResponseHandler.sendResponse(
        200,
        true,
        updateDeatils,
        (response) => {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendResponse(
        400,
        false,
        "Something went wrong, auction details are not updated",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log("Error occured:", error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, Internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};
auctions.delete = async (req, res) => {
  try {
    //step 1 taking id in the req. body
    const { id } = req.body;

    //step 2 vaildate and delete the auction
    const deleteUser = await AuctionModel.findByIdAndDelete(id);

    //step 3 sending response as auction delete successfully
    if (deleteUser) {
      return apiResponseHandler.sendResponse(
        200,
        true,
        "Auction deleted successfully",
        (response) => {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendResponse(
        400,
        false,
        "Something went wrong, Auction not deleted",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log("Error occured:", error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, Internal server error",
      (response) => {
        res.json(response);
      }
    );
  }
};

auctions.getAllAuctionStatus = async (req, res) => {
  try {
    // step 1: get all the auction status
    const auctionDeatils = await AuctionModel.find(
      {},
      "item currentHighestBid status"
    ).sort({
      endTime: -1,
    });

    if (auctionDeatils) {
      return apiResponseHandler.sendResponse(
        200,
        true,
        auctionDeatils,
        function (response) {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendError(
        400,
        false,
        "Something went wrong, while fecting auctions.",
        (response) => {
          res.json(response);
        }
      );
    }
  } catch (error) {
    console.log(error);
    apiResponseHandler.sendError(
      500,
      false,
      "Something went wrong, internal sever error.",
      function (response) {
        res.json(response);
      }
    );
  }
};
export default auctions;
