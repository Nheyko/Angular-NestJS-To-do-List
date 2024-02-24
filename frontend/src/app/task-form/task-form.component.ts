// Import necessary modules and components
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms'; // Import FormGroup for managing form data
import { Subject, takeUntil } from 'rxjs';

import { Task } from '../tasks/task';
import { TaskService } from '../tasks/task.service'; // Import TaskService for task-related operations
import { FormService } from './form.service'; // Import FormService for initializing and patching forms
import { TaskStatus } from '../tasks/task-status';
import { TaskFormFieldsComponent } from '../task-form-fields/task-form-fields.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskFormFieldsComponent], // Import CommonModule for common Angular directives and pipes, ReactiveFormsModule for form management
  templateUrl: './task-form.component.html', // Template file for the component
  styleUrl: './task-form.component.css', // Stylesheet file for the component
})

export class TaskFormComponent implements OnInit {


  @Input() isNewTask: boolean = false; // Default to false
  @Input() taskName: string = ''; // Input property for task name
  @Input() taskDescription: string = ''; // Input property for task description
  @Input() taskStatus: TaskStatus; // Input property for task status
  @Input() taskId?: number; // Input property for task ID
  @ViewChild('description') textarea: ElementRef // Reference to the description textarea
  statusOptions: TaskStatus[]; // Array to store task status options
  initialFormData: any;
  taskForm: FormGroup; // Form group to manage task form data
  newTaskForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>(); // For unsubscribe
  
  constructor(
    private formService: FormService, // Inject FormService for initializing and patching forms
    private taskService: TaskService, // Inject TaskService for task-related operations
  ) { }

  ngOnInit(): void {

    // Initialize the task form using FormInitializationService
    this.taskForm = this.formService.initializeTaskForm();
    this.newTaskForm = this.formService.initializeTaskForm();

    // Patch the task form with initial values
    this.formService.patchTaskForm(this.taskForm, {
      id: this.taskId,
      name: this.taskName,
      description: this.taskDescription,
      status: this.taskStatus
    });

    // Assign TaskStatus enum values to statusOptions
    this.statusOptions = Object.values(TaskStatus);

    this.initialFormData = this.taskForm.value;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Method to check if the form data has changed
  isFormUnchanged(): boolean {
    return JSON.stringify(this.taskForm.value) === JSON.stringify(this.initialFormData);
  }

  isNewFormUnchanged(): boolean {
    return JSON.stringify(this.newTaskForm.value) === JSON.stringify(this.initialFormData);
  }

  update() {
    // Assuming you have taskId and task properties populated with the current task data
    const updatedTask: Task = {
      id: this.taskId,
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      status: this.taskForm.value.status
    };

    // Check if each attribute is being modified
    const isNameModified = updatedTask.name !== this.taskName;
    const isDescriptionModified = updatedTask.description !== this.taskDescription;
    const isStatusModified = updatedTask.status !== this.taskStatus;

    // Check if all attributes are modified
    const areAllAttributesModified = isNameModified && isDescriptionModified && isStatusModified;

    if (areAllAttributesModified) {
      console.log("Sending Task");
    } else {
      console.log("Sending Partial<Task>");
    }

    // Choose whether to send partial or full update based on modification status
    const updateToSend = areAllAttributesModified ? updatedTask : {
      id: this.taskId,
      name: isNameModified ? this.taskForm.value.name : undefined,
      description: isDescriptionModified ? this.taskForm.value.description : undefined,
      status: isStatusModified ? this.taskForm.value.status : undefined
    };

    // Determine the update method based on whether partial or full update is being sent
    const updateMethod = areAllAttributesModified ? 'putUpdateTask' : 'patchUpdateTask';

    // Call the appropriate update method from the TaskService
    this.taskService[updateMethod](updateToSend).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.taskService.refreshTasks(); 
      },
      error: (error) => {
        console.error('Error updating task: ', error);
      }
    });
  }

  // Method to handle delete action
  delete() {

    const id = this.taskId;

    if (id !== undefined) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log(`Task ${id} deleted`);
          this.taskService.refreshTasks(); 
        },
        error: (error) => {
          console.error('Error deleting task: ', error)
        }
      });
    } else {
      console.log("Task ID is undefined. Cannot delete task.")
    }
  }

  // Method to handle form submission
  onSubmit() {

    const task: Task = {
      name: this.newTaskForm.value.name,
      description: this.newTaskForm.value.description,
      status: this.newTaskForm.value.status
    }

    this.taskService.createTask(task).subscribe({
      next: () => {
        console.log("Submit", this.newTaskForm.value); // Log submitted form data
        this.taskService.refreshTasks(); 
      },
      error: (error) => {
        console.error('Error creating new task: ', error)
      }
    });
  }
}
