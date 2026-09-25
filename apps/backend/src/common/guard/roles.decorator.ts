import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/enums.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (Role | keyof typeof Role)[]) =>
  SetMetadata(ROLES_KEY, roles);
