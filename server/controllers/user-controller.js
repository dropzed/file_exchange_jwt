import UserService from '../services/user-service.js';
import userService from "../services/user-service.js";
import {validationResult} from "express-validator";
import {ApiError} from "../exceptions/api-error.js";


class UserController {
    static async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Bad with validation result', errors.array()));
            }
            const { email, password } = req.body;
            const userData = await UserService.registration(email, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict'});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);



            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:'strict'});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    static async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    static async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    static async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:'strict'});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    static async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e);
        }
    }
}

export default UserController;