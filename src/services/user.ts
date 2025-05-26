import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { IUser } from '../types/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UserService {
  private usersFilePath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'users.json',
  );

  private readUsers(
    callback: (err: NodeJS.ErrnoException | null, data: string) => void,
  ) {
    fs.readFile(this.usersFilePath, 'utf8', callback);
  }

  private writeUsers(
    data: string,
    callback: (err: NodeJS.ErrnoException | null) => void,
  ) {
    fs.writeFile(this.usersFilePath, data, 'utf8', callback);
  }

  public async readAll() {
    return new Promise((resolve, reject) => {
      this.readUsers((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const users = JSON.parse(data) as IUser[];
          resolve(users);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async readOneByName(name: string) {
    return new Promise((resolve, reject) => {
      this.readUsers((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const users = JSON.parse(data) as IUser[];
          const user = users.find((user) => user.username === name);
          if (!user) {
            return reject(new Error(`User with username - ${name} not found`));
          }
          resolve(user);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async addUser(user: { username: string }) {
    return new Promise((resolve, reject) => {
      this.readUsers((err, data) => {
        if (err) {
          return reject(err);
        }

        try {
          const users = JSON.parse(data);
          const newUser = { ...user, id: Date.now() };
          users.push(newUser);

          this.writeUsers(JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
              return reject(writeErr);
            }
            resolve(newUser);
          });
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }

  public async deleteUser(id: number) {
    return new Promise((resolve, reject) => {
      this.readUsers((err, data) => {
        if (err) {
          return reject(err);
        }
        try {
          const users = JSON.parse(data);
          const updatedUsers = users.filter(
            (user: { id: number }) => user.id !== id,
          );
          this.writeUsers(JSON.stringify(updatedUsers, null, 2), (writeErr) => {
            if (writeErr) {
              return reject(writeErr);
            }
            resolve({ message: 'User deleted successfully' });
          });
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }
}

export default new UserService();
