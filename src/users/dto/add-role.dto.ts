import { IsNumber, Validate, IsNotEmpty } from 'class-validator';
import {
  MUST_BE_A_NUMBER_MESSAGE,
  REQUIRED_MESSAGE,
} from '../../helpers/consts/error-messages';
import { RolesValidator } from '../../auth/roles.validator';

export class AddRoleDto {
  @IsNotEmpty({ message: REQUIRED_MESSAGE })
  @Validate(RolesValidator)
  readonly value: string;
  @IsNumber({}, { message: MUST_BE_A_NUMBER_MESSAGE })
  readonly userId: number;
}
