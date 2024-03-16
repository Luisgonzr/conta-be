import { SetMetadata } from '@nestjs/common';
/*import { Role } from '@prisma/client';*/

enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }
  
  export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
