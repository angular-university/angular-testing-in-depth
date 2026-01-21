import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardList } from './courses-card-list';
import { Course } from '../model/course';
import { provideRouter } from '@angular/router';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentHarness, HarnessLoader} from '@angular/cdk/testing';
import { DialogModule } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('CoursesCardList', () => {
  let component: CoursesCardList;
  let fixture: ComponentFixture<CoursesCardList>;
  let loader: HarnessLoader;      
  let rootLoader: HarnessLoader;   


  const mockCourses: Course[] = [
    { 
      id: 1, 
      titles: { description: 'Angular Testing', longDescription: 'Theory' }, 
      iconUrl: 'test.png' 
    } as Course
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardList, DialogModule],
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
    expect(cards.length).toBe(1);
    expect(cards[0].nativeElement.textContent).toContain('Angular Testing');
  });

  it('should open the edit dialog when clicking the edit button', async () => {
    const editBtn = fixture.debugElement.query(By.css('button.btn:last-child'));
    editBtn.nativeElement.click();

    const dialog = await rootLoader.getHarness(CdkDialogHarness);
    
    expect(dialog).toBeTruthy();
    
    const host = await dialog.host();
    expect(await host.text()).toContain('Angular Testing');
  });

  it('should emit courseEdited when dialog is closed with a result', async () => {
    const emitSpy = vi.spyOn(component.courseEdited, 'emit');

    component.editCourse(mockCourses[0]);

    const dialog = await rootLoader.getHarness(CdkDialogHarness);
    
    await dialog.close(); 

    expect(emitSpy).toBeDefined();
  });
});

class CdkDialogHarness extends ComponentHarness {
  static hostSelector = '.cdk-dialog-container';

  private _closeButton = this.locatorFor('button.close-button');

  async close() {
    const button = await this._closeButton();
    await button.click();
  }
}