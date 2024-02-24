import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from './task.service';
import { LoadingService } from '../loading.service';
import { Observable, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Task } from './task';
import { TaskStatus } from './task-status';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['isLoading', 'setLoadingState']);

    TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component = null as unknown as TasksComponent;
    fixture = null as unknown as ComponentFixture<TasksComponent>;
    mockTaskService = null as unknown as jasmine.SpyObj<TaskService>;
    mockLoadingService = null as unknown as jasmine.SpyObj<LoadingService>;
  });

  // Load Tasks Successfully
  it('should load tasks and group them by status', fakeAsync(() => {
    const mockTasks: Task[] = [
      { id: 1, name: "Abc", description: "Allo", status: TaskStatus.DOING },
      { id: 17, name: "BBVBB", description: "acs", status: TaskStatus.DONE },
      { id: 16, name: "AAA", description: "dsqds", status: TaskStatus.TODO },
    ];
    mockTaskService.getTasks.and.returnValue(of(mockTasks));

    component.loadTasks();

    expect(mockTaskService.getTasks).toHaveBeenCalled();

    tick(1000); // Adjust timeout if needed
    fixture.detectChanges(); // Trigger change detection

    // Wait until tasks$ is initialized before subscribing
    fixture.whenStable().then(() => {
      expect(component.tasksInitialized).toBe(true); // Ensure tasks$ is initialized
      component.tasks$.subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
      });

      expect(component.taskStatusSet.size).toBe(3);
      // expect(component.taskStatusMap[TaskStatus.TODO].length).toBe(1);
      // expect(component.taskStatusMap[TaskStatus.DOING].length).toBe(1);
      // expect(component.taskStatusMap[TaskStatus.DONE].length).toBe(1);
      // expect(mockLoadingService.setLoadingState).toHaveBeenCalledWith(false);
    })
  }))
})