import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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

  course = signal<Course | null>(null);
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

lessonsResource = this.coursesService.getLessonsResource(
    () => this.course()?.id,
    () => this.searchQuery(),
    () => this.sortDirection(),
    () => this.pageIndex(),
    () => this.pageSize()
  );

  // The component still consumes the data as signals
  lessons = computed(() => this.lessonsResource.value()?.payload ?? []);
  loading = computed(() => this.lessonsResource.isLoading());
  currentPage = computed(() => this.pageIndex() + 1);
  totalPages = computed(() => Math.ceil((this.course()?.lessonsCount || 0) / this.pageSize()));
  isFirstPage = computed(() => this.pageIndex() === 0);
  isLastPage = computed(() => this.currentPage() >= this.totalPages());

  constructor() { }

  ngOnInit() {
    this.course.set(this.route.snapshot.data["course"]);
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
