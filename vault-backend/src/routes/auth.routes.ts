import express from "express";
import * as Auth_Controller from "../controllers/auth.controller";
import * as Validation_Middleware from "../middlewares/validation.middleware";
// import { authMiddleware } from "../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../utils/validation.utils";
// import { authMiddleware } from "../middlewares/auth.middleware";
const router = express.Router();

//@route   GET /auth/login
//desc     Get login page
router.get("/login", Auth_Controller.getLoginPage);

//@route   GET /auth/register
//desc     Get register page
router.get("/register", Auth_Controller.getRegisterPage);

//@route   POST /auth/login
//desc     Login user
router.post(
  "/register",
  Validation_Middleware.validate(registerSchema),
  Auth_Controller.RegisterUser
);

//@route   POST /auth/login
//desc     Login user
router.post(
  "/login",
  Validation_Middleware.validate(loginSchema),
  Auth_Controller.loginUser
);

//@route   POST /auth/logout
//desc     Logout user
// Now expects Authorization header with Bearer token
router.post("/logout", Auth_Controller.logoutUser);

router.get("/forgot", Auth_Controller.getForgot);

router.get("/reset-password/:token", Auth_Controller.getReset);

router.post("/reset-password/:token", Auth_Controller.resetPassword);

router.post("/forgot", Auth_Controller.forgotPassword);

//@route GET /auth/protected
//desc protected

// router.get('/protected', authMiddleware, (req, res)=> {
//     res.status(200).json({"protected"})
// })

export default router;
