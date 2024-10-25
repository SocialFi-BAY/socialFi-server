const service = require('../service/auth.service');
const {validationResult} = require('express-validator');
// 지갑 연결을 위한 서명 요청
const getLogin = async (req, res) => {
    const address = req.query.address;
    const chainId = req.query.chainId;


    if (typeof address !== 'string') {
        return res.status(400).send('Address is required');
    }

    const payload = await service.generateLoginPayload(address, chainId);
    return res.send(payload);
};

// 로그인 처리 및 JWT 발급
const postLogin = async (req, res) => {
    const payload = req.body;
    const verifiedPayload = await service.verifyPayload(payload);

    if (verifiedPayload.valid) {
        const {address} = verifiedPayload.payload;

        const user = await service.findUserByAddress(address);
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }
        const refreshToken = service.generateRefreshToken({address});
        await service.storeRefreshToken(user.id, refreshToken);

        const jwt = await service.generateJWT(verifiedPayload.payload);

        res.setHeader('Authorization', `Bearer ${jwt}`);
        return res.status(200).send({message: 'Login successful'});
    }

    return res.status(400).send('Failed to login');
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

module.exports = {getLogin, postLogin, isLoggedIn, register};
