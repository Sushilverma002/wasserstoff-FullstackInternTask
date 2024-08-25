import bidModel from "../models/bid.js";
import auctionModel from "../models/auction.js";
import axios from "axios";
import apiResponseHandler from "../utilites/apiResponseHandler.js";
const bid = Object();

bid.create = async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;

    //step 0: check weather this aucation exisit
    const auctionExist = await auctionModel.findById(auctionId);

    if (!auctionExist) {
      apiResponseHandler.sendError(
        400,
        false,
        "Auction doesn't exist",
        (response) => {
          res.json(response);
        }
      );
    }

    const token = req.headers.authorization.split(" ")[1];

    //step 1: vaildate the token with the auth- user
    const options = {
      method: "GET",
      url: "http://localhost:4000/api/v1/user/vaildateToken",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(options);
    console.log("response data->>>>>>...", response.data.results._id);
    const userId = response?.data?.results?._id;
    if (!userId) {
      apiResponseHandler.sendError(
        401,
        false,
        "user Authentication failed",
        (response) => {
          res.json(response);
        }
      );
    }

    //step 2 : update the details in bid schema
    const bidDeatils = await bidModel.create({
      userId,
      bidAmount,
      auctionId,
    });

    //step 3 and 4: we need to check the current userid present HAS THE HIGHEST BID in the auction is yes id remain else it will replace the one having hight bid

    const auctionDetails = await auctionModel.findByIdAndUpdate(
      auctionId,
      {
        $push: { bids: bidDeatils._id },
        $max: { currentHighestBid: bidAmount }, // Update only if bidAmount is higher
        $set:
          bidAmount > auctionExist.currentHighestBid
            ? { currentHighestBidderId: userId }
            : {},
      },
      { new: true }
    );

    if (bidDeatils && auctionDetails) {
      return apiResponseHandler.sendResponse(
        200,
        true,
        bidDeatils,
        (response) => {
          res.json(response);
        }
      );
    } else {
      apiResponseHandler.sendResponse(
        400,
        false,
        "Something went wrong, while creating bid",
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

//desiding the winner
bid.auctionWinner = async (req, res) => {
  try {
    //step 1 : very First we will fetch all the auction which are still ongoing
    const onGoingAuctions = await auctionModel.find({
      endTime: { $lt: new Date() },
      status: "ongoing",
    });
    console.log(onGoingAuctions);
    if (onGoingAuctions.length === 0) {
      return apiResponseHandler.sendError(
        404,
        false,
        "No auction which are still ongoing",
        (response) => {
          res.json(response);
        }
      );
    }
    for (const auction of onGoingAuctions) {
      // we will check ther is bid on the action so set the winner id in the auction

      if (auction.currentHighestBidderId) {
        // if there is winner
        auction.winnerId = auction.currentHighestBidderId;
      } else {
        //if no bid hence auction if complete but with out winner
        auction.winnerId = null;
      }

      //updating the auction status as updated
      auction.status = "completed";
      await auction.save();
      console.log(`Auction ${auction._id} has been completed.`);
    }

    // All auctions have been checked and updated
    return apiResponseHandler.sendResponse(
      200,
      true,
      "All ongoing auctions have been checked and updated",
      (response) => {
        res.json(response);
      }
    );
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
export default bid;
