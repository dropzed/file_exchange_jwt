import User from "../models-postgres/User.js";
import bcrypt from "bcrypt";
import mailService from "./mail-service.js";
import TokenService from "./token-service.js";
import tokenService from "./token-service.js";
import {UserDto} from "../dtos/user-dto.js";
import * as uuid from "uuid";
import {ApiError} from "../exceptions/api-error.js";
import logService from "./logService.js";


class UserService {
    static async registration(email, password) {
        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            throw ApiError.BadRequest(`User with email: ${email} already registered`)
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const activationLink = uuid.v4()

        const user = await User.create({email, password: hashedPassword, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        // Запись действия в журнал
        await logService.logAction(user.id, user.email, 'user_registered_in', 'User registered in');


        const userDto = new UserDto(user) // id, email, isActivated, role
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }

    static async activate(activationLink) {
        const user = await User.findOne({where: {activationLink} })
        if (!user) {
            throw ApiError.BadRequest(`${activationLink} does not exist`)
        }

        user.isActivated = true;
        await user.save()

        // Запись действия в журнал
        await logService.logAction(user.id, user.email, 'User activate account', 'User activate account');
    }

    static async login(email, password) {
        const user = await User.findOne({where: {email} })
        if (!user) {
            throw ApiError.BadRequest(`${email} does not exist`)
        }
        const isPassEqual = await bcrypt.compare(password, user.password)
        if (!isPassEqual) {
            throw ApiError.BadRequest('Password is not match')
        }
        const userDto = new UserDto(user)

        // Запись действия в журнал
        await logService.logAction(user.id, user.email, 'user_logged_in', 'User logged in');

        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto,
        }

    }

    static async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);

        const user = await User.findOne({where: {email} }) // нахождение email, нужно


        // Запись действия в журнал
        await logService.logAction(user.id, user.email, 'user_logout', 'User logout');

        return token;
    }

    static async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findByPk(userData.id);
        const userDto = new UserDto(user)

        // Запись действия в журнал
        await logService.logAction(user.id, user.email, 'user_refresh_token', 'User refresh token');


        const tokens = TokenService.generateTokens({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto,
        }
    }

    static async getAllUsers() {
        // тут нет логирования, так как эта функция есть только у админа/админов
        return await User.findAll();
    }
}

export default UserService;