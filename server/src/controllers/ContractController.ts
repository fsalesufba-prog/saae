import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class ContractController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM contracts ORDER BY year DESC, created_at DESC'
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
        'SELECT * FROM contracts WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Contrato não encontrado', 404);
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
        contract_number, process_number, modality, object, 
        status, year, published_at, opening_date 
      } = req.body;
      const file = req.file;

      if (!contract_number || !process_number || !object || !published_at) {
        throw new AppError('Número do contrato, processo, objeto e data de publicação são obrigatórios', 400);
      }

      let documentPath = null;
      if (file) {
        documentPath = `/uploads/documents/${file.filename}`;
      }

      const [result]: any = await pool.execute(
        `INSERT INTO contracts (contract_number, process_number, modality, object, status, year, published_at, opening_date, document_path)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          contract_number,
          process_number,
          modality || null,
          object,
          status || null,
          year || new Date().getFullYear(),
          published_at,
          opening_date || null,
          documentPath
        ]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Contrato criado com sucesso'
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
        contract_number, process_number, modality, object, 
        status, year, published_at, opening_date 
      } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM contracts WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Contrato não encontrado', 404);
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
        `UPDATE contracts 
         SET contract_number = ?, process_number = ?, modality = ?, object = ?, 
             status = ?, year = ?, published_at = ?, opening_date = ?, document_path = ?
         WHERE id = ?`,
        [
          contract_number || existing[0].contract_number,
          process_number || existing[0].process_number,
          modality || existing[0].modality,
          object || existing[0].object,
          status || existing[0].status,
          year || existing[0].year,
          published_at || existing[0].published_at,
          opening_date || existing[0].opening_date,
          documentPath,
          id
        ]
      );

      res.json({ message: 'Contrato atualizado com sucesso' });
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
        'SELECT * FROM contracts WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Contrato não encontrado', 404);
      }

      if (existing[0].document_path) {
        const filePath = path.join(__dirname, '../../..', existing[0].document_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await pool.execute('DELETE FROM contracts WHERE id = ?', [id]);

      res.json({ message: 'Contrato removido com sucesso' });
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