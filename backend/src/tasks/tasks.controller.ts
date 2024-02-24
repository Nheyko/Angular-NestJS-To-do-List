import { Inject, Logger, NotFoundException, Put, Type, UseInterceptors } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { CACHE_MANAGER, Cache, CacheTTL } from '@nestjs/cache-manager';
import { LazyModuleLoader } from '@nestjs/core';
import { TasksModule } from './tasks.module';

@Controller()
export class TasksController {

  private logger = new Logger(TasksService.name);

  constructor(
    private readonly tasksService: TasksService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(LazyModuleLoader) private lazyModuleLoader: LazyModuleLoader,
  ) { }

  private async loadTasksModuleAndService(): Promise<TasksService> {
    const lazyTasksModule = await this.lazyModuleLoader.load(() => TasksModule);
    const lazyTasksService = lazyTasksModule.get(TasksService);
    return lazyTasksService;
  }

  @Get(':id')
  @CacheTTL(600)
  async findOne(@Param('id') id: string): Promise<Task> {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      const task = await lazyTasksService.findOne(+id)
      if (!task) {
        throw new Error('Task not found')
      }
      return task;
    } catch (error) {
      this.logger.log(
        `TasksService:findOne : ${JSON.stringify(error.message)}`);
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  @CacheTTL(600)
  async findAll(): Promise<Task[]> | null {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      const tasks = await lazyTasksService.findAll();
      if (tasks?.length === 0) {
        return null;
      }
      return tasks;
    } catch (error) {
      this.logger.log(
        `TasksService:findAll : ${JSON.stringify(error.message)}`);
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      let isTaskExisting: Task[] | null;
      isTaskExisting = await this.findAll()
      if (isTaskExisting != null) {
        isTaskExisting.forEach(task => {
          if (task.id == createTaskDto.id) {
            throw new Error('ID already existing');
          }
        })
      }
      return lazyTasksService.create(createTaskDto);
    } catch (error) {
      this.logger.log(`TasksService:create: ${JSON.stringify(error.message)}`);
      throw new Error(error.message);
    }
  }

  @Patch(':id')
  async patchUpdate(@Param('id') id: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      const task = await lazyTasksService.findOne(+id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      const updatedTask = { ...task, ...updateTaskDto };
      this.logger.log("Patch !")
      return await lazyTasksService.update(+id, updatedTask);
    } catch (error) {
      this.logger.log(`TasksService:update: ${JSON.stringify(error.message)}`);
      throw error;
    }
  }

  @Put(':id')
  async putUpdate(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      const task = await lazyTasksService.findOne(+id)
      await this.findOne(id);
      if (!task) {
        throw new Error('Task not found')
      }
      else if (parseInt(id) !== updateTaskDto.id) {
        throw new Error('ID not match')
      }
      this.logger.log("Put !")
      return await lazyTasksService.update(+id, updateTaskDto)
    } catch (error) {
      this.logger.log(`TasksService:update: ${JSON.stringify(error.message)}`);
      if (error.message == 'Task not found') {
        throw new NotFoundException(error.message);
      }
      if (error.message == 'ID not match') {
        throw new Error(error.message);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const lazyTasksService = await this.loadTasksModuleAndService();
      const task = await lazyTasksService.findOne(+id)
      await this.findOne(id);
      if (!task) {
        throw new Error('Task not found')
      }
      return await lazyTasksService.remove(+id);
    } catch (error) {
      this.logger.log(`TasksService:delete: ${JSON.stringify(error.message)}`);
      throw new NotFoundException(error.message);
    }
  }
}
