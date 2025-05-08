import { IsNumber, IsString, IsNotEmpty } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";


/**
 * @description SRP를 위반하는 구조이지만 테스트용으로 한 파일에 두 클래스를 선언했다.
 *
 * SRP란: 한 클래스는 하나의 책임만 가져야한다. (단일 책임의 원칙)
 */
export class createUserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}


// NestJS의 PartialType은 TypeScript의 유틸리티 타입인
//  Partial을 기반으로 한 데코레이터입니다. 주로 DTO(Data Transfer Object)를 만들 때 사용되는데
//  , 기존 타입을 일부만 선택적(Optional)으로 만들어 재사용하는 데 유용해요.
// extends를 사용하는 것 보다 훨씬 간결하고 명확해요.
export class updateUserDto extends PartialType(createUserDto) {}