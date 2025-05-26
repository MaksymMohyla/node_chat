import type { IRoom } from '../types/Room.ts';
import type { Request, Response } from 'express';
import roomService from '../services/room.ts';
import type { IMessage } from '../types/Message.ts';
import type { WebSocketServer } from 'ws';

class RoomController {
  public async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const { name } = req.body as Partial<IRoom>;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Room name is required' });
    }

    const isExists = await roomService.readOneByName(name).catch(() => null);

    if (isExists) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    try {
      const newRoom = await roomService.addRoom({ name });
      return res.status(201).json({
        message: 'Room created successfully',
        room: newRoom,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to register user: ${error}` });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const rooms = await roomService.readAll();
      return res.status(200).json(rooms);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to retrieve rooms: ${error}` });
    }
  }

  public async getById(req: Request, res: Response) {
    const roomId = req.params.id;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    try {
      const room = await roomService.readOneById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      return res.status(200).json(room);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to retrieve room: ${error}` });
    }
  }

  public async addUserToRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const user = req.body;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    if (!user || !user.id) {
      return res
        .status(400)
        .json({ error: 'User data with valid id is required' });
    }

    try {
      const updatedRoom = await roomService.addUserToRoom(roomId, user);
      const wss = req.app.get('wss') as WebSocketServer;
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ event: 'userJoined', roomId, user }));
      });

      return res.status(200).json({
        message: 'User added to room successfully',
        room: updatedRoom,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: `Failed to add user to room: ${error}` });
    }
  }

  public async removeUserFromRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const { userId } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const updatedRoom = await roomService.removeUserFromRoom(roomId, userId);
      return res.status(200).json({
        message: 'User removed from room successfully',
        room: updatedRoom,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: `Failed to remove user from room: ${error}` });
    }
  }

  public async addMessageToRoom(req: Request, res: Response) {
    const roomId = req.params.id;
    const message = req.body as IMessage;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }
    if (!message) {
      return res
        .status(400)
        .json({ error: 'Message with userId and text is required' });
    }

    try {
      const updatedRoom = await roomService.addMessageToRoom(roomId, message);
      const wss = req.app.get('wss') as WebSocketServer;
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ event: 'newMessage', roomId, message }));
      });

      return res.status(201).json({
        message: 'Message added to room successfully',
        room: updatedRoom,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      return res
        .status(500)
        .json({ error: `Failed to add message to room: ${error}` });
    }
  }
}

export default new RoomController();
