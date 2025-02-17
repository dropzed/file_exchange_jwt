import express from "express";
import UserController from "../controllers/user-controller.js";
import {body} from "express-validator"
import authMiddleware from "../middlewares/auth-middleware.js";
import uploadMiddleware from "../middlewares/upload-middleware.js";
import {isAdmin} from "../middlewares/role-middleware.js";
import AdminControl from "../controllers/admin-controller.js";
import ActionsWithFiles from "../controllers/file-controller.js";



const router = express.Router();


// JWT authorization
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:15}),
    UserController.registration)
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/admin/users', authMiddleware, isAdmin, UserController.getUsers)


// uploading file
router.post('/upload', authMiddleware, uploadMiddleware.single('file'), ActionsWithFiles.upload);

// downloading file
router.get('/download/private/:filename', authMiddleware, ActionsWithFiles.downloadFile)
router.get('/download/public/:filename', ActionsWithFiles.downloadFile)


// admin
router.post('/create-admin',AdminControl.AdminController );



export default router;