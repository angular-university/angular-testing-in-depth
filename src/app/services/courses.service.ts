import { Injectable, inject } from "@angular/core";
import { HttpClient, httpResource } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { Course } from "../model/course";
import { Lesson } from "../model/leson";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private http = inject(HttpClient);

  readonly coursesResource = httpResource<{ payload: Course[] }>(() => '/api/courses');
  readonly allCourses = this.coursesResource.value.asReadonly();
  
  async findCourseById(courseId: number): Promise<Course> {
    return firstValueFrom(
      this.http.get<Course>(`/api/courses/${courseId}`)
    );
  }

  async saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
    const updatedCourse = await firstValueFrom(
      this.http.put<Course>(`/api/courses/${courseId}`, changes)
    );

    this.coursesResource.reload();
    return updatedCourse;
  }


  getLessonsResource(
    courseId: () => number | undefined,
    filter: () => string,
    sortOrder: () => string,
    pageNumber: () => number,
    pageSize: () => number
  ) {
    return httpResource<{ payload: Lesson[] }>(() => {
      const id = courseId();
      if (id === undefined) return undefined;

      return {
        url: '/api/lessons',
        params: {
          courseId: id.toString(),
          filter: filter(),
          sortOrder: sortOrder(),
          pageNumber: pageNumber().toString(),
          pageSize: pageSize().toString()
        }
      };
    });
  }
}