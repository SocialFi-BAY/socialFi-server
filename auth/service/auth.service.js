const {thirdwebAuth} = require('../../index');
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generatePayload = async (address, chainId) => {
    return await thirdwebAuth.generatePayload({
        address,
        chainId: chainId ? parseInt(chainId) : undefined,
    });
};

const postLogin = async (payload) => {
    // 페이로드 검증
    const verifiedPayload = await verifyPayload(payload);

    if (!verifiedPayload.valid) {
        throw new Error('Invalid payload');
    }

    const { address } = verifiedPayload.payload;

    // 사용자 조회
    const user = await findUserByAddress(address);
    if (!user) {
        throw new Error('User not found');
    }

    const accessToken = generateAccessToken(address);
    const refreshToken = generateRefreshToken({ address });

    // Refresh Token 저장
    await storeRefreshToken(user.id, refreshToken);

    return {
        accessToken,
        refreshToken,
    };
};
// 지갑 연결 서명 요청 생성

// 사용자 조회
const findUserByAddress = (address) => {
    return prisma.user.findUnique({where: {address}});
};

const generateAccessToken = (address) => {
    return jwt.sign(address, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
const generateRefreshToken = (address) => {
    return jwt.sign(address, REFRESH_TOKEN_SECRET);
};
// Access Token 검증
const verifyAccessToken = async (token) => {
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
};
// payload 검증
const verifyPayload = async (payload) => {
    return await thirdwebAuth.verifyPayload(payload);
};
const verifyRefreshToken = async (refreshToken) => {
    try {
        const address = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        // 토큰에서 필요한 데이터 반환
        return {
            valid: true,
            address,
        };
    } catch (error) {
        return {
            valid: false,
            message: 'Invalid or expired refresh token',
        };
    }
};
const storeRefreshToken = (userId, refreshToken) => {
    return prisma.refreshToken.upsert({
        where: {userId},
        update: {token: refreshToken},
        create: {token: refreshToken, userId},
    });
};

const updateRefreshToken = async (address) => {
    const user = await findUserByAddress(address);
    if (!user) {
        throw new Error('User not found');
    }

    const newAccessToken = await generateAccessToken({ address });
    const newRefreshToken = generateRefreshToken(address);

    await storeRefreshToken(user.id, newRefreshToken);

    return { newAccessToken, newRefreshToken };
};

const createUser = async (data) => {
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
};

module.exports = {
    generateRefreshToken,
     generatePayload,
    findUserByAddress,
    storeRefreshToken,
    generateAccessToken,
    verifyAccessToken,
    verifyPayload,
    createUser,
    verifyRefreshToken,
    updateRefreshToken,
    postLogin
};
