import type { Request, Response } from 'express';
import userService from '../services/user.ts';
import type { IUser } from '../types/User.ts';

class UsersController {
  public async register(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { username } = req.body as Partial<IUser>;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const isExists = await userService
      .readOneByName(username)
      .catch(() => null);

    if (isExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    try {
      const newUser = await userService.addUser({ username });
      return res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to register user: ${error}` });
    }
  }

  public async login(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { username } = req.body as Partial<IUser>;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    try {
      const user = await userService.readOneByName(username);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({
        message: 'Login successful',
        user,
      });
    } catch (error) {
      return res.status(500).json({ error: `Failed to login user: ${error}` });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const users = await userService.readAll();
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to retrieve users: ${error}` });
    }
  }
}

export default new UsersController();
