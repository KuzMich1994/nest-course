import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRole } from '../roles/consts/consts';

@ValidatorConstraint({ name: 'IsAppRole', async: false })
export class RolesValidator implements ValidatorConstraintInterface {
  validate(value: UserRole): Promise<boolean> | boolean {
    const appRoles = Object.values(UserRole);
    return appRoles.includes(value);
  }

  defaultMessage(): string {
    const appRoles = Object.values(UserRole);
    return `Доступные роли: ${appRoles.join(', ')}`;
  }
}
