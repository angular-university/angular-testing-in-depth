import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CoursesService } from './services/courses';
import { CoursesCardList } from './components/courses-card-list/courses-card-list';

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