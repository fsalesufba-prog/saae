import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class TariffController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tariffs ORDER BY category, tariff_type, consumption_range'
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
        'SELECT * FROM tariffs WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Tarifa não encontrada', 404);
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
      const { category, consumption_range, tariff_type, value, valid_from, valid_to } = req.body;

      if (!category || !consumption_range || !tariff_type || !value || !valid_from) {
        throw new AppError('Categoria, faixa, tipo, valor e data inicial são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO tariffs (category, consumption_range, tariff_type, value, valid_from, valid_to) VALUES (?, ?, ?, ?, ?, ?)',
        [category, consumption_range, tariff_type, value, valid_from, valid_to || null]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Tarifa criada com sucesso'
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
      const { category, consumption_range, tariff_type, value, valid_from, valid_to } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM tariffs WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Tarifa não encontrada', 404);
      }

      await pool.execute(
        'UPDATE tariffs SET category = ?, consumption_range = ?, tariff_type = ?, value = ?, valid_from = ?, valid_to = ? WHERE id = ?',
        [
          category || existing[0].category,
          consumption_range || existing[0].consumption_range,
          tariff_type || existing[0].tariff_type,
          value !== undefined ? value : existing[0].value,
          valid_from || existing[0].valid_from,
          valid_to !== undefined ? valid_to : existing[0].valid_to,
          id
        ]
      );

      res.json({ message: 'Tarifa atualizada com sucesso' });
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
        'SELECT * FROM tariffs WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Tarifa não encontrada', 404);
      }

      await pool.execute('DELETE FROM tariffs WHERE id = ?', [id]);

      res.json({ message: 'Tarifa removida com sucesso' });
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