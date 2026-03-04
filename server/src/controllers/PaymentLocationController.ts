import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class PaymentLocationController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM payment_locations ORDER BY name ASC'
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
        'SELECT * FROM payment_locations WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Local não encontrado', 404);
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
      const { name, address, city, state, phone, opening_hours } = req.body;

      if (!name || !address) {
        throw new AppError('Nome e endereço são obrigatórios', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO payment_locations (name, address, city, state, phone, opening_hours) VALUES (?, ?, ?, ?, ?, ?)',
        [name, address, city || 'Linhares', state || 'ES', phone || null, opening_hours || null]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Local criado com sucesso'
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
      const { name, address, city, state, phone, opening_hours } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM payment_locations WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Local não encontrado', 404);
      }

      await pool.execute(
        'UPDATE payment_locations SET name = ?, address = ?, city = ?, state = ?, phone = ?, opening_hours = ? WHERE id = ?',
        [
          name || existing[0].name,
          address || existing[0].address,
          city || existing[0].city,
          state || existing[0].state,
          phone !== undefined ? phone : existing[0].phone,
          opening_hours !== undefined ? opening_hours : existing[0].opening_hours,
          id
        ]
      );

      res.json({ message: 'Local atualizado com sucesso' });
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
        'SELECT * FROM payment_locations WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Local não encontrado', 404);
      }

      await pool.execute('DELETE FROM payment_locations WHERE id = ?', [id]);

      res.json({ message: 'Local removido com sucesso' });
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