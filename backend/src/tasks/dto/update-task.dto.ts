import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../task-status';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    id?: number;
    name: string;
    description: string;
    status: TaskStatus;
}
