import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class BidController {
  async list(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      let query = 'SELECT * FROM bids ORDER BY publish_date DESC';
      const params = [];

      if (limit) {
        query += ' LIMIT ?';
        params.push(parseInt(limit as string));
      }

      const [rows] = await pool.execute(query, params);
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
        'SELECT * FROM bids WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Licitação não encontrada', 404);
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
      const { 
        process_number, modality, object, status, 
        publish_date, opening_date, year 
      } = req.body;
      const file = req.file;

      if (!process_number || !modality || !object || !publish_date || !opening_date) {
        throw new AppError('Todos os campos obrigatórios devem ser preenchidos', 400);
      }

      let documentPath = null;
      if (file) {
        documentPath = `/uploads/documents/${file.filename}`;
      }

      const [result]: any = await pool.execute(
        `INSERT INTO bids (process_number, modality, object, status, publish_date, opening_date, year, document_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          process_number,
          modality,
          object,
          status || 'andamento',
          publish_date,
          opening_date,
          year || new Date().getFullYear(),
          documentPath
        ]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Licitação criada com sucesso'
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
      const { 
        process_number, modality, object, status, 
        publish_date, opening_date, year 
      } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM bids WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Licitação não encontrada', 404);
      }

      let documentPath = existing[0].document_path;
      
      if (file) {
        if (existing[0].document_path) {
          const oldPath = path.join(__dirname, '../../..', existing[0].document_path);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        documentPath = `/uploads/documents/${file.filename}`;
      }

      await pool.execute(
        `UPDATE bids 
         SET process_number = ?, modality = ?, object = ?, status = ?, 
             publish_date = ?, opening_date = ?, year = ?, document_path = ?
         WHERE id = ?`,
        [
          process_number || existing[0].process_number,
          modality || existing[0].modality,
          object || existing[0].object,
          status || existing[0].status,
          publish_date || existing[0].publish_date,
          opening_date || existing[0].opening_date,
          year || existing[0].year,
          documentPath,
          id
        ]
      );

      res.json({ message: 'Licitação atualizada com sucesso' });
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
        'SELECT * FROM bids WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Licitação não encontrada', 404);
      }

      if (existing[0].document_path) {
        const filePath = path.join(__dirname, '../../..', existing[0].document_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await pool.execute('DELETE FROM bids WHERE id = ?', [id]);

      res.json({ message: 'Licitação removida com sucesso' });
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