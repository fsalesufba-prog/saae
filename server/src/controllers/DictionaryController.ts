import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class DictionaryController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM dictionary ORDER BY term ASC'
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
        'SELECT * FROM dictionary WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Termo não encontrado', 404);
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
      const { term, definition } = req.body;

      if (!term || !definition) {
        throw new AppError('Termo e definição são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO dictionary (term, definition) VALUES (?, ?)',
        [term, definition]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Termo criado com sucesso'
      });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Este termo já existe' });
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
      const { term, definition } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM dictionary WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Termo não encontrado', 404);
      }

      await pool.execute(
        'UPDATE dictionary SET term = ?, definition = ? WHERE id = ?',
        [term || existing[0].term, definition || existing[0].definition, id]
      );

      res.json({ message: 'Termo atualizado com sucesso' });
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Este termo já existe' });
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

      const [existing]: any = await pool.execute(
        'SELECT * FROM dictionary WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Termo não encontrado', 404);
      }

      await pool.execute('DELETE FROM dictionary WHERE id = ?', [id]);

      res.json({ message: 'Termo removido com sucesso' });
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