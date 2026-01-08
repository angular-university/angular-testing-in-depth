import { Component, inject, input, output } from '@angular/core';
import { Course } from '../../model/course';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { CoursesDialog } from '../courses-dialog/courses-dialog';

@Component({
  selector: 'app-courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.html',
  styleUrls: ['./courses-card-list.scss']
})
export class CoursesCardList {
  private modalService: ModalService = inject(ModalService);
  courses = input.required<Course[]>();

  courseEdited = output<Course>();

  editCourse(course: Course) {
    const modalRef = this.modalService.open(CoursesDialog, {
      course: course
    });

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Saved data:', result);
      }
    });
  }
}