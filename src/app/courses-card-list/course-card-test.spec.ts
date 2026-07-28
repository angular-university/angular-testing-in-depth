import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardList} from './courses-card-list';
import {DebugElement} from '@angular/core';
import {MOCK_COURSES} from '../testing/testing-data';
import {By} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';

describe("Test cards functionality",()=>{
  let fixture:ComponentFixture<CoursesCardList>
  let debugElement:DebugElement;
  let component:CoursesCardList;

  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      imports:[
        CoursesCardList
      ],
      providers:[
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(CoursesCardList)
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.componentRef.setInput("courses",MOCK_COURSES)
    fixture.detectChanges()
  })


  it("Course should have courses rendeered",()=>{
    const course = debugElement.queryAll(By.css('.course-card .card-header'))
    const beginner = course[0].nativeElement
    expect(beginner.textContent).toBe('Beginner Course')
  })

  it("it should display message when empty course list",()=>{
    fixture.componentRef.setInput("courses",[])
    fixture.detectChanges()
    const noCourse = debugElement.query(By.css(".no-courses"))
    expect(noCourse.nativeElement.textContent).toContain("No courses found.")
  })

  it("should display dialog when clicked on edit button",()=>{
    const editButton = debugElement.query(By.css(".edit-btn"))
    editButton.nativeElement.click()
    fixture.detectChanges()
    const form = document.querySelectorAll(".course-form");
    expect(form, "The edit course form should be visible.").toBeTruthy();
  })
})

