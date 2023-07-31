import nodemailer from "nodemailer";

const emailRegister = async data  => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    //send email
    const info = await transport.sendMail({
        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>',
        to: email,
        subject: "Comfirm your APV account",
        text: "Comfirm your APV account",
        html: `
            <p>Hello ${name}, confirm your APV account</p>
            <p>Your account is almost ready, just click on this link: 
                <a href="${process.env.FRONTEND_URL}/validate-account/${token}">Confirm account</a>
            </p>

            <p>If this is not your account, just ignore this email</p>
        `
    });

}


export default emailRegister;