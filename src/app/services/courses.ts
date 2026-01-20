import { Injectable, signal } from "@angular/core";
import { Course } from "../model/course";
import { Lesson } from "../model/leson";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private courses = signal<Course[]>([]);
  readonly allCourses = this.courses.asReadonly();

  // Helper to handle common fetch logic
  private async fetchRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async findCourseById(courseId: number): Promise<Course> {
    return this.fetchRequest<Course>(`/api/courses/${courseId}`);
  }

  async findAllCourses(): Promise<Course[]> {
    const res = await this.fetchRequest<{ payload: Course[] }>('/api/courses');
    const courses = res.payload;
    this.courses.set(courses);
    return courses;
  }

  async saveCourse(courseId: number, changes: Partial<Course>): Promise<Course> {
    const updatedCourse = await this.fetchRequest<Course>(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    });

    this.courses.update(courses =>
      courses.map(course => course.id === courseId ? { ...course, ...updatedCourse } : course)
    );

    return updatedCourse;
  }

  async findLessons(
    courseId: number,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 3
  ): Promise<Lesson[]> {
    const query = new URLSearchParams({
      courseId: courseId.toString(),
      filter,
      sortOrder,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });

    const res = await this.fetchRequest<{ payload: Lesson[] }>(`/api/lessons?${query}`);
    return res.payload;
  }
}
