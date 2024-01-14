import express from "express";
import { validate } from "../../middlewares/validate";
import { authValidation } from "../../validations";

const router = express.Router();

router.post("/register", validate(authValidation.register), (req, res) => {
  console.log(req.body);
  res.send("register");
});

export default router;
