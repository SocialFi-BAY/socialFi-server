const {thirdwebAuth} = require('../../index');
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Refresh Token 생성 (영구 유효, 로그인 시 갱신)
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET);
};

// 지갑 연결 서명 요청 생성
const generateLoginPayload = async (address, chainId) => {
    return await thirdwebAuth.generatePayload({
        address,
        chainId: chainId ? parseInt(chainId) : undefined,
    });
};

// 사용자 조회
const findUserByAddress = (address) => {
    return prisma.user.findUnique({where: {address}});
};

// Refresh Token 저장
const storeRefreshToken = (userId, refreshToken) => {
    return prisma.refreshToken.upsert({
        where: {userId},
        update: {token: refreshToken},
        create: {token: refreshToken, userId},
    });
};

// JWT 생성
const generateJWT = async (payload) => {
    return await thirdwebAuth.generateJWT({
        payload: payload,
    });
};

// JWT 검증
const verifyJWT = async (token) => {
    return await thirdwebAuth.verifyJWT(token);
};
// payload 검증
const verifyPayload = async (payload) => {
    return await thirdwebAuth.verifyPayload(payload);
};

// 유저 생성 함수
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
    generateLoginPayload,
    findUserByAddress,
    storeRefreshToken,
    generateJWT,
    verifyJWT,
    verifyPayload,
    createUser,
};
