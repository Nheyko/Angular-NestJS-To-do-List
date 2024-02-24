import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, catchError, of, take, tap } from "rxjs";
import { TaskService } from "./task.service";

export const taskResolver: ResolveFn<any> =
    (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<any> => {
        const taskService: TaskService = inject(TaskService)

        return taskService.getTasks()
            .pipe(
                take(1),
                tap(tasks => {
                    if (!tasks) {
                        throw new Error('Aucune tâche trouvée');
                    }
                }),
                catchError((error) => {
                    console.error('Error loading tasks:', error);
                    return of(null); // Renvoie un objet null en cas d'erreur
                })
            );
    };