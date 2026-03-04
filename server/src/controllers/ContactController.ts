import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class ContactController {
  async send(req: Request, res: Response) {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        throw new AppError('Nome, email, assunto e mensagem são obrigatórios', 400);
      }

      // Buscar configurações de email
      const [settings]: any = await pool.execute('SELECT * FROM settings');
      const config: any = {};
      settings.forEach((s: any) => {
        config[s.setting_key] = s.setting_value;
      });

      // Configurar transporter
      const transporter = nodemailer.createTransport({
        host: config.email_smtp_host,
        port: parseInt(config.email_smtp_port) || 587,
        secure: false,
        auth: {
          user: config.email_smtp_user,
          pass: config.email_smtp_pass
        }
      });

      // Enviar email
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: config.email_from || 'contato@saaelinhares.com.br',
        subject: `Contato via site: ${subject}`,
        html: `
          <h2>Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
          <p><strong>Assunto:</strong> ${subject}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });

      // Registrar no log
      await pool.execute(
        'INSERT INTO logs (action, ip_address) VALUES (?, ?)',
        ['contact_form', req.ip]
      );

      res.json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar mensagem' });
      }
    }
  }
}