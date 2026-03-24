import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { verifyRefreshToken } from '../utils/jwt';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ user, accessToken });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ error: 'Refresh token missing' });

      const { accessToken, refreshToken } = await AuthService.refresh(token);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (token) {
        const payload = verifyRefreshToken(token);
        if (payload) {
          await AuthService.logout(payload.userId);
        }
      }
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out' });
    } catch (err) {
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out' });
    }
  }
}
