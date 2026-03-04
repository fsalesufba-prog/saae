import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class PhoneController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM useful_phones ORDER BY department ASC'
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
        'SELECT * FROM useful_phones WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Telefone não encontrado', 404);
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
      const { department, phone, email, description } = req.body;

      if (!department || !phone) {
        throw new AppError('Departamento e telefone são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO useful_phones (department, phone, email, description) VALUES (?, ?, ?, ?)',
        [department, phone, email || null, description || null]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Telefone criado com sucesso'
      });
    } catch (error) {
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
      const { department, phone, email, description } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM useful_phones WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Telefone não encontrado', 404);
      }

      await pool.execute(
        'UPDATE useful_phones SET department = ?, phone = ?, email = ?, description = ? WHERE id = ?',
        [
          department || existing[0].department,
          phone || existing[0].phone,
          email !== undefined ? email : existing[0].email,
          description !== undefined ? description : existing[0].description,
          id
        ]
      );

      res.json({ message: 'Telefone atualizado com sucesso' });
    } catch (error) {
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

      const [existing]: any = await pool.execute(
        'SELECT * FROM useful_phones WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Telefone não encontrado', 404);
      }

      await pool.execute('DELETE FROM useful_phones WHERE id = ?', [id]);

      res.json({ message: 'Telefone removido com sucesso' });
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