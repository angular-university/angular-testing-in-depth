import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Course } from '../model/course';
import { Lesson } from '../model/leson';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { HighlightDirective } from '../directives/appHighlight.directive';
import { DurationFormatPipe } from '../pipes/durationFormat.pipe';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'course-view',
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
  searchInput = signal('');

  searchQuery = toSignal(
    toObservable(this.searchInput).pipe(
      debounceTime(400),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  currentPage = computed(() => this.pageIndex() + 1);
  totalPages = computed(() => Math.ceil((this.course()?.lessonsCount || 0) / this.pageSize()));
  isFirstPage = computed(() => this.pageIndex() === 0);
  isLastPage = computed(() => this.currentPage() >= this.totalPages());

 constructor() {
    effect(() => {
      this.searchQuery(); 
      this.pageIndex.set(0);
    }, { allowSignalWrites: true });

    effect(() => {
      this.loadLessonsPage();
    });
  }

  ngOnInit() {
    this.course.set(this.route.snapshot.data["course"]);
  }

  async loadLessonsPage() {
    const currentCourse = this.course();
    if (!currentCourse) return;

    this.loading.set(true);
    try {
      const lessons = await this.coursesService.findLessons(
        currentCourse.id,
        this.searchQuery(), 
        this.sortDirection(),
        this.pageIndex(),
        this.pageSize()
      );
      this.lessons.set(lessons);
    } catch (error) {
      console.error("Failed to load lessons", error);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(query: string) {
    this.searchInput.set(query);
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
