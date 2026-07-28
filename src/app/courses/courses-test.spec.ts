import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Courses} from './courses';
import {DebugElement, inject} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {CoursesService} from '../services/courses.service';
import {MOCK_COURSES} from '../testing/testing-data';
import {By} from '@angular/platform-browser';

describe("Testing courses",()=>{
  let fixture:ComponentFixture<Courses>
  let component:Courses;
  let debugElement:DebugElement
  let httpMock:HttpTestingController

  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      imports:[
        Courses
      ],
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        CoursesService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(Courses)
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges()
  })

  it("should add beginner course",async ()=>{
    const httpCall = httpMock.expectOne("/api/courses")
    httpCall.flush({
      payload:MOCK_COURSES
    });
    await fixture.whenStable()
    fixture.detectChanges()
    const titles = debugElement.queryAll(By.css(".course-card .card-header"));
    expect(titles).toHaveLength(1)
    const beginnerEl = titles[0].nativeElement as HTMLElement
    expect(beginnerEl.textContent).toContain("Beginner Course")
  })

  it("should show advance course when clicked",async ()=>{
    const req = httpMock.expectOne("/api/courses")
    req.flush({
      payload:MOCK_COURSES
    })
    await fixture.whenStable()
    const advanceButton = debugElement.query(By.css(".tab-link:last-child"))
    expect(advanceButton).toBeDefined()
    advanceButton.nativeElement.click()
    fixture.detectChanges()
    const titles = debugElement.queryAll(By.css(".course-card .card-header"));
    expect(titles).toHaveLength(1)
    const beginnerEl = titles[0].nativeElement as HTMLElement
    expect(beginnerEl.textContent).toContain("Advanced Course")
  })

  afterEach(()=>{
    httpMock.verify()
  })
})
