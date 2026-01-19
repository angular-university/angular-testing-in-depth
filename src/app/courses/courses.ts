import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CoursesCardList } from '../courses-card-list/courses-card-list';
import { CoursesService } from '../services/courses';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CoursesCardList],
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss']
})
export class Courses implements OnInit{
  private courseService = inject(CoursesService);
  
  allCourses = this.courseService.allCourses; 
  activeTab = signal<'beginner' | 'advanced'>('beginner');

  beginnerCourses = computed(() => 
    this.allCourses().filter(c => c.category === 'BEGINNER')
  );

  advancedCourses = computed(() => 
    this.allCourses().filter(c => c.category === 'ADVANCED')
  );

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.courseService.findAllCourses().subscribe();
  }
}