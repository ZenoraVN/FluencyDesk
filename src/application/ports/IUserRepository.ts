import { User } from '../../core/entities/User';

export interface IUserRepository {
  getUser(id: string): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
  listUsers(): Promise<User[]>;
}