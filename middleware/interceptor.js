const {thirdwebAuth} = require("../index");

const verifyToken = async (req, res, next) => {
    const openPaths = ['/api/auth/login', '/api/auth/register'];

    // 인증이 필요 없는 경로라면 다음 미들웨어로 진행
    if (openPaths.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];

    // Authorization 헤더가 없거나 잘못된 형식일 때 401 반환
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        const authResult = await thirdwebAuth.verifyJWT({jwt: token});

        // JWT가 유효하지 않은 경우 401 반환
        if (!authResult.valid) {
            return res.status(401).send({message: 'Invalid access token'});
        }

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).send('Failed to verify access token');
    }
};

module.exports = verifyToken;
