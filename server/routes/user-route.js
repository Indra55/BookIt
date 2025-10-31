import express from 'express';
import pool from '../config/dbconfig'
import bcrypt  from 'bcryptjs'
import { authenticateToken } from '../middleware/authorization';
import {jwtTokens} from '../utils/jwtUtil'

let refreshTokens = [];

const router = express.Router();

router.get('/',authenticateToken,async(req,res)=>{
    try{
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows})
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

router.get('/me',authenticateToken, async(req,res)=>{
    try{
        const user = await pool.query(`SELECT * from users WHERE id=$1`,[req.user.id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({user:user.rows[0]})
    }catch(error){
        console.error('Error in /me:', error);
        res.status(500).json({error:error.message})
    }
})


router.get('/:username',authenticateToken,async(req,res)=>{
    try{
        const {username} = req.params;
        const user = await pool.query(`SELECT * from users
            WHERE username = $1
            `,[username])
        if(user.rows.length===0) return res.status(404).json({message:'User not found!!'});
        res.status(200).json({users:user.rows})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})


router.put('/me',authenticateToken, async(req,res)=>{
    try{
        const {username,email,password} = req.body;

        let hashedPass;
        if(password) hashedPass=await bcrypt(password,12);

        const result = await pool.query(
            `UPDATE users
            SET username = COALESCE($1 , username),
                email = COALESCE($2 , email)
                password = COALESCE($3 , password)
            WHERE id = $4
            RETURNING id,username,email
            `,[username || null,email || null,password || null,req.user.id]
        )

        if(result.rows.length===0) return res.status(404).json({message:'User not Found!!'});

        res.status(200).json({user: result.rows[0]});

    }catch(error){
        res.status(500).json({error:error.message});
    }
})



export default router;