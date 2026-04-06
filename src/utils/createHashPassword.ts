import { hash } from 'bcrypt';

export async function createHashPasswordasync(password: string) {
  return await hash(password, 7);
}
