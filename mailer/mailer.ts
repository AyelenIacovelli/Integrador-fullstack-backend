import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'riasgremorygg@gmail.com',
        pass: 'hmkntblfcnnhtcpn'
    },
    from: 'riasgremorygg@gmail.com'
})

export const sendEmail = async (to: string, code: string): Promise<void> => {
    const mailOptions = {
        from: '"Grevery Store" riasgremorygg@gmail.com',
        to,
        subject: 'Código de verificación para Grevery Store',
        text: `
            Llegó tu código para Grevery.
            El código es ${code}
        `
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log("Correo electrónico enviado");

    } catch (error) {
        console.log("Error al enviar el correo electrónico:", error);
    }
}