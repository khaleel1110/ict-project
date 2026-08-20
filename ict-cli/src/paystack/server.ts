// server.js
import express = require('express');
import bodyParser = require('body-parser');
import nodemailer = require('nodemailer');
import cors = require('cors');
import * as https from "node:https";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aagwarzosportsarena@gmail.com',
        pass: 'fazhsblnxnfrttgh'
    }
});

function formatBookingDateTime(date: string, startHour: number, duration: number) {
    const bookingDate = new Date(date);
    const startTime = new Date(bookingDate);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + duration);

    return {
        date: bookingDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    };
}

app.post('/initialize-payment', (req, res) => {
    const { email, amount } = req.body;

    const params = JSON.stringify({
        email,
        amount: amount * 100 // Paystack expects amount in kobo
    });

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const paystackReq = https.request(options, paystackRes => {
        let data = '';
        paystackRes.on('data', chunk => data += chunk);
        paystackRes.on('end', () => {
            const response = JSON.parse(data);
            res.json(response);
        });
    });

    paystackReq.on('error', error => {
        console.error('Paystack error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    });

    paystackReq.write(params);
    paystackReq.end();
});

app.post('/send-booking-email', async (req, res) => {
    try {
        const {
            email,
            firstName,
            lastName,
            phone,
            teamA,
            teamB,
            location,
            localGovernment,
            address,
            appointmentDate,
            appointment,
            appointmentDuration,
            paymentReference,
            amount
        } = req.body;

        const { date, time } = formatBookingDateTime(appointmentDate, appointment, appointmentDuration);

        const userMailOptions = {
            from: 'aagwarzosportsarena@gmail.com',
            to: email,
            subject: `Booking Confirmation #${paymentReference}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
        }
        .header {
            background-color: #f8f9fa;
              border: 1px solid #ddd;
            color: white;
            padding: 15px 20px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
        
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
            flex: 1;
        }
        .image-logo {
            height: 100px;
            width: 85px;
            max-width: 85px;
            max-height: 100px;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .booking-details {
         
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
        }
        .detail-row {
            display: flex;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        .detail-label {
            font-weight: bold;
            width: 130px;
            min-width: 100px;
        }
        .detail-value {
            flex: 1;
        }
        .amount {
            font-size: 1.2em;
            color: #1a365d;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
        a {
            color: #8a6735;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100%;
                margin: 10px;
            }
            .header {
                padding: 10px 15px;
                justify-content: center;
                align-items: center;
            }
            .header h2 {
                font-size: 18px;
            }
            .image-logo {
                height: 70px;
                width: 100px;
                max-width: 75px;
                max-height: 100px;
                object-fit: cover;

            }
            .content {
                padding: 15px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                width: 100%;
                margin-bottom: 5px;
            }
            .detail-value {
                width: 100%;
            }
            .booking-details {
                padding: 10px;
            }
            .footer {
                font-size: 0.85em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
              
            <img class="image-logo" src="https://firebasestorage.googleapis.com/v0/b/cbt-sass.firebasestorage.app/o/my-logo.png?alt=media&token=835579ff-31ba-445a-a1b7-5045438cb8d1" alt="Aagwarzo Sports Arena Logo" style="max-width: 100%;">
        </div>
    
        <div class="content">
              <h2 style="text-align: center;">Booking Confirmation</h2>
            <p style="margin: 0 0 15px;">Dear ${firstName} ${lastName},</p>
            <p style="margin: 0 0 15px;">Thank you for choosing our service. We are pleased to confirm your booking. Below are the details:</p>
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-label">Booking ID:</div>
                    <div class="detail-value">${paymentReference}</div>
                </div>
             
                <div class="detail-row">
                    <div class="detail-label">Time:</div>
                    <div class="detail-value">${appointment}</div>
                </div>
         
                <div class="detail-row">
                    <div class="detail-label">Address:</div>
                    <div class="detail-value">${address}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Teams:</div>
                    <div class="detail-value">${teamA} vs ${teamB}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Amount Paid:</div>
                    <div class="detail-value amount">₦ ${amount} </div>
                </div>
            </div>
            <p style="margin: 0 0 15px;">
                If you have any questions or would like to make changes to your booking, please contact us at 
                <a href="mailto:aagwarzosportsarena@gmail.com" style="color: #8a6735;">aagwarzosportsarena@gmail.com</a> or +234 903 366 4969.
            </p>
            <div class="footer">
                <p style="margin: 0;">Best regards,<br><strong>The Booking Team</strong></p>
            </div>
        </div>
    </div>
</body>
</html>`
        };

        const adminMailOptions = {
            from: 'aagwarzosportsarena@gmail.com',
            to: 'aagwarzosportsarena@gmail.com',
            subject: `New Booking: ${firstName} ${lastName} - ${date}`,
            text: `
New booking received:

Customer: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Booking Details:
Date: ${date}
Time: ${time}
Duration: ${appointmentDuration} hours
Teams: ${teamA} vs ${teamB}

Payment:
Amount: ${amount} NGN
Reference: ${paymentReference}
            `
        };

        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        res.status(200).json({ message: 'Booking confirmation emails sent successfully' });
    } catch (error) {
        console.error('Error sending booking emails:', error);
        res.status(500).json({ error: 'Failed to send booking confirmation emails' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
