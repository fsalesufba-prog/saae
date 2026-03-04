import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import slugify from 'slugify';

export class PageController {
  async list(req: Request, res: Response) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, title, slug, published, updated_at FROM pages ORDER BY title ASC'
      );
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
        'SELECT * FROM pages WHERE slug = ? AND published = true',
        [slug]
      );

      if (rows.length === 0) {
        throw new AppError('Página não encontrada', 404);
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT * FROM pages WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Página não encontrada', 404);
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
      const { title, slug, content, meta_description, published } = req.body;

      if (!title || !content) {
        throw new AppError('Título e conteúdo são obrigatórios', 400);
      }

      const pageSlug = slug || slugify(title, { lower: true, strict: true });

      // Verificar se slug já existe
      const [existing]: any = await pool.execute(
        'SELECT id FROM pages WHERE slug = ?',
        [pageSlug]
      );

      if (existing.length > 0) {
        throw new AppError('Já existe uma página com esta URL', 400);
      }

      const [result]: any = await pool.execute(
        'INSERT INTO pages (title, slug, content, meta_description, published) VALUES (?, ?, ?, ?, ?)',
        [title, pageSlug, content, meta_description || null, published === 'true']
      );

      res.status(201).json({
        id: result.insertId,
        slug: pageSlug,
        message: 'Página criada com sucesso'
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
      const { title, slug, content, meta_description, published } = req.body;

      const [existing]: any = await pool.execute(
        'SELECT * FROM pages WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Página não encontrada', 404);
      }

      let pageSlug = slug;
      if (title && !slug) {
        pageSlug = slugify(title, { lower: true, strict: true });
      }

      if (pageSlug && pageSlug !== existing[0].slug) {
        const [slugCheck]: any = await pool.execute(
          'SELECT id FROM pages WHERE slug = ? AND id != ?',
          [pageSlug, id]
        );

        if (slugCheck.length > 0) {
          throw new AppError('Já existe uma página com esta URL', 400);
        }
      }

      await pool.execute(
        `UPDATE pages 
         SET title = ?, slug = ?, content = ?, meta_description = ?, published = ?
         WHERE id = ?`,
        [
          title || existing[0].title,
          pageSlug || existing[0].slug,
          content || existing[0].content,
          meta_description !== undefined ? meta_description : existing[0].meta_description,
          published !== undefined ? published === 'true' : existing[0].published,
          id
        ]
      );

      res.json({ message: 'Página atualizada com sucesso' });
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
        'SELECT * FROM pages WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Página não encontrada', 404);
      }

      await pool.execute(
        'UPDATE pages SET published = ? WHERE id = ?',
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [existing]: any = await pool.execute(
        'SELECT * FROM pages WHERE id = ?',
        [id]
      );

      if (existing.length === 0) {
        throw new AppError('Página não encontrada', 404);
      }

      await pool.execute('DELETE FROM pages WHERE id = ?', [id]);

      res.json({ message: 'Página removida com sucesso' });
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