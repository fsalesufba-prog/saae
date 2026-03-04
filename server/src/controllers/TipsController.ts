import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class TipsController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM consumption_tips ORDER BY order_num ASC'
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
        'SELECT * FROM consumption_tips WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Dica não encontrada', 404);
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
      const { title, tip, icon, order_num } = req.body;

      if (!title || !tip) {
        throw new AppError('Título e dica são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO consumption_tips (title, tip, icon, order_num) VALUES (?, ?, ?, ?)',
        [title, tip, icon || null, order_num || 0]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Dica criada com sucesso'
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
      const { title, tip, icon, order_num } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM consumption_tips WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Dica não encontrada', 404);
      }

      await pool.execute(
        'UPDATE consumption_tips SET title = ?, tip = ?, icon = ?, order_num = ? WHERE id = ?',
        [
          title || existing[0].title,
          tip || existing[0].tip,
          icon !== undefined ? icon : existing[0].icon,
          order_num !== undefined ? order_num : existing[0].order_num,
          id
        ]
      );

      res.json({ message: 'Dica atualizada com sucesso' });
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
        'SELECT * FROM consumption_tips WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Dica não encontrada', 404);
      }

      await pool.execute('DELETE FROM consumption_tips WHERE id = ?', [id]);

      res.json({ message: 'Dica removida com sucesso' });
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