import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class UserController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, permissions, created_at FROM users ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT id, name, email, role, permissions, created_at FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      res.json(rows[0]);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role, permissions } = req.body;

      if (!name || !email || !password) {
        throw new AppError('Nome, email e senha são obrigatórios', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result]: any = await pool.execute(
        'INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'viewer', JSON.stringify(permissions || {})]
      );

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [(req as any).user.id, 'create_user', req.ip]
      );

      res.status(201).json({ 
        id: result.insertId, 
        name, 
        email, 
        role,
        message: 'Usuário criado com sucesso' 
      });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, role, permissions, password } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      let query = 'UPDATE users SET name = ?, email = ?, role = ?, permissions = ?';
      const params: any[] = [name, email, role, JSON.stringify(permissions || {})];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
      }

      query += ' WHERE id = ?';
      params.push(id);

      await pool.execute(query, params);

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [(req as any).user.id, 'update_user', req.ip]
      );

      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (parseInt(id) === (req as any).user.id) {
        throw new AppError('Não é possível excluir o próprio usuário', 400);
      }

      const [existing]: any = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Usuário não encontrado', 404);
      }

      await pool.execute('DELETE FROM users WHERE id = ?', [id]);

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [(req as any).user.id, 'delete_user', req.ip]
      );

      res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }
}