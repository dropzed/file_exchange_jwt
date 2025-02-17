import User from "../models-postgres/User.js";
import bcrypt from "bcrypt";
import * as uuid from "uuid";
import {UserDto} from "../dtos/user-dto.js";
import TokenService from "../services/token-service.js";


class AdminControl {
    static async AdminController(req, res) {
        // Проверяем, разрешено ли создание администратора
        if (process.env.ALLOW_CREATE_ADMIN !== 'true') {
            return res.status(403).json({error: 'Creating admin is disabled'});
        }

        try {
            const {email, password} = req.body;

            // Проверка наличия обязательных полей
            if (!email || !password) {
                return res.status(400).json({error: 'Email and password are required'});
            }

            // Проверка, существует ли пользователь с таким email
            const existingUser = await User.findOne({where: {email}});
            if (existingUser) {
                return res.status(400).json({error: 'User already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const activationLink = uuid.v4()

            // Создание нового администратора
            const admin = await User.create({
                email,
                password: hashedPassword,
                activationLink,
                role: 'admin', // Устанавливаем роль 'admin'
            });

            // const user = await User.create({email, password: hashedPassword, activationLink })

            const userDto = new UserDto(admin) // id, email, isActivated, role
            const tokens = TokenService.generateTokens({...userDto})
            await TokenService.saveToken(userDto.id, tokens.refreshToken)

            await admin.save();
            res.status(201).json({message: 'Admin created successfully'});
            return {
                ...tokens,
                admin: userDto,
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Server error'});
        }
    }
}
export default AdminControl;