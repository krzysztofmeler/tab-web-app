import { Role } from '../AuthContextType';

type User = {
  id: number;
  email: string;
  password: number;
  roles: Role[];
};

export type { User };
