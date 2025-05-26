import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { IRoom } from '../types/Room.ts';

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
}

export default new RoomService();
