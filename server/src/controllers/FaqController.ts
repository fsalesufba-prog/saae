import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class FaqController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM faq ORDER BY category, order_num ASC'
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
        'SELECT * FROM faq WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Pergunta não encontrada', 404);
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
      const { question, answer, category, order_num } = req.body;

      if (!question || !answer) {
        throw new AppError('Pergunta e resposta são obrigatórias', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO faq (question, answer, category, order_num) VALUES (?, ?, ?, ?)',
        [question, answer, category || 'Geral', order_num || 0]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Pergunta criada com sucesso'
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
      const { question, answer, category, order_num } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM faq WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Pergunta não encontrada', 404);
      }

      await pool.execute(
        'UPDATE faq SET question = ?, answer = ?, category = ?, order_num = ? WHERE id = ?',
        [
          question || existing[0].question,
          answer || existing[0].answer,
          category || existing[0].category,
          order_num !== undefined ? order_num : existing[0].order_num,
          id
        ]
      );

      res.json({ message: 'Pergunta atualizada com sucesso' });
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
        'SELECT * FROM faq WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Pergunta não encontrada', 404);
      }

      await pool.execute('DELETE FROM faq WHERE id = ?', [id]);

      res.json({ message: 'Pergunta removida com sucesso' });
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