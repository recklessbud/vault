//nodemailer configure

import nodemailer from 'nodemailer';

export const sendEEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
  service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
        auth: {
            user: process.env.EMAIL_STRING,
            pass: process.env.EMAIL_SECRET
        }
    })
   const mailOptions = {
    from: process.env.EMAIL_STRING,	
    to, 
    subject,   
    text
   }

   try {
       const result = await transporter.sendMail(mailOptions)
       console.log("Email sent" + result)
   } catch (error) {
       console.log("Email not sent" +" "+ error)
   }

}