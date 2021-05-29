export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

export interface User {
  email: string
  name: string
  role: Role
}
