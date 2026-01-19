import { Component, computed, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { Course } from '../../model/course';
import { Lesson } from '../../model/leson';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../services/courses';
import { debounceTime, distinctUntilChanged, fromEvent, Subject, tap } from 'rxjs';
import { HighlightDirective } from '../directives/appHighlight.directive';
import { DurationFormatPipe } from '../pipes/durationFormat.pipe';

@Component({
  selector: 'app-course-view',
  imports: [DurationFormatPipe, HighlightDirective],
  templateUrl: './course-view.html',
  styleUrl: './course-view.scss',
})
export class CourseView implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private router = inject(Router);

  course = signal<Course | undefined>(undefined);
  lessons = signal<Lesson[]>([]);
  loading = signal(false);

  pageIndex = signal(0);
  pageSize = signal(3);
  sortDirection = signal<'asc' | 'desc'>('asc');
  sortField = signal('seqNo');
  searchQuery = signal('');
  private searchSubject = new Subject<string>();

  currentPage = computed(() => this.pageIndex() + 1);
  totalPages = computed(() => Math.ceil((this.course()?.lessonsCount || 0) / this.pageSize()));
  isFirstPage = computed(() => this.pageIndex() === 0);
  isLastPage = computed(() => this.currentPage() >= this.totalPages());

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.pageIndex.set(0);
      this.searchQuery.set(query);
    });

    effect(() => {
      this.loadLessonsPage();
    });
  }

  ngOnInit() {
    this.course.set(this.route.snapshot.data["course"]);
  }

  loadLessonsPage() {
    const currentCourse = this.course();
    if (!currentCourse) return;

    this.loading.set(true);
    this.coursesService.findLessons(
      currentCourse.id,
      this.searchQuery(),
      this.sortDirection(),
      this.pageIndex(),
      this.pageSize()
    ).subscribe({
      next: (lessons) => {
        this.lessons.set(lessons);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }


  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.pageIndex.set(0);
  }

  nextPage() {
    if (!this.isLastPage()) this.pageIndex.update(p => p + 1);
  }

  prevPage() {
    if (!this.isFirstPage()) this.pageIndex.update(p => p - 1);
  }

  toggleSort() {
    this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    this.pageIndex.set(0);
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}
