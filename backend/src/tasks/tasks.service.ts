import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { constants } from 'src/constants';

@Injectable()
export class TasksService {

  constructor(
    @Inject(constants.taskRepository)
    private taskRepository: Repository<Task>,
  ) { }

  public async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }

  public async findAll(): Promise<Task[]> {
    return this.taskRepository.find()
  }

  public async findOne(id: number): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id })
  }

  public async update(id: number, updateTaskDto: Partial<Task>): Promise<Task | undefined> {
    const task = await this.findOne(+id);
    if (!task) return undefined;
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task)
  }

  public async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id)
  }
}
