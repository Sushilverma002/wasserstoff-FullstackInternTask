import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BidSchema = new Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auction",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    bidAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Bid", BidSchema);
