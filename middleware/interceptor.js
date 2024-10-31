const {thirdwebAuth} = require("../index");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req, res, next) => {
    const openRoutes = {
        'POST': [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/verification-code',
            '/api/auth/verification-code/check',
            '/api/auth/refresh'
        ],
        'GET': ['/api/auth/isLoggedIn', '/api/auth/login'] // 특정 GET 요청 허용
    };

    const currentMethod = req.method;
    const currentPath = req.path;

    // 해당 메서드에서 인증이 필요 없는 경로라면 다음 미들웨어로 진행
    if (openRoutes[currentMethod]?.includes(currentPath)) {
        return next();
    }

    const authHeader = req.headers['authorization'];

    // Authorization 헤더가 없거나 잘못된 형식일 때 401 반환
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const userId = jwt.verify(token, ACCESS_TOKEN_SECRET);

        req.user = req.user || {};

        req.user.userId = userId.address;

        next(); // 인증 성공 시 다음 미들웨어로 진행
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).send('Failed to verify access token');
    }
};

module.exports = verifyToken;
