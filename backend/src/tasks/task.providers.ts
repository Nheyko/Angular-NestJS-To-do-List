import { DataSource } from "typeorm";
import { Task } from "./entities/task.entity";
import { constants } from "src/constants";

export const taskProviders = [
    {
        provide: constants.taskRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
        inject: [constants.dataSource],
    },
];