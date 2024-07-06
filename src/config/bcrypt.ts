import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export class bcryptAdapter {
  static async hash(password: string): Promise<string> {
    const salt = genSaltSync();
    return hashSync(password, salt);
  }

  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compareSync(password, hashedPassword);
  }
}
