import { TaskStatus } from "../task-status";

export class CreateTaskDto {

    id?: number;
    name: string;
    description: string;
    status: TaskStatus;
}
