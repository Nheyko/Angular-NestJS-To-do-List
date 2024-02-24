import { Routes } from '@angular/router';
import { taskResolver } from './tasks/task-resolver';
// import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
    {   path: "", pathMatch: "full", redirectTo: "tasks" },
    {  
        path: "tasks", // W/ LazyLoading
        resolve: {tasks: taskResolver},
        loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent),
    },
    // {path: "tasks", component: TasksComponent, resolve: {tasks: taskResolver}}, // W/O Lazy Loading
];
