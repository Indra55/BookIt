import jwt from 'jsonwebtoken';

const createToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, {expiresIn});

function generateTokens(user) {
    console.log('Generating tokens for user:', user); 
    
    const payload = {
        id: user.id, 
        username: user.username,
        email: user.email
    };
    
    console.log('JWT Payload:', payload);

    const accessToken = createToken(payload, process.env.ACCESS_TOKEN_SECRET, '1h');
    const refreshToken = createToken(payload, process.env.REFRESH_TOKEN_SECRET, '7d');

    return {accessToken, refreshToken};
}

export const jwtTokens = generateTokens;