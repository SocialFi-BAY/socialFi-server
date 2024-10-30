const service = require('../service/auth.service');
const {validationResult} = require('express-validator');

// 지갑 연결을 위한 서명 요청
const getLogin = async (req, res) => {
    const address = req.query.address;
    const chainId = req.query.chainId;

    if (typeof address !== 'string') {
        return res.status(400).send('Address is required');
    }

    const payload = await service.generatePayload(address, chainId);
    return res.send(payload);
};

// 로그인 처리 및 JWT 발급
const postLogin = async (req, res) => {
    try {
        const tokens = await service.postLogin(req.body);

        res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
        return res.status(200).json({
            message: 'Login successful',
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        const statusCode = error.message === 'User not found' ? 404 : 400;
        return res.status(statusCode).json({message: error.message});
    }
};

// 로그인 되었는지 확인
const isLoggedIn = async (req, res) => {
    return res.send(true);
};

// 회원가입
const register = async (req, res) => {
    // 유효성 검사 결과 확인
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Validation failed', errors: errors.array()});
    }

    try {
        const user = await service.createUser(req.body);
        return res.status(201).json({message: 'User registered successfully', user});
    } catch (error) {
        res.status(400).json({message: 'Registration failed', error: error.message});
    }
};

// Refresh Token을 이용한 Access Token 갱신
const refresh = async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(400).json({message: 'Refresh token is required'});
    }

    try {
        const {address, valid} = await service.verifyRefreshToken(refreshToken);

        if (!valid) {
            return res.status(404).json({message: 'Invalid refresh token'});
        }
        const {newAccessToken, newRefreshToken} = await service.updateRefreshToken(address);

        return res.status(200).json({
            message: 'Tokens refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({message: 'Invalid refresh token', error: error.message});
    }
};
module.exports = {getLogin, postLogin, isLoggedIn, register, refresh};
