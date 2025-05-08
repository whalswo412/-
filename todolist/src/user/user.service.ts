import { Injectable } from '@nestjs/common';
import { createUserDto, updateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    getHello(): string {
        return 'Hello!!!';
    }

    create(userDto: createUserDto): createUserDto {
        return userDto;
    }

    update(id: string, userDto: updateUserDto): updateUserDto {
        return userDto;
    }


}
