import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  constructor(private formBuilder: FormBuilder) {}

  // Initialize task form
  initializeTaskForm(initialValues: any = {}): FormGroup {
    return this.formBuilder.group({
      name: [initialValues.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      description: [initialValues.description || '', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      status: [initialValues.status || '', [Validators.required]],
      id: [initialValues.id !== undefined ? initialValues.id.toString() : '']
    });
  }
  
  // Patch task form with provided values
  patchTaskForm(taskForm: FormGroup, values: any): void {
    taskForm.patchValue({
      id: values.id !== undefined ? values.id.toString() : '',
      name: values.name,
      description: values.description,
      status: values.status
    });
  }

}
