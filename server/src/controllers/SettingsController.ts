import { Request, Response } from 'express';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';

export class SettingsController {
  async getAll(req: Request, res: Response) {
    try {
      const [rows]: any = await pool.execute('SELECT * FROM settings');
      
      const settings: any = {};
      rows.forEach((row: any) => {
        if (row.setting_type === 'json') {
          settings[row.setting_key] = JSON.parse(row.setting_value);
        } else {
          settings[row.setting_key] = row.setting_value;
        }
      });

      res.json(settings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getByKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const [rows]: any = await pool.execute(
        'SELECT * FROM settings WHERE setting_key = ?',
        [key]
      );

      if (rows.length === 0) {
        throw new AppError('Configuração não encontrada', 404);
      }

      const row = rows[0];
      const value = row.setting_type === 'json' 
        ? JSON.parse(row.setting_value) 
        : row.setting_value;

      res.json({ [key]: value });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const settings = req.body;
      const file = req.file;

      for (const [key, value] of Object.entries(settings)) {
        let settingValue = value as string;
        let settingType = 'text';

        if (typeof value === 'object') {
          settingValue = JSON.stringify(value);
          settingType = 'json';
        }

        await pool.execute(
          `INSERT INTO settings (setting_key, setting_value, setting_type) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE setting_value = ?, setting_type = ?`,
          [key, settingValue, settingType, settingValue, settingType]
        );
      }

      if (file && settings.comunicado_active) {
        const filePath = `/uploads/documents/${file.filename}`;
        
        await pool.execute(
          `INSERT INTO settings (setting_key, setting_value, setting_type) 
           VALUES ('comunicado_image', ?, 'text')
           ON DUPLICATE KEY UPDATE setting_value = ?`,
          [filePath, filePath]
        );
      }

      await pool.execute(
        'INSERT INTO logs (user_id, action, ip_address) VALUES (?, ?, ?)',
        [(req as any).user.id, 'update_settings', req.ip]
      );

      res.json({ message: 'Configurações salvas com sucesso' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getComunicado(req: Request, res: Response) {
    try {
      const [rows]: any = await pool.execute(
        "SELECT setting_value FROM settings WHERE setting_key = 'comunicado_image'"
      );

      const [active]: any = await pool.execute(
        "SELECT setting_value FROM settings WHERE setting_key = 'comunicado_active'"
      );

      if (rows.length === 0 || active.length === 0 || active[0].setting_value !== 'true') {
        return res.json(null);
      }

      res.json({ image: rows[0].setting_value });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const [users]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
      const [news]: any = await pool.execute('SELECT COUNT(*) as count FROM news');
      const [galleries]: any = await pool.execute('SELECT COUNT(*) as count FROM galleries');
      const [bids]: any = await pool.execute('SELECT COUNT(*) as count FROM bids');
      const [pages]: any = await pool.execute('SELECT COUNT(*) as count FROM pages');
      const [views]: any = await pool.execute('SELECT SUM(views) as total FROM news');

      res.json({
        users: users[0].count,
        news: news[0].count,
        galleries: galleries[0].count,
        bids: bids[0].count,
        pages: pages[0].count,
        views: views[0].total || 0
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}