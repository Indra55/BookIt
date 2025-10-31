import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/dbconfig.js';
import bcrypt from 'bcryptjs';
import {jwtTokens} from '../utils/jwtUtil.js'

const router = express.Router();

router.post('/login',async(req,res)=>{
    try{
        const {idf,password} = req.body;
        
        if (!idf) {
            return res.status(400).json({ error: "Username or email is required" });
        }
        
        const isemail = String(idf).includes('@');
        const users = await pool.query(`SELECT * FROM users WHERE ${isemail ? 'email':'username'} = $1`,[idf]);
        if(users.rows.length === 0) return res.status(401).json({error:`${isemail ? 'Email' : 'Username'} is incorrect`
});

        const validPass = await bcrypt.compare(password, users.rows[0].password);
        if (!validPass) return res.status(401).json({ error: "Incorrect Password!!" });

        const user = {
            id: users.rows[0].id, 
            username: users.rows[0].username,
            email: users.rows[0].email
        };

        console.log('Logging in user with ID:', user.id); 
        
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {
            ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.json(tokens);
    }catch(error){
        res.status(401).json({error:error.message});
    }
});

router.post('/register',async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password) return res.status(400).json({error:"All fields are compulsory!!"});
        if(username.includes('@')) return res.status(400).json({error:"'@' not allowed in username"});
        if(password.length<8) return res.status(400).json({error:"Password length should be atleast 8"});

        const hashedPass = await bcrypt.hash(password,12);

        const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1 OR username=$2`,
            [email,username]
        );
        if(existingUser.rows.length>0){
            const user = existingUser.rows[0];
            if(user.email === email){
                return res.status(400).json({error:"Email already exists!!"});
            }
            if(user.username === username){
                return res.status(400).json({error:"Username already exists!!"});
            }
        }

        const insertResult = await pool.query(`INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email`,
                [username,email,hashedPass]
            );
            const newUser = insertResult.rows[0];

            const tokens = jwtTokens(newUser);

            res.cookie('refresh_token',tokens.refreshToken,{
                ...(process.env.COOKIE_DOMAIN && {domain:process.env.COOKIE_DOMAIN}),
                httpOnly:true,
                sameSite:'none',
                secure:true
            });

        return res.status(201).json({message:"User registered Successfully",accessToken:tokens.accessToken,user:{id:newUser.id, username:newUser.username, email:newUser.email}})  
    }catch(error){
        return res.status(500).json({error:error.message})
    }
});

router.post('/logout',async (req,res)=>{
    res.cookie('refresh_token','',{
        ...(process.env.COOKIE_DOMAIN && {domain:process.env.COOKIE_DOMAIN}),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(0)
    });

    res.status(200).json({message:'Logged out successfully'});
});

router.get('/refresh_token',(req,res)=>{
    try{
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) return res.sendStatus(401)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
        if(error) return res.status(403).json({error:error.message})

        const tokens = jwtTokens(user);
        res.cookie('refresh_token',tokens.refreshToken,
            {...(process.env.COOKIE_DOMAIN && {domain:process.env.COOKIE_DOMAIN}),
        httpOnly:true,
        sameSite:'none',
        secure:true,
    })
        return res.json({accessToken:tokens.accessToken});
        });
    }catch(error){
        res.status(401).json({error:error.message})
    }
})

router.delete('/refresh_token',(req,res)=>{
    try{
        res.clearCookie('refresh_token',{
            ...(process.env.COOKIE_DOMAIN && {domain:process.env.COOKIE_DOMAIN}),
            httpOnly: true,
            sameSite:'none',
            secure:true
        });
        return res.status(200).json({message: "Logged Out Successfully!!"})
    }catch(error){
        return res.status(500).json({error:error.message})
    }
})


export default router;