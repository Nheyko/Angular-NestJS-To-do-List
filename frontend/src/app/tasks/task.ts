import { TaskStatus } from "./task-status";

export interface Task {
    id?: number,
    name: string,
    description: string,
    status: TaskStatus
}
