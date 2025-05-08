import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto, updateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    getHello(): string {
        return this.userService.getHello();
    }

    @Post()
    create(@Body() userDto: createUserDto): createUserDto {
        return this.userService.create(userDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() userDto: updateUserDto): updateUserDto {
        return this.userService.update(id, userDto);
    }
}

