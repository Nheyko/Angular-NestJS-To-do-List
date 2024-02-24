import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskStatus } from '../tasks/task-status';

@Component({
  selector: 'app-task-form-fields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form-fields.component.html',
  styleUrl: './task-form-fields.component.css'
})

export class TaskFormFieldsComponent implements OnInit {

  @Input() taskForm: FormGroup; // Input property for task form
  @Input() isNewTask: boolean = false;
  @ViewChild('description') textarea: ElementRef // Reference to the description textarea
  statusOptions: TaskStatus[] // Array to store task status options
  newHeight: number = 0; // Variable to store the new height of the textarea
  initialFormData: any;

  constructor(
  ) { }

  ngOnInit() {
    // Assign TaskStatus enum values to statusOptions
    this.statusOptions = Object.values(TaskStatus);
    this.initialFormData = this.taskForm.value;
  }

  ngAfterViewInit(): void {
    this.adjustTextareaHeight(); // Adjust the height of the textarea after view initialization
  }

  // Event listener on textarea for input changes
  onInput(event: Event): void {
    this.adjustTextareaHeight(); // Adjust the height of the textarea
  }

  // Method to adjust the height of the textarea dynamically based on its content
  private adjustTextareaHeight(): void {
    if (this.textarea) {
      const textarea = this.textarea.nativeElement;
      textarea.style.height = '24px'; // Reset height to auto to correctly calculate scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  }
}
