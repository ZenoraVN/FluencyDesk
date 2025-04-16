import { User } from '../entities/User';
import { IUserRepository } from '../../application/ports/IUserRepository';

export class UserManagementUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(email: string, username: string): Promise<User> {
    const user = new User(
      Date.now().toString(), // Simple ID generation for demo
      email,
      username,
      new Date()
    );

    await this.userRepository.saveUser(user);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return await this.userRepository.getUser(id);
  }

  async listUsers(): Promise<User[]> {
    return await this.userRepository.listUsers();
  }

  async updateUser(user: User): Promise<void> {
    await this.userRepository.updateUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}