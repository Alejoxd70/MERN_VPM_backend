import nodemailer from "nodemailer";

const emailForgotPassword = async data => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const { name, email, token } = data;

    //send email
    const info = await transport.sendMail({
        from: "VPM - Veterinary Patients Manager",
        to: email,
        subject: "Change your password",
        text: "Change your password",
        html: `
            <p>Hello ${name}, the reason for this email is to change your password</p>
            <p>Please click on this link to change your password 
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Change Password</a>
            </p>

            <p>If this is not your account, just ignore this email</p>
        `
    });
}

export default emailForgotPassword;