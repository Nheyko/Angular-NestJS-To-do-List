// Import necessary modules and components
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subscription, catchError, finalize, tap } from 'rxjs';

import { Task } from './task'; // Import Task interface
import { TaskStatus } from './task-status';
import { TaskService } from './task.service'; // Import TaskService for task operations
import { TaskFormComponent } from '../task-form/task-form.component'; // Import TaskFormComponent for task form management
import { LoadingService } from '../loading.service'; // Import LoadingService for managing loading state

/**
 * Component responsible for managing tasks.
 */
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskFormComponent], // Import CommonModule for common Angular directives and pipes
  templateUrl: './tasks.component.html', // Template file for the component
  styleUrl: './tasks.component.css', // Stylesheet file for the component
})

export class TasksComponent implements OnInit {

  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  dataLoading = true;
  taskStatusSet: Set<string> = new Set<string>();
  taskStatusMap: { [key: string]: Task[] } = {};
  bottomCards: QueryList<ElementRef>;
  taskFormComponent!: TaskFormComponent;
  private loadingSubscription: Subscription;
  tasksInitialized = false;

  constructor(
    private taskService: TaskService,
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit(): void {
    this.loading$ = this.loadingService.isLoading();
    this.loadingSubscription = this.loading$.subscribe(loading => {
      this.dataLoading = loading;
    });
    this.loadTasks();
  }

  loadTasks(): void {
    console.log("Load task called.")
    this.tasks$ = this.taskService.getTasks()
      .pipe(
        tap(tasks => {
          this.taskStatusSet.clear();
          this.taskStatusMap = {};
          tasks.forEach(task => {
            this.taskStatusSet.add(task.status);
            this.taskStatusMap[task.status] = this.taskStatusMap[task.status] || [];
            this.taskStatusMap[task.status].push(task);
          });
          console.log("Task Status Set:", this.taskStatusSet);
          console.log("Task Status Map:", this.taskStatusMap);
          this.tasksInitialized = true;
        }),
        catchError(error => {
          console.error('Error loading tasks:', error);
          return EMPTY;
        }),
        finalize(() => {
          this.loadingService.setLoadingState(false);
        })
      );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  /**
   * Sets the content of the bottom card element.
   * Checks for overflow and applies padding if needed.
   * @param content - Reference to the bottom card element.
   */
  @ViewChildren('bottomCard') set content(content: QueryList<ElementRef>) {
    if (content) {
      this.bottomCards = content;
      this.applyPaddingToBottomCards();
    }
  }

  /**
   * Check for overflow in the bottom card element and apply padding if needed.
   */
  applyPaddingToBottomCards(): void {
    this.bottomCards.forEach(bottomCard => {
      const element: HTMLElement = bottomCard.nativeElement;
      if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
        // console.log('Overflow detected!');
        element.style.paddingLeft = '17px';
      }
    });
  }

  getTaskStatusValues(): string[] {
    return Object.values(TaskStatus);
  }
}
