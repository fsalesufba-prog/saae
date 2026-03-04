import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class GalleryController {
  async list(req: Request, res: Response) {
    try {
      const { type } = req.query;
      let query = 'SELECT * FROM galleries ORDER BY created_at DESC';
      const params = [];

      if (type) {
        query = 'SELECT * FROM galleries WHERE type = ? ORDER BY created_at DESC';
        params.push(type);
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
        'SELECT * FROM galleries WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Galeria não encontrada', 404);
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
      const { name, description, type } = req.body;
      const file = req.file;

      if (!name || !type) {
        throw new AppError('Nome e tipo são obrigatórios', 400);
      }

      let coverPath = null;
      if (file) {
        coverPath = `/uploads/galleries/${file.filename}`;
      }

      const [result]: any = await pool.execute(
        `INSERT INTO galleries (name, description, type, cover_image, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description || null, type, coverPath, (req as any).user.id]
      );

      res.status(201).json({
        id: result.insertId,
        message: 'Galeria criada com sucesso'
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
      const { name, description, type } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM galleries WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Galeria não encontrada', 404);
      }

      let coverPath = existing[0].cover_image;
      
      if (file) {
        if (existing[0].cover_image) {
          const oldPath = path.join(__dirname, '../../..', existing[0].cover_image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        coverPath = `/uploads/galleries/${file.filename}`;
      }

      await pool.execute(
        `UPDATE galleries 
         SET name = ?, description = ?, type = ?, cover_image = ?
         WHERE id = ?`,
        [name, description || null, type, coverPath, id]
      );

      res.json({ message: 'Galeria atualizada com sucesso' });
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

      const [media]: any = await pool.execute(
        'SELECT * FROM media WHERE gallery_id = ?',
        [id]
      );

      // Remover arquivos de mídia
      for (const item of media) {
        const filePath = path.join(__dirname, '../../..', item.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        if (item.thumbnail_path) {
          const thumbPath = path.join(__dirname, '../../..', item.thumbnail_path);
          if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
          }
        }
      }

      const [gallery]: any = await pool.execute(
        'SELECT * FROM galleries WHERE id = ?',
        [id]
      );

      if (gallery[0]?.cover_image) {
        const coverPath = path.join(__dirname, '../../..', gallery[0].cover_image);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }

      await pool.execute('DELETE FROM galleries WHERE id = ?', [id]);

      res.json({ message: 'Galeria removida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getMedia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows] = await pool.execute(
        'SELECT * FROM media WHERE gallery_id = ? ORDER BY order_num ASC',
        [id]
      );
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async addMedia(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new AppError('Nenhum arquivo enviado', 400);
      }

      const [gallery]: any = await pool.execute(
        'SELECT * FROM galleries WHERE id = ?',
        [id]
      );

      if (gallery.length === 0) {
        throw new AppError('Galeria não encontrada', 404);
      }

      // Obter a maior ordem atual
      const [orderResult]: any = await pool.execute(
        'SELECT MAX(order_num) as maxOrder FROM media WHERE gallery_id = ?',
        [id]
      );
      let nextOrder = (orderResult[0].maxOrder || 0) + 1;

      for (const file of files) {
        const isVideo = file.mimetype.startsWith('video/');
        const filePath = `/uploads/galleries/${file.filename}`;
        
        await pool.execute(
          `INSERT INTO media (gallery_id, file_path, type, order_num)
           VALUES (?, ?, ?, ?)`,
          [id, filePath, isVideo ? 'video' : 'image', nextOrder++]
        );
      }

      res.status(201).json({
        message: `${files.length} arquivo(s) adicionado(s) com sucesso`
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

  async updateMedia(req: Request, res: Response) {
    try {
      const { id, mediaId } = req.params;
      const { title, description } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM media WHERE id = ? AND gallery_id = ?',
        [mediaId, id]
      );

      if (existing.length === 0) {
        throw new AppError('Mídia não encontrada', 404);
      }

      await pool.execute(
        'UPDATE media SET title = ?, description = ? WHERE id = ?',
        [title || null, description || null, mediaId]
      );

      res.json({ message: 'Mídia atualizada com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async deleteMedia(req: Request, res: Response) {
    try {
      const { id, mediaId } = req.params;

      const [media]: any = await pool.execute(
        'SELECT * FROM media WHERE id = ? AND gallery_id = ?',
        [mediaId, id]
      );

      if (media.length === 0) {
        throw new AppError('Mídia não encontrada', 404);
      }

      // Remover arquivo
      const filePath = path.join(__dirname, '../../..', media[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await pool.execute('DELETE FROM media WHERE id = ?', [mediaId]);

      // Reordenar itens restantes
      await pool.execute(
        'UPDATE media SET order_num = order_num - 1 WHERE gallery_id = ? AND order_num > ?',
        [id, media[0].order_num]
      );

      res.json({ message: 'Mídia removida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async moveMedia(req: Request, res: Response) {
    try {
      const { id, mediaId, direction } = req.params;

      const [current]: any = await pool.execute(
        'SELECT * FROM media WHERE id = ? AND gallery_id = ?',
        [mediaId, id]
      );

      if (current.length === 0) {
        throw new AppError('Mídia não encontrada', 404);
      }

      if (direction === 'up') {
        if (current[0].order_num === 0) {
          throw new AppError('Item já está no topo', 400);
        }

        const [previous]: any = await pool.execute(
          'SELECT * FROM media WHERE gallery_id = ? AND order_num = ?',
          [id, current[0].order_num - 1]
        );

        await pool.execute(
          'UPDATE media SET order_num = ? WHERE id = ?',
          [current[0].order_num - 1, mediaId]
        );

        await pool.execute(
          'UPDATE media SET order_num = ? WHERE id = ?',
          [current[0].order_num, previous[0].id]
        );
      } else if (direction === 'down') {
        const [maxOrder]: any = await pool.execute(
          'SELECT MAX(order_num) as maxOrder FROM media WHERE gallery_id = ?',
          [id]
        );

        if (current[0].order_num === maxOrder[0].maxOrder) {
          throw new AppError('Item já está no final', 400);
        }

        const [next]: any = await pool.execute(
          'SELECT * FROM media WHERE gallery_id = ? AND order_num = ?',
          [id, current[0].order_num + 1]
        );

        await pool.execute(
          'UPDATE media SET order_num = ? WHERE id = ?',
          [current[0].order_num + 1, mediaId]
        );

        await pool.execute(
          'UPDATE media SET order_num = ? WHERE id = ?',
          [current[0].order_num, next[0].id]
        );
      }

      res.json({ message: 'Mídia movida com sucesso' });
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