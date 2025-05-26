import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { IRoom } from '../types/Room.ts';
import type { IUser } from '../types/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class RoomService {
  private roomsFilePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'rooms.json',
  );

  private readRooms(
    callback: (err: NodeJS.ErrnoException | null, data: string) => void,
  ) {
    fs.readFile(this.roomsFilePath, 'utf8', callback);
  }

  private writeRooms(
    data: string,
    callback: (err: NodeJS.ErrnoException | null) => void,
  ) {
    fs.writeFile(this.roomsFilePath, data, 'utf8', callback);
  }

  public async readAll() {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          resolve(rooms);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async addRoom(name: Partial<IRoom>) {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          rooms.push({
            ...name,
            id: Date.now(),
            participants: [],
            messages: [],
          } as IRoom);
          this.writeRooms(JSON.stringify(rooms), (writeErr) => {
            if (writeErr) {
              return reject(writeErr);
            }
            resolve(name);
          });
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async addUserToRoom(roomId: string, user: IUser) {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          const roomIndex = rooms.findIndex((room) => room.id === +roomId);
          if (roomIndex === -1) {
            return reject(new Error(`Room with id - ${roomId} not found`));
          }
          const room = rooms[roomIndex];
          // Check if user already exists in participants
          const userExists = room.participants.some((u) => u.id === user.id);
          if (!userExists) {
            room.participants.push(user);
            rooms[roomIndex] = room;
            this.writeRooms(JSON.stringify(rooms), (writeErr) => {
              if (writeErr) {
                return reject(writeErr);
              }
              resolve(room);
            });
          } else {
            resolve(room); // User already in room, just resolve
          }
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async removeUserFromRoom(roomId: string, userId: IUser['id']) {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          const roomIndex = rooms.findIndex((room) => room.id === +roomId);
          if (roomIndex === -1) {
            return reject(new Error(`Room with id - ${roomId} not found`));
          }
          const room = rooms[roomIndex];
          room.participants = room.participants.filter((u) => u.id !== userId);
          rooms[roomIndex] = room;
          this.writeRooms(JSON.stringify(rooms), (writeErr) => {
            if (writeErr) {
              return reject(writeErr);
            }
            resolve(room);
          });
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async readOneByName(name: string) {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          const room = rooms.find((room) => room.name === name);
          if (!room) {
            return reject(new Error(`User with room - ${name} not found`));
          }
          resolve(room);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async readOneById(id: string) {
    return new Promise((resolve, reject) => {
      this.readRooms((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const rooms = JSON.parse(data) as IRoom[];
          const room = rooms.find((room) => room.id === +id);
          if (!room) {
            return reject(new Error(`Room with id - ${id} not found`));
          }
          resolve(room);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }
}

export default new RoomService();
