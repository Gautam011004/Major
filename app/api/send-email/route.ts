import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, studentName, projectTitle, status, professorName } = await req.json();

    if (!to || !studentName || !projectTitle || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const isAccepted = status === "accepted";
    const subject = isAccepted 
      ? `Application Accepted - ${projectTitle}`
      : `Application Update - ${projectTitle}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #0a0a0a;
            color: #00ffff;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00ffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #00ffff;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
          .status-badge {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 20px 0;
            ${isAccepted 
              ? 'background-color: rgba(34, 197, 94, 0.2); color: #22c55e; border: 2px solid #22c55e;'
              : 'background-color: rgba(239, 68, 68, 0.2); color: #ef4444; border: 2px solid #ef4444;'
            }
          }
          .content {
            line-height: 1.8;
            color: #a0e7e5;
          }
          .content p {
            margin: 15px 0;
          }
          .highlight {
            color: #00ffff;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #00ffff40;
            text-align: center;
            font-size: 12px;
            color: #00ffff80;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Research Bridge</h1>
          </div>
          
          <div class="status-badge">
            Application ${isAccepted ? 'Accepted' : 'Rejected'}
          </div>
          
          <div class="content">
            <p>Dear <span class="highlight">${studentName}</span>,</p>
            
            ${isAccepted 
              ? `<p>Congratulations! We are pleased to inform you that your application for the research project <span class="highlight">"${projectTitle}"</span> has been <strong>accepted</strong>!</p>
                 <p>Professor ${professorName || 'Your assigned professor'} has reviewed your application and is excited to have you join the research team.</p>
                 <p>Next steps:</p>
                 <ul>
                   <li>Log in to your dashboard to view project details</li>
                   <li>The professor may contact you shortly with further instructions</li>
                   <li>Prepare to begin your research journey!</li>
                 </ul>`
              : `<p>Thank you for your interest in the research project <span class="highlight">"${projectTitle}"</span>.</p>
                 <p>After careful consideration, we regret to inform you that your application has not been accepted at this time.</p>
                 <p>We encourage you to:</p>
                 <ul>
                   <li>Continue exploring other research opportunities</li>
                   <li>Gain more experience and strengthen your skills</li>
                   <li>Apply to other projects that match your interests</li>
                 </ul>
                 <p>Thank you for your understanding, and we wish you the best in your academic journey.</p>`
            }
            
            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
                View Dashboard
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from Research Bridge.</p>
            <p>Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Research Bridge" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
