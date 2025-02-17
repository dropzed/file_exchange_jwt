import * as nodemailer from 'nodemailer';

// format and functional of letter for activation


class MailService {
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to,link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activation Mail' + process.env.APP_URL,
            text: '',
            html:
                `
                
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}"> ${link} </a>
                </div>
                
                `
        })
    }
}

export default new MailService;