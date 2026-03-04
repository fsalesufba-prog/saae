import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

export class NewsController {
  async list(req: Request, res: Response) {
    try {
      const { limit, published } = req.query;
      let query = 'SELECT * FROM news ORDER BY publish_date DESC';
      const params = [];

      if (published === 'true') {
        query = 'SELECT * FROM news WHERE published = true ORDER BY publish_date DESC';
      }

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

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT * FROM news WHERE slug = ?',
        [slug]
      );

      if (rows.length === 0) {
        throw new AppError('Notícia não encontrada', 404);
      }

      // Incrementar visualizações
      await pool.execute(
        'UPDATE news SET views = views + 1 WHERE id = ?',
        [rows[0].id]
      );

      res.json(rows[0]);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT * FROM news WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Notícia não encontrada', 404);
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
      const { title, summary, content, author, published, publish_date } = req.body;
      const file = req.file;

      if (!title || !summary || !content || !author) {
        throw new AppError('Título, resumo, conteúdo e autor são obrigatórios', 400);
      }

      const slug = slugify(title, { lower: true, strict: true });
      
      // Verificar se slug já existe
      const [existing]: any = await pool.execute(
        'SELECT id FROM news WHERE slug = ?',
        [slug]
      );

      if (existing.length > 0) {
        throw new AppError('Já existe uma notícia com este título', 400);
      }

      let imagePath = null;
      if (file) {
        imagePath = `/uploads/news/${file.filename}`;
      }

      const [result]: any = await pool.execute(
        `INSERT INTO news (title, slug, summary, content, image_path, author, published, publish_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          slug,
          summary,
          content,
          imagePath,
          author,
          published === 'true',
          publish_date || new Date(),
          (req as any).user.id
        ]
      );

      res.status(201).json({
        id: result.insertId,
        slug,
        message: 'Notícia criada com sucesso'
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
      const { title, summary, content, author, published, publish_date } = req.body;
      const file = req.file;

      const [existing]: any = await pool.execute(
        'SELECT * FROM news WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Notícia não encontrada', 404);
      }

      let slug = existing[0].slug;
      if (title && title !== existing[0].title) {
        slug = slugify(title, { lower: true, strict: true });
        
        // Verificar se novo slug já existe
        const [slugCheck]: any = await pool.execute(
          'SELECT id FROM news WHERE slug = ? AND id != ?',
          [slug, id]
        );

        if (slugCheck.length > 0) {
          throw new AppError('Já existe uma notícia com este título', 400);
        }
      }

      let imagePath = existing[0].image_path;
      
      if (file) {
        if (existing[0].image_path) {
          const oldPath = path.join(__dirname, '../../..', existing[0].image_path);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        imagePath = `/uploads/news/${file.filename}`;
      }

      await pool.execute(
        `UPDATE news 
         SET title = ?, slug = ?, summary = ?, content = ?, image_path = ?, 
             author = ?, published = ?, publish_date = ?
         WHERE id = ?`,
        [
          title || existing[0].title,
          slug,
          summary || existing[0].summary,
          content || existing[0].content,
          imagePath,
          author || existing[0].author,
          published === 'true',
          publish_date || existing[0].publish_date,
          id
        ]
      );

      res.json({ message: 'Notícia atualizada com sucesso' });
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
        'SELECT * FROM news WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Notícia não encontrada', 404);
      }

      if (existing[0].image_path) {
        const imagePath = path.join(__dirname, '../../..', existing[0].image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await pool.execute('DELETE FROM news WHERE id = ?', [id]);

      res.json({ message: 'Notícia removida com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async togglePublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { published } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM news WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Notícia não encontrada', 404);
      }

      await pool.execute(
        'UPDATE news SET published = ? WHERE id = ?',
        [published, id]
      );

      res.json({ message: 'Status atualizado com sucesso' });
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