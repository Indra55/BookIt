import express from 'express';
import pool from '../config/dbconfig.js';

const router = express.Router();

router.get('/',async(req, res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const searchQuery = req.query.search || '';
        const offset = (page - 1) * limit;
        
        let query = 'SELECT id, title, images, description, location, base_price FROM experiences';
        let countQuery = 'SELECT COUNT(*) FROM experiences';
        const queryParams = [];
        
        if (searchQuery) {
            query += ' WHERE title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1';
            countQuery += ' WHERE title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1';
            queryParams.push(`%${searchQuery}%`);
        }
        
        query += ' ORDER BY id LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
        queryParams.push(limit, offset);
        
        const result = await pool.query(query, queryParams);
        const countResult = await pool.query(countQuery, queryParams.slice(0, searchQuery ? 1 : 0));
        
        res.json({
            page,
            limit,
            total: parseInt(countResult.rows[0].count),
            data: result.rows
        });
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

router.get('/:id',async(req,res)=>{
    try{
        const {id}  = req.params;
        const expResult = await pool.query(
                `SELECT * FROM experiences 
                 WHERE id=$1`,[id]
            )
        if(expResult.rows.length===0){
            return res.status(404).json({message:"Experience not found!"});
        }
        const slotResult = await pool.query(
                `SELECT id, date, time, total_slots, booked_slots, status
                FROM experience_slots
                WHERE experience_id = $1
                ORDER BY date, time`,
                [id]
            );
        const experience = expResult.rows[0];
        experience.slots = slotResult.rows;

        res.json(experience);
    }catch(error){
        res.status(500).json({error:error.message});
    }
  
})

export default router;