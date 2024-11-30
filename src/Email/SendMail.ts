import nodemailer from 'nodemailer'
import pug from 'pug'



interface WelcomeEmailP { Receiver: string, Subject: string, UserName: string }
interface LoginEmailP { Receiver: string, Subject: string, UserName: string,Message: string}
interface CustomEmailP { Receiver: string, Subject: string, UserName: string,Message: string}
interface EmailActivationEmailP { Receiver: string, Subject: string, UserName: string,Code: number}

export class EmailSender {
    private readonly config = {
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    }
    private readonly transporter = nodemailer.createTransport(this.config)
    
       
   async WelcomeEmail({ Receiver, Subject, UserName }: WelcomeEmailP ) {
        try {
            const html = pug.renderFile('src/Email/Pug/Welcome.pug', { UserName })
            const Mail = {
                from: `"Shoplet 🛒" <${process.env.NODEMAILER_USERNAME}>`, // sender address
                to: Receiver, // list of receivers
                subject: Subject, // Subject line
                html, // html body
            }
            const info = await this.transporter.sendMail(Mail);
            console.log("Message sent: %s", info.messageId);
        } catch (err) { 
            console.log(err, 'error sending email')
        }
    }

    async LoginEmail({Receiver,Subject,UserName,Message }: LoginEmailP) {
        try {
            
            const html = pug.renderFile('src/Email/Pug/Login.pug', { UserName,Message })
            const Mail = {
                from: `"Shoplet 🛒" <${process.env.NODEMAILER_USERNAME}>`, // sender address
                to: Receiver, // list of receivers
                subject: Subject, // Subject line
                html, // html body
            }
            const info = await this.transporter.sendMail(Mail);
            console.log("Message sent: %s", info.messageId);

        } catch (err) {
            console.log(err, 'error sending email')
        }
    }

    async ActivationEmail({ Receiver, Subject, UserName, Code }: EmailActivationEmailP) {
        try {
            
            const html = pug.renderFile('src/Email/Pug/ConfirmEmail.pug', { UserName,Code })
            const Mail = {
                from: `"Shoplet 🛒" <${process.env.NODEMAILER_USERNAME}>`, // sender address
                to: Receiver, // list of receivers
                subject: Subject, // Subject line
                html, // html body
            }
            const info = await this.transporter.sendMail(Mail);
            console.log("Message sent: %s", info.messageId);
        } catch (err) {
            console.log(err, 'error sending email')
        }
    }
    async CustomEmail({ Receiver, Subject, UserName, Message }: CustomEmailP) {
        try {
            const html = pug.renderFile('src/Email/Pug/General.pug', { UserName,Message })
            const Mail = {
                from: `"Shoplet 🛒" <${process.env.NODEMAILER_USERNAME}>`, // sender address
                to: Receiver, // list of receivers
                subject: Subject, // Subject line
                html, // html body
            }
            const info = await this.transporter.sendMail(Mail);
            console.log("Message sent: %s", info.messageId);
        } catch (err) {
            console.log(err, 'error sending email')
        }
    }
}