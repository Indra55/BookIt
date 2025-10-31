import express from 'express';
import pool from '../config/dbconfig.js';
import emailService from '../services/emailService.js';
import { runInBackground } from '../utils/backgroundTasks.js';

const router = express.Router();

const validateBookingInput = (req, res, next) => {
  const { experience_id, slot_id, user_name, user_email, quantity } = req.body;
  
  const errors = [];
  
  if (!experience_id || !slot_id || !user_name || !user_email || !quantity) {
    errors.push('Missing required fields');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (user_email && !emailRegex.test(user_email)) {
    errors.push('Invalid email format');
  }
  
  if (quantity && (quantity < 1 || quantity > 10)) {
    errors.push('Quantity must be between 1 and 10');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
  next();
};

router.post('/promo/validate', async (req, res) => {
  try {
    const { promo_code, subtotal } = req.body;
    
    if (!promo_code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }
    
    const promoRes = await pool.query(
      `SELECT code, discount_percent, expires_at, active 
       FROM promo_codes 
       WHERE UPPER(code) = UPPER($1) AND active = true`,
      [promo_code]
    );
    
    if (promoRes.rows.length === 0) {
      return res.status(400).json({ 
        valid: false,
        message: 'Invalid promo code' 
      });
    }
    
    const promo = promoRes.rows[0];
    
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return res.status(400).json({ 
        valid: false,
        message: 'Promo code has expired' 
      });
    }
    
    const discount = subtotal ? parseFloat(((subtotal * promo.discount_percent) / 100).toFixed(2)) : 0;
    
    res.json({
      valid: true,
      message: 'Promo code applied successfully',
      promo: {
        code: promo.code,
        discount_percent: promo.discount_percent,
        discount_amount: discount
      }
    });
    
  } catch (error) {
    console.error('Promo validation error:', error);
    res.status(500).json({ 
      message: 'Failed to validate promo code',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create a new booking
router.post('/', validateBookingInput, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { experience_id, slot_id, user_name, user_email, quantity, promo_code } = req.body;
    
    await client.query('BEGIN');
    
    const dataRes = await client.query(
      `SELECT 
        e.base_price,
        s.total_slots,
        s.booked_slots,
        s.date,
        s.time
      FROM experiences e
      INNER JOIN experience_slots s ON s.experience_id = e.id
      WHERE e.id = $1 AND s.id = $2
      FOR UPDATE OF s`,
      [experience_id, slot_id]
    );
    
    if (dataRes.rows.length === 0) {
      throw new Error('Experience or slot not found');
    }
    
    const { base_price, total_slots, booked_slots, date, time } = dataRes.rows[0];
    
    const available_slots = total_slots - booked_slots;
    if (available_slots < quantity) {
      return res.status(409).json({ 
        message: 'Not enough available slots',
        available: available_slots,
        requested: quantity
      });
    }
    
    let discount_percent = 0;
    let promo_applied = null;
    
    if (promo_code) {
      const promoRes = await client.query(
        `SELECT discount_percent, expires_at, active 
         FROM promo_codes 
         WHERE UPPER(code) = UPPER($1) AND active = true`,
        [promo_code]
      );
      
      if (promoRes.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid promo code' });
      }
      
      const promo = promoRes.rows[0];
      
      if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        return res.status(400).json({ message: 'Promo code has expired' });
      }
      
      discount_percent = promo.discount_percent;
      promo_applied = promo_code;
    }
    
    const subtotal = parseFloat((base_price * quantity).toFixed(2));
    const discount = parseFloat(((subtotal * discount_percent) / 100).toFixed(2));
    const tax_rate = 0.059;  
    const tax = Math.round((subtotal - discount) * tax_rate * 100) / 100;  
    const total = parseFloat((subtotal - discount + tax).toFixed(2));
    
    const bookingResult = await client.query(
      `INSERT INTO bookings 
        (experience_id, slot_id, user_name, user_email, quantity, promo_code, subtotal, discount, tax, total, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING id, created_at`,
      [experience_id, slot_id, user_name, user_email, quantity, promo_applied, subtotal, discount, tax, total]
    );
    
    const booking_id = bookingResult.rows[0].id;
    const created_at = bookingResult.rows[0].created_at;
    
    await client.query(
      'UPDATE experience_slots SET booked_slots = booked_slots + $1 WHERE id = $2',
      [quantity, slot_id]
    );
    
    await client.query('COMMIT');
    
    // Send email in background
    runInBackground(async () => {
      try {
        console.log('Sending booking confirmation email in background to:', user_email);
        await emailService.sendBookingConfirmation(user_email, {
          bookingId: booking_id,
          userName: user_name,
          experienceId: experience_id,
          date: date,
          time: time,
          quantity: quantity,
          total: total,
          subtotal: subtotal,
          discount: discount,
          tax: tax,
          promoCode: promo_applied
        });
        console.log('Booking confirmation email sent to:', user_email);
      } catch (emailError) {
        console.error('Failed to send booking confirmation email:', emailError);
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Booking successful',
      booking: {
        id: booking_id,
        experience_id,
        slot_id,
        date,
        time,
        quantity,
        user_name,
        user_email,
        promo_code: promo_applied,
        pricing: {
          subtotal,
          discount,
          tax,
          total,
          currency: '₹'
        },
        created_at
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Booking error:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Booking failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
    
  } finally {
    client.release();
  }
});

export default router;