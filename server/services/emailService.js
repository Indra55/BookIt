import nodemailer from 'nodemailer';

let transporterPromise = null;

const getTransporter = async () => {
    if (!transporterPromise) {
        transporterPromise = (async () => {
            const transporterConfig = {
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            };
            
            console.log('Creating transporter with config:', {
                host: transporterConfig.host,
                port: transporterConfig.port,
                secure: transporterConfig.secure,
                authUser: transporterConfig.auth.user
            });

            const transporter = nodemailer.createTransport(transporterConfig);

            await new Promise((resolve, reject) => {
                transporter.verify((error, success) => {
                    if (error) {
                        console.error('SMTP Connection Error:', error);
                        reject(error);
                    } else {
                        console.log('Server is ready to take our messages');
                        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
                            console.log('Test Email URL: https://ethereal.email/login');
                            console.log('Username:', transporter.options.auth.user);
                            console.log('Password:', transporter.options.auth.pass);
                        }
                        resolve(success);
                    }
                });
            });

            return transporter;
        })();
    }

    return transporterPromise;
};
const SENDER_EMAIL = 'galahitanshu@gmail.com'; 

const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

export const sendBookingConfirmation = async (to, bookingDetails) => {
    try {
        console.log('Sending email to:', to);
        const transporter = await getTransporter();
        
        const bookingDate = bookingDetails.date ? new Date(bookingDetails.date) : null;
        const formattedDate = bookingDate ? bookingDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Not specified';
        
        const info = await transporter.sendMail({
            from: `"Highway Delite" <${SENDER_EMAIL}>`,
            to: to,
            subject: 'Your Booking Confirmation - Highway Delite',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                    <div style="background: #4a6baf; padding: 20px; border-radius: 5px 5px 0 0; color: white; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Booking Confirmed! 🎉</h1>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Hello <strong>${bookingDetails.userName || 'Valued Customer'}</strong>,</p>
                        <p>Thank you for booking with Highway Delite! We're excited to be part of your journey. Here are your booking details:</p>
                        
                        <div style="background: #f8f9fa; border-left: 4px solid #4a6baf; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                            <h3 style="margin-top: 0; color: #2c3e50;">Booking #${bookingDetails.bookingId || ''}</h3>
                            <p><strong>Booking Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                            <p><strong>Experience Date:</strong> ${formattedDate}</p>
                            <p><strong>Time:</strong> ${bookingDetails.time || 'Not specified'}</p>
                            <p><strong>Number of Persons:</strong> ${bookingDetails.quantity || 1}</p>
                            ${bookingDetails.experienceId ? `<p><strong>Experience ID:</strong> ${bookingDetails.experienceId}</p>` : ''}
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">Payment Summary</h4>
                            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                                <span>Subtotal:</span>
                                <span>${formatCurrency(bookingDetails.subtotal)}</span>
                            </div>
                            ${bookingDetails.discount ? `
                            <div style="display: flex; justify-content: space-between; margin: 10px 0; color: #27ae60;">
                                <span>Discount${bookingDetails.promoCode ? ` (${bookingDetails.promoCode})` : ''}:</span>
                                <span>-${formatCurrency(bookingDetails.discount)}</span>
                            </div>` : ''}
                            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                                <span>Tax (5.9%):</span>
                                <span>${formatCurrency(bookingDetails.tax)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 15px 0 5px; font-size: 1.1em; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px;">
                                <span>Total Amount:</span>
                                <span>${formatCurrency(bookingDetails.total)}</span>
                            </div>
                        </div>
                        
                        <div style="margin: 25px 0; text-align: center;">
                            <a href="#" style="background: #4a6baf; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Your Booking</a>
                        </div>
                        
                        <p>If you have any questions about your booking, please don't hesitate to contact our support team.</p>
                        
                        <p>We look forward to serving you!<br>
                        <strong>The Highway Delite Team</strong></p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #7f8c8d;">
                            <p>This is an automated message, please do not reply directly to this email.</p>
                        </div>
                    </div>
                </div>
            `,
        });

        console.log('Message sent: %s', info.messageId);
        
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        return { 
            success: true, 
            messageId: info.messageId,
            previewUrl: process.env.EMAIL_HOST === 'smtp.ethereal.email' 
                ? nodemailer.getTestMessageUrl(info) 
                : null
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return { 
            success: false, 
            error: error.message,
            details: error
        };
    }
};

export default {
    sendBookingConfirmation,
};