import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CoursesCardList } from '../courses-card-list/courses-card-list';
import { CoursesService } from '../services/courses';
import { TabsComponent } from '../tabs/tabs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CoursesCardList, TabsComponent],
  templateUrl: './courses.html',
  styleUrls: ['./courses.scss']
})
export class Courses implements OnInit {
  private courseService = inject(CoursesService);

  allCourses = this.courseService.allCourses;
  activeTab = signal<'beginner' | 'advanced'>('beginner');

  courseTabs = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Advanced', value: 'advanced' }
  ];

  beginnerCourses = computed(() =>
    this.allCourses().filter(c => c.category === 'BEGINNER')
  );

  advancedCourses = computed(() =>
    this.allCourses().filter(c => c.category === 'ADVANCED')
  );

  ngOnInit() {
    this.reloadCourses();
  }

  async reloadCourses() {
    await this.courseService.findAllCourses();
  }

  onTabChanged(newTab: 'beginner' | 'advanced') {
    this.activeTab.set(newTab);
  }
}