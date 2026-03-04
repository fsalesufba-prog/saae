import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class CarouselController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM carousel ORDER BY order_position ASC'
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listActive(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM carousel WHERE active = true ORDER BY order_position ASC'
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
        'SELECT * FROM carousel WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Item não encontrado', 404);
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
      const { title, subtitle, link_url, active } = req.body;
      const file = req.file;

      if (!file) {
        throw new AppError('Imagem é obrigatória', 400);
      }

      const [orderResult]: any = await pool.execute(
        'SELECT MAX(order_position) as maxOrder FROM carousel'
      );
      const nextOrder = (orderResult[0].maxOrder || 0) + 1;

      const imagePath = `/uploads/carousel/${file.filename}`;

      const [result]: any = await pool.execute(
        `INSERT INTO carousel (title, subtitle, image_path, link_url, order_position, active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title || null, subtitle || null, imagePath, link_url || null, nextOrder, active === 'true']
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Item criado com sucesso'
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
      const { title, subtitle, link_url, active } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM carousel WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Item não encontrado', 404);
      }

      let imagePath = existing[0].image_path;
      
      if (file) {
        const oldPath = path.join(__dirname, '../../..', existing[0].image_path);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
        imagePath = `/uploads/carousel/${file.filename}`;
      }

      await pool.execute(
        `UPDATE carousel 
         SET title = ?, subtitle = ?, image_path = ?, link_url = ?, active = ?
         WHERE id = ?`,
        [
          title || null,
          subtitle || null,
          imagePath,
          link_url || null,
          active === 'true',
          id
        ]
      );

      res.json({ message: 'Item atualizado com sucesso' });
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
        'SELECT * FROM carousel WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Item não encontrado', 404);
      }

      const imagePath = path.join(__dirname, '../../..', existing[0].image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      await pool.execute('DELETE FROM carousel WHERE id = ?', [id]);

      await pool.execute(
        'UPDATE carousel SET order_position = order_position - 1 WHERE order_position > ?',
        [existing[0].order_position]
      );

      res.json({ message: 'Item removido com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async moveUp(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [current]: any = await pool.execute(
        'SELECT * FROM carousel WHERE id = ?',
        [id]
      );

      if (current.length === 0) {
        throw new AppError('Item não encontrado', 404);
      }

      if (current[0].order_position === 1) {
        throw new AppError('Item já está no topo', 400);
      }

      const [previous]: any = await pool.execute(
        'SELECT * FROM carousel WHERE order_position = ?',
        [current[0].order_position - 1]
      );

      await pool.execute(
        'UPDATE carousel SET order_position = ? WHERE id = ?',
        [current[0].order_position - 1, id]
      );

      await pool.execute(
        'UPDATE carousel SET order_position = ? WHERE id = ?',
        [current[0].order_position, previous[0].id]
      );

      res.json({ message: 'Item movido para cima' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async moveDown(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [current]: any = await pool.execute(
        'SELECT * FROM carousel WHERE id = ?',
        [id]
      );

      if (current.length === 0) {
        throw new AppError('Item não encontrado', 404);
      }

      const [maxOrder]: any = await pool.execute(
        'SELECT MAX(order_position) as maxOrder FROM carousel'
      );

      if (current[0].order_position === maxOrder[0].maxOrder) {
        throw new AppError('Item já está no final', 400);
      }

      const [next]: any = await pool.execute(
        'SELECT * FROM carousel WHERE order_position = ?',
        [current[0].order_position + 1]
      );

      await pool.execute(
        'UPDATE carousel SET order_position = ? WHERE id = ?',
        [current[0].order_position + 1, id]
      );

      await pool.execute(
        'UPDATE carousel SET order_position = ? WHERE id = ?',
        [current[0].order_position, next[0].id]
      );

      res.json({ message: 'Item movido para baixo' });
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
