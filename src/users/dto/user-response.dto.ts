import { OmitType } from '@nestjs/mapped-types';
import { User } from '../users.model';

export class UserResponseDto extends OmitType(User, ['password']) {}
