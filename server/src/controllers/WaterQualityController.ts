import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class WaterQualityController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM water_quality ORDER BY report_date DESC'
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
        'SELECT * FROM water_quality WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Relatório não encontrado', 404);
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
      const { report_name, report_date } = req.body;
      const file = req.file;

      if (!report_name || !report_date || !file) {
        throw new AppError('Nome, data e arquivo são obrigatórios', 400);
      }

      const filePath = `/uploads/documents/${file.filename}`;

      const [result]: any = await pool.execute(
        'INSERT INTO water_quality (report_name, report_file, report_date) VALUES (?, ?, ?)',
        [report_name, filePath, report_date]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Relatório criado com sucesso'
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
      const { report_name, report_date } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM water_quality WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Relatório não encontrado', 404);
      }

      let filePath = existing[0].report_file;
      
      if (file) {
        if (existing[0].report_file) {
          const oldPath = path.join(__dirname, '../../..', existing[0].report_file);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        filePath = `/uploads/documents/${file.filename}`;
      }

      await pool.execute(
        'UPDATE water_quality SET report_name = ?, report_file = ?, report_date = ? WHERE id = ?',
        [
          report_name || existing[0].report_name,
          filePath,
          report_date || existing[0].report_date,
          id
        ]
      );

      res.json({ message: 'Relatório atualizado com sucesso' });
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
        'SELECT * FROM water_quality WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Relatório não encontrado', 404);
      }

      if (existing[0].report_file) {
        const filePath = path.join(__dirname, '../../..', existing[0].report_file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await pool.execute('DELETE FROM water_quality WHERE id = ?', [id]);

      res.json({ message: 'Relatório removido com sucesso' });
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