import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { taskProviders } from './task.providers';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [TasksController],
  providers: [
    ...taskProviders,
    TasksService],
})
export class TasksModule {}
