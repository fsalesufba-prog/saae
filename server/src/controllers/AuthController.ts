import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email e senha são obrigatórios', 400);
      }

      const [rows]: any = await pool.execute(
        'SELECT id, name, email, password, role, permissions FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        throw new AppError('Credenciais inválidas', 401);
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new AppError('Credenciais inválidas', 401);
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'saae_linhares_jwt_secret_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Registrar log de login
      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [user.id, 'login', req.ip]
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions ? JSON.parse(user.permissions) : {}
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const [rows]: any = await pool.execute(
        'SELECT id, name, email, role, permissions, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const user = rows[0];
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions ? JSON.parse(user.permissions) : {},
        created_at: user.created_at
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      
      if (userId) {
        await pool.execute(
          'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
          [userId, 'logout', req.ip]
        );
      }

      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const [rows]: any = await pool.execute(
        'SELECT id, email, role FROM users WHERE id = ?',
        [userId]
      );

      if (rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const user = rows[0];

      const newToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'saae_linhares_jwt_secret_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({ token: newToken });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro ao renovar token:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError('Senha atual e nova senha são obrigatórias', 400);
      }

      if (newPassword.length < 6) {
        throw new AppError('A nova senha deve ter no mínimo 6 caracteres', 400);
      }

      const [rows]: any = await pool.execute(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      if (rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const validPassword = await bcrypt.compare(currentPassword, rows[0].password);

      if (!validPassword) {
        throw new AppError('Senha atual incorreta', 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [userId, 'change_password', req.ip]
      );

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('Email é obrigatório', 400);
      }

      const [rows]: any = await pool.execute(
        'SELECT id, name FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        // Por segurança, não informamos se o email existe
        return res.json({ message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha' });
      }

      const user = rows[0];
      
      // Gerar token de redefinição (válido por 1 hora)
      const resetToken = jwt.sign(
        { id: user.id, email },
        process.env.JWT_SECRET + '_reset',
        { expiresIn: '1h' }
      );

      // TODO: Enviar email com link de redefinição
      // Por enquanto apenas registramos no log
      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [user.id, 'forgot_password', req.ip]
      );

      // Em produção, enviar email aqui
      console.log(`Reset token for ${email}: ${resetToken}`);

      res.json({ message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro no forgot password:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw new AppError('Token e nova senha são obrigatórios', 400);
      }

      if (newPassword.length < 6) {
        throw new AppError('A nova senha deve ter no mínimo 6 caracteres', 400);
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET + '_reset');
      } catch (err) {
        throw new AppError('Token inválido ou expirado', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ? AND email = ?',
        [hashedPassword, decoded.id, decoded.email]
      );

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [decoded.id, 'reset_password', req.ip]
      );

      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error('Erro ao resetar senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}