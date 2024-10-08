import { UserRole } from '../consts/consts';

export class CreateRoleDto {
  readonly value: UserRole;
  readonly description: string;
}
