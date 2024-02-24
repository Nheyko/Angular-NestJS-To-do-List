import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    // Import ConfigModule FIRST
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true

    }),
    DatabaseModule,
    TasksModule,
    RouterModule.register([
      {
        path: 'tasks',
        module: TasksModule,
      }
    ])
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    AppService,
  ],
})
export class AppModule {

}
