import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
import { Course } from '../model/course';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { HighlightDirective } from '../directives/highlight.directive';
import { DurationFormatPipe } from '../pipes/duration-format.pipe';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'course-page',
  imports: [DurationFormatPipe, HighlightDirective],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit {
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

  lessonsResource = resource({
    params: () => {
      const courseId = this.course()?.id;
      if (!courseId) return undefined;

      return {
        courseId,
        filter: this.searchQuery(),
        sortOrder: this.sortDirection(),
        pageNumber: this.pageIndex(),
        pageSize: this.pageSize()
      };
    },
    loader: async ({ params }) => {
      return this.coursesService.findLessons(
        params.courseId,
        params.filter,
        params.sortOrder,
        params.pageNumber,
        params.pageSize
      );
    }
  });

  lessons = computed(() => this.lessonsResource.value() ?? []);
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
