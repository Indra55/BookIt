import jwt from 'jsonwebtoken';

function authenticateToken(req,res,next){
    try{
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({error:"Auth Header is missing!!"});
        const token = authHeader.split(' ')[1];
        if(!token) return res.status(401).json({error:"Token is missing!!"});

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    }catch(error){
        return res.status(403).json({error:error.message})
    }
}

export {authenticateToken}