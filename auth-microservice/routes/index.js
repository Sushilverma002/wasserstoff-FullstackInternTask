import { Router } from "express";
import { onlyAdminAccess, Auth } from "../middleware/auth.js";
const router = Router();
import user from "../controllers/userCntrl.js";

//============== user routes ============
router.post("/signUp", user.register);
// router.get("/verfiyEmail/:token", user.verfiyMail);
router.post("/login", user.login);
router.put("/update", user.update);
router.delete("/delete", onlyAdminAccess, user.delete);

router.get("/users", onlyAdminAccess, user.getUserData);

router.get("/vaildateToken", Auth, user.vaildateToken);

export default router;
