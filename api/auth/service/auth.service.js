const {thirdwebAuth} = require('../../../index');
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

class AuthService {
    async generatePayload(address, chainId) {
        return await thirdwebAuth.generatePayload({
            address,
            chainId: chainId ? parseInt(chainId) : undefined,
        });
    }

    async postLogin(payload) {
        // 페이로드 검증
        const verifiedPayload = await this.verifyPayload(payload);

        if (!verifiedPayload.valid) {
            throw new Error('Invalid payload');
        }

        const {address} = verifiedPayload.payload;

        // 사용자 조회
        const user = await this.findUserByAddress(address);
        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = this.generateAccessToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);

        // Refresh Token 저장
        await this.storeRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async findUserByAddress(address) {
        return prisma.user.findUnique({where: {address}});
    }

    async findUserById(userId) {
        console.log(userId)
        return prisma.user.findUnique({where: {id: userId}});
    }

    generateAccessToken(userId) {
        return jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    }

    generateRefreshToken(userId) {
        return jwt.sign({userId}, REFRESH_TOKEN_SECRET);
    }

    async verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return {
                valid: true,
                address: decoded.address,
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Invalid or expired access token',
            };
        }
    }

    async verifyPayload(payload) {
        return await thirdwebAuth.verifyPayload(payload);
    }

    async verifyRefreshToken(refreshToken) {
        try {
            const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            // 토큰에서 필요한 데이터 반환
            return {
                valid: true,
                data,
            };
        } catch (error) {
            return {
                valid: false,
                message: 'Invalid or expired refresh token',
            };
        }
    }

    async storeRefreshToken(userId, refreshToken) {
        return prisma.refreshToken.upsert({
            where: {userId},
            update: {token: refreshToken},
            create: {token: refreshToken, userId},
        });
    }

    async updateRefreshToken(userId) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newAccessToken = this.generateAccessToken(userId);
        const newRefreshToken = this.generateRefreshToken(userId);

        // Refresh Token 저장
        await this.storeRefreshToken(userId, newRefreshToken);

        return {newAccessToken, newRefreshToken};
    }

    async createUser(data) {
        return prisma.user.create({
            data: {
                address: data.address,
                chainId: data.chainId,
                email: data.email,
                nickname: data.nickname,
                universityName: data.universityName,
                collegeName: data.collegeName,
                degreeType: data.degreeType,
                departmentName: data.departmentName,
            },
        });
    }
}

module.exports = new AuthService();
