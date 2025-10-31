import express from 'express';
import { sendBookingConfirmation } from '../services/emailService.js';
import { authenticateToken as verifyToken } from '../middleware/authorization.js';

const router = express.Router();

router.post('/send-booking-confirmation', verifyToken, async (req, res) => {
    try {
        const { to, bookingDetails } = req.body;
        
        if (!to || !bookingDetails) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and booking details are required' 
            });
        }

        const result = await sendBookingConfirmation(to, bookingDetails);
        
        if (result.success) {
            res.json({ 
                success: true, 
                message: 'Confirmation email sent successfully',
                messageId: result.messageId
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send email',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in send-booking-confirmation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

export default router;
