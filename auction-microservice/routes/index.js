import auctions from "../controllers/auctionCtrl.js";
import bid from "../controllers/bidCtrl.js";
import adminOnly from "../middleware/auth.js";
import cron from "node-cron";
import { Router } from "express";
const router = Router();

router.post("/create", adminOnly, auctions.create);
router.get("/read", auctions.read);
router.get("/read/:id", adminOnly, auctions.readById);
router.put("/update", adminOnly, auctions.update);
router.delete("/delete", adminOnly, auctions.delete);

// status
router.get("/readBy/status", adminOnly, auctions.getAllAuctionStatus);

//============bid routes=========
router.post("/bid", bid.create);
router.post("/winner", bid.auctionWinner);
export default router;
