import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../task-status";
import {
    IsInt,
    Length,
  } from 'class-validator';

@Entity()
export class Task {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    @IsInt()
    id: number;

    @Column({
        length: 10
    })
    @Length(3, 10)
    name: string;

    @Column({
        length: 255
    })
    @Length(3,255)
    description: string;

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus
}
