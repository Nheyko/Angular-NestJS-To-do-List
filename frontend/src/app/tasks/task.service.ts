import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Task } from './task';
import { Observable, BehaviorSubject, throwError, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  http = inject(HttpClient)
  tasks: Task[]
  readonly apiUrl = "http://localhost:3000";
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(
    private httpClient: HttpClient,
  ) {
    this.readTasks();
  }

  public getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }
  
  private readTasks() {
    this.httpClient.get<Task[]>(`${this.apiUrl}/tasks`)
      .pipe(
        catchError((error) => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: tasks => {
          console.log("Received tasks from server:", tasks);
          this.tasksSubject.next(tasks);
        }
      });
  }

  /**
 * Creates a new task.
 * @param task - The task object to be created.
 * @returns Observable<Task> - Observable of the created task.
 */
  public createTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.apiUrl}/tasks`, task)
      .pipe(
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  public refreshTasks() {
    this.httpClient.get<Task[]>(`${this.apiUrl}/tasks`)
      .pipe(
        catchError(error => {
          console.error('Error refreshing tasks:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: tasks => {
          console.log("Received tasks from server:", tasks);
          this.tasksSubject.next(tasks); // Emit the updated tasks to subscribers
        }
      });
  }

  public patchUpdateTask(task: Partial<Task>): Observable<Task> {
    console.log("patch !")
    return this.httpClient.patch<Task>(`${this.apiUrl}/tasks/${task.id}`, task)
      .pipe(
        catchError((error) => {
          throw error; // Rethrow the error to be caught by the caller
        })
      );
  }

  public putUpdateTask(task: Task): Observable<Task> {
    console.log("put !")
    return this.httpClient.put<Task>(`${this.apiUrl}/tasks/${task.id}`, task)
      .pipe(
        catchError((error) => {
          throw error; // Rethrow the error to be caught by the caller
        })
      );
  }

  /**
  * Deletes a task by ID.
  * @param id - The ID of the task to be deleted.
  * @returns Observable<Object> - Observable indicating the result of the deletion.
  */
  public deleteTask(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/tasks/${id}`)
      .pipe(
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }
}
