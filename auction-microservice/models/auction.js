"use-strict";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AuctionSchema = new Schema(
  {
    item: {
      type: String,
      required: true,
    },
    startPrice: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    currentHighestBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled"],
      default: "ongoing",
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Auction", AuctionSchema);
