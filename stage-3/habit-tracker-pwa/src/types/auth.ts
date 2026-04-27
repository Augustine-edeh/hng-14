export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Session {
  userId: string;
  email: string;
}
