import {afterEach, beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursePage} from './course-page';
import {DebugElement} from '@angular/core';
import {getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS} from '../testing/testing-data';
import {CoursesService} from '../services/courses.service';
import {ActivatedRoute} from '@angular/router';
import {clickButton, getTableContent} from '../testing/testing-utils';
import {By} from '@angular/platform-browser';

const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);
const SEARCH_RESULTS = getMockLessonsPage(1, 'Lesson 20', 'asc',0, 3);


describe("Complex Angular Component",()=>{
  let mockCourseService : {findLessons: Mock<any>};
  let fixture:ComponentFixture<CoursePage>
  let debugElement:DebugElement
  let component:CoursePage

  beforeEach(async ()=>{
    mockCourseService = {
      findLessons: vi.fn()
    }
    await TestBed.configureTestingModule({
      imports:[CoursePage],
      providers:[
        {provide:CoursesService,useValue:mockCourseService},
        {provide:ActivatedRoute,
          useValue:{
            snapshot:{
              data:{
                course: MOCK_COURSES[0]
              }
            }
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CoursePage)
    debugElement = fixture.debugElement
    component = fixture.componentInstance;
  })

  it('should load lessons on init', async () => {
    mockCourseService.findLessons.mockReturnValueOnce(FIRST_PAGE)

    await fixture.whenStable()
    expect(mockCourseService.findLessons).toHaveBeenLastCalledWith(1,'',"asc",0,3)

    let courses = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(courses).length(3)
    expect(courses[0]).toBe("Lesson 1")
    expect(courses[1]).toBe("Lesson 2")
    expect(courses[2]).toBe("Lesson 3")
  });

  it('should show the loading spinner while fetching', async () => {
    fixture.detectChanges()
    const spinner = debugElement.query(By.css(".loading-spinner"))
    expect(spinner).toBeDefined();
    expect(component.loading()).toBe(true)
  });


  it('should navigate to next page', async () => {
    mockCourseService.findLessons.mockReturnValueOnce(FIRST_PAGE)
    await fixture.whenStable();
    let course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(mockCourseService.findLessons).toHaveBeenLastCalledWith(1,"","asc",0,3);
    expect(course.length).toBe(3);
    mockCourseService.findLessons.mockReturnValueOnce(SECOND_PAGE)
    component.pageIndex.set(1)
    await fixture.whenStable();
    course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(3)
    expect(course[0]).toBe("Lesson 4")
    expect(course[1]).toBe("Lesson 5")
    expect(course[2]).toBe("Lesson 6")
  });

  it('should navigate to previous page', async () => {
    component.pageIndex.set(1)
    mockCourseService.findLessons.mockReturnValueOnce(SECOND_PAGE)
      .mockReturnValueOnce(FIRST_PAGE)
    await fixture.whenStable()
    let course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(3)
    expect(course[0]).toBe("Lesson 4")
    expect(course[1]).toBe("Lesson 5")
    expect(course[2]).toBe("Lesson 6")

    clickButton(debugElement,".page-controls button:first-child")
    await fixture.whenStable()
    course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(3)
    expect(course[0]).toBe("Lesson 1")
    expect(course[1]).toBe("Lesson 2")
    expect(course[2]).toBe("Lesson 3")
  });

  it('should toggle sort direction', async () => {
    mockCourseService.findLessons.mockReturnValueOnce(FIRST_PAGE)
    await fixture.whenStable()
    expect(component.sortDirection()).toBe("asc")

    mockCourseService.findLessons.mockReturnValueOnce(
      MOCK_LESSONS.reverse().slice(0,3)
    )
    clickButton(debugElement,".sortable")
    await fixture.whenStable();
    let course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(3)
    expect(course[0]).toBe("Lesson 20")
    expect(course[1]).toBe("Lesson 19")
    expect(course[2]).toBe("Lesson 18")
    expect(component.sortDirection()).toBe("desc")
  });

  it('should update page size', async () => {
    mockCourseService.findLessons.mockReturnValueOnce(FIRST_PAGE)
    await fixture.whenStable()

    mockCourseService.findLessons.mockReturnValueOnce(
      getMockLessonsPage(1,'',"asc",0,10)
    )
    const selector = debugElement.query(By.css(".items-label select")).nativeElement as HTMLSelectElement;
    selector.value = '10'
    selector.dispatchEvent(new Event("change"))
    await fixture.whenStable()
    let course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(10)
    expect(course[0]).toBe("Lesson 1")
    expect(course[9]).toBe("Lesson 10")
  });

  it('should debounce search input by 400ms', async () => {
    vi.useFakeTimers()

    mockCourseService.findLessons.mockReturnValueOnce(FIRST_PAGE);
    fixture.detectChanges()
    expect(mockCourseService.findLessons).toHaveBeenCalledTimes(1)

    mockCourseService.findLessons.mockReturnValueOnce(SEARCH_RESULTS)
    component.onSearch("Lesson 20")
    fixture.detectChanges()
    expect(mockCourseService.findLessons).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(500)
    await vi.runAllTimersAsync()
    expect(mockCourseService.findLessons).toHaveBeenCalledTimes(2)
    let course = getTableContent(debugElement,"tbody tr td.description-cell");
    expect(course).length(1)
    expect(course[0]).toBe("Lesson 20")
  });

  afterEach(() => {
    vi.useRealTimers()
  })
})
