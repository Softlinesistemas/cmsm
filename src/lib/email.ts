import nodemailer from 'nodemailer';

/**
 * Função para enviar email de recuperação de senha
 * @param emailDestino - email do usuário
 * @param linkRecuperacao - link para redefinir senha
 */
export async function enviarEmailRecuperacao(emailDestino: string, linkRecuperacao: string) {
  // Cria o transporte SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Ex: smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // Ex: 587
    secure: false, // true para 465, false para 587
    auth: {
      user: process.env.SMTP_USER, // Email do remetente
      pass: process.env.SMTP_PASS, // Senha do remetente
    },
  });

  // Monta a mensagem do email
  const mailOptions = {
    from: `"CMSM ADM" <${process.env.SMTP_USER}>`, // Remetente
    to: emailDestino, // Destinatário
    subject: 'Recuperação de Senha',
    html: `
      <h3>Olá!</h3>
      <p>Recebemos uma solicitação para redefinir sua senha.</p>
      <p><a href="${linkRecuperacao}" target="_blank">Clique aqui para redefinir sua senha</a></p>
      <p>Se você não solicitou, ignore este email.</p>
      <p>Atenciosamente, <br> Equipe CMSM</p>
    `,
  };

  // Envia o email
  await transporter.sendMail(mailOptions);
}
