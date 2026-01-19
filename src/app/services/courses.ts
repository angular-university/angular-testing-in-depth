import { Injectable, inject, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map, tap } from "rxjs";
import { Course } from "../model/course";
import { Lesson } from "../model/leson";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private http = inject(HttpClient);

  #courses = signal<Course[]>([]);
  
  readonly allCourses = this.#courses.asReadonly();

  findCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`);
  }


  findAllCourses(): Observable<Course[]> {
    return this.http.get<{ payload: Course[] }>('/api/courses').pipe(
      map(res => res.payload),
      tap(courses => this.#courses.set(courses)) 
    );
  }

  saveCourse(courseId: number, changes: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`/api/courses/${courseId}`, changes).pipe(
      tap(updatedCourse => {
        this.#courses.update(courses => 
          courses.map(c => c.id === courseId ? { ...c, ...updatedCourse } : c)
        );
      })
    );
  }

  findLessons(
    courseId: number, 
    filter = '', 
    sortOrder = 'asc',
    pageNumber = 0, 
    pageSize = 3
  ): Observable<Lesson[]> {
    const params = new HttpParams()
      .set('courseId', courseId) 
      .set('filter', filter)
      .set('sortOrder', sortOrder)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<{ payload: Lesson[] }>('/api/lessons', { params }).pipe(
      map(res => res.payload)
    );
  }
}