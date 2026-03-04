import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class CipaController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM cipa ORDER BY order_num ASC'
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
        'SELECT * FROM cipa WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Seção não encontrada', 404);
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

  async getBySection(req: Request, res: Response) {
    try {
      const { section } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT * FROM cipa WHERE section = ?',
        [section]
      );

      if (rows.length === 0) {
        throw new AppError('Seção não encontrada', 404);
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
      const { section, title, content, order_num } = req.body;

      if (!section || !title || !content) {
        throw new AppError('Seção, título e conteúdo são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO cipa (section, title, content, order_num) VALUES (?, ?, ?, ?)',
        [section, title, content, order_num || 0]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Seção criada com sucesso'
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
      const { section, title, content, order_num } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM cipa WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Seção não encontrada', 404);
      }

      await pool.execute(
        'UPDATE cipa SET section = ?, title = ?, content = ?, order_num = ? WHERE id = ?',
        [
          section || existing[0].section,
          title || existing[0].title,
          content || existing[0].content,
          order_num !== undefined ? order_num : existing[0].order_num,
          id
        ]
      );

      res.json({ message: 'Seção atualizada com sucesso' });
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
        'SELECT * FROM cipa WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Seção não encontrada', 404);
      }

      await pool.execute('DELETE FROM cipa WHERE id = ?', [id]);

      res.json({ message: 'Seção removida com sucesso' });
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