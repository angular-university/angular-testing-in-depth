import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardList } from './courses-card-list';
import { Course } from '../model/course';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { CoursesDialog } from '../courses-dialog/courses-dialog';
import { MOCK_COURSES } from '../testing/test-data';

describe('CoursesCardList', () => {
    let component: CoursesCardList;
    let fixture: ComponentFixture<CoursesCardList>;
    let loader: HarnessLoader;
    let rootLoader: HarnessLoader;


    const mockCourses: Course[] = MOCK_COURSES

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesCardList, CoursesDialog],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesCardList);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('courses', mockCourses);
        fixture.detectChanges();

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    });

    it('should display the course list', () => {
        const cards = fixture.debugElement.queryAll(By.css('.course-card'));
        expect(cards.length).toBe(2);
        expect(cards[0].nativeElement.textContent).toContain('Beginner Course');
    });

    it('should open the edit dialog when clicking the edit button', async () => {
        const editBtn = fixture.debugElement.query(By.css('button.btn:last-child'));
        editBtn.nativeElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const dialogForm = document.querySelector('.course-form');
        expect(dialogForm, 'The Course Dialog form should be visible in the DOM').toBeTruthy();

        const titleInput = dialogForm?.querySelector('input') as HTMLInputElement;
        expect(titleInput?.value).toBe('Beginner Course');
    });

    it('should emit courseEdited when dialog is closed with a result', async () => {
        const emitSpy = vi.spyOn(component.courseEdited, 'emit');

        component.editCourse(mockCourses[0]);

        const dialogService = TestBed.inject(Dialog);
        const openDialog = dialogService.openDialogs[0];

        openDialog.close(true);

        expect(emitSpy).toHaveBeenCalled();

    });
});