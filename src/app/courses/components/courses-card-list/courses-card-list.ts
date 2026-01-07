import { Component, input, output } from '@angular/core';
import { Course } from '../../model/course';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.html',
  styleUrls: ['./courses-card-list.scss']
})
export class CoursesCardList {
  courses = input.required<Course[]>();

  courseEdited = output<Course>();

  editCourse(course: Course) {
    this.courseEdited.emit(course);
  }
}