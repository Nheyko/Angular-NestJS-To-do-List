// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { TaskService } from './task.service';
// import { Task } from './task';
// import { of } from 'rxjs';
// import { TaskStatus } from './task-status';

// describe('TaskService', () => {
//   let service: TaskService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [TaskService]
//     });
//     service = TestBed.inject(TaskService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify(); // Ensure no outstanding requests
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should retrieve tasks from the API via GET', () => {
//     const mockTasks: Task[] = [
//       { id: 1, name: 'AAA', description: 'dsqds', status: TaskStatus.TODO },
//       { id: 2, name: 'Abc', description: 'Allo', status: TaskStatus.DOING },
//       { id: 3, name: 'BVBB', description: 'acs', status: TaskStatus.DONE }
//     ];
  
//     const expectedTasks: Task[] = []; // Initial empty array
//     service.getTasks().subscribe(tasks => {
//       expect(tasks).toEqual(expectedTasks); // Expect initial empty array
//       expect(tasks).toEqual(mockTasks); // Expect mock tasks after the API call
//     });
  
//     const req = httpMock.expectOne('http://localhost:3000/tasks');
//     expect(req.request.method).toBe('GET');
//     req.flush(mockTasks);
//   });

//   // it('should return tasks', (done: DoneFn) => {
//   //   const mockTasks: Task[] = [
//   //     { id: 1, name: 'Task 1', description: 'Description for Task 1', status: TaskStatus.TODO },
//   //     { id: 2, name: 'Task 2', description: 'Description for Task 2', status: TaskStatus.DOING }
//   //   ];

//   //   service.getTasks().subscribe(tasks => {
//   //     expect(tasks).toEqual(mockTasks); // Ensure the returned tasks match the mock data
//   //     done(); // Call done to signal that the test is complete
//   //   });

//   //   const req = httpMock.expectOne(`${service.apiUrl}/tasks`);
//   //   expect(req.request.method).toBe('GET'); // Ensure a GET request is made
//   //   req.flush(mockTasks); // Return mock data
//   // });

//   // it('should handle errors', (done: DoneFn) => {
//   //   const errorMessage = 'An error occurred';
    
//   //   // Simulate an error response
//   //   service.getTasks().subscribe({
//   //     error: err => {
//   //       expect(err).toBe(errorMessage); // Ensure the error message is as expected
//   //       done(); // Call done to signal that the test is complete
//   //     }
//   //   });

//   //   const req = httpMock.expectOne(`${service.apiUrl}/tasks`);
//   //   expect(req.request.method).toBe('GET'); // Ensure a GET request is made
//   //   req.error(new ErrorEvent('error', {
//   //     message: errorMessage
//   //   })); // Simulate an error
//   // });
// });