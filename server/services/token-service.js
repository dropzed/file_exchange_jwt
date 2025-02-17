import jwt from 'jsonwebtoken'
import TokenSchema from '../models-postgres/Token.js'

class TokenService {
    static generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    static validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
        } catch (e) {
            return null;
        }
    }

    static validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (e) {
            return null;
        }
    }

    static async saveToken(userId, refreshToken) {
        try {
            const tokenData = await TokenSchema.findOne({where: { userId } })
            if (tokenData) {
                tokenData.refreshToken = refreshToken
                return tokenData.save()
            }
            return await TokenSchema.create({userId, refreshToken});
        } catch (e) {
            console.error('TokenService.saveToken error:',e)
            throw e;
        }
    }

    static async removeToken(refreshToken) {
        return await TokenSchema.destroy({where: {refreshToken}});
    }

    static async findToken(refreshToken) {
        return await TokenSchema.findOne({where: {refreshToken}});
    }
}

export default TokenService;