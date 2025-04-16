import Store from 'electron-store';
import { User } from '../../core/entities/User';
import { IUserRepository } from '../../application/ports/IUserRepository';

interface UserSchema {
  users: {
    [key: string]: {
      id: string;
      email: string;
      username: string;
      createdAt: string;
    };
  };
}

export class ElectronStoreUserRepository implements IUserRepository {
  private store: Store<UserSchema>;

  constructor() {
    this.store = new Store<UserSchema>({
      defaults: {
        users: {}
      }
    });
  }

  async getUser(id: string): Promise<User | null> {
    const userData = this.store.get('users')[id];
    if (!userData) return null;

    return new User(
      userData.id,
      userData.email,
      userData.username,
      new Date(userData.createdAt)
    );
  }

  async saveUser(user: User): Promise<void> {
    const users = this.store.get('users');
    users[user.id] = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt.toISOString()
    };
    this.store.set('users', users);
  }

  async updateUser(user: User): Promise<void> {
    await this.saveUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    const users = this.store.get('users');
    delete users[id];
    this.store.set('users', users);
  }

  async listUsers(): Promise<User[]> {
    const users = this.store.get('users');
    return Object.values(users).map(userData => 
      new User(
        userData.id,
        userData.email,
        userData.username,
        new Date(userData.createdAt)
      )
    );
  }
}