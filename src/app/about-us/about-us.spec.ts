import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUs } from './about-us';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('AboutUs', () => {
  let component: AboutUs;
  let fixture: ComponentFixture<AboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUs],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main "Welcome!" header using the correct class', () => {
    const header = fixture.nativeElement.querySelector('.about-us-header');

    expect(header).toBeTruthy();
    expect(header?.textContent).toContain(component.title());
  });

  it('should display the sub-header text', () => {
    const subHeader = fixture.nativeElement.querySelector('.about-us-sub-header');

    expect(subHeader).toBeTruthy();
    expect(subHeader?.textContent).toContain(component.subTitle());
  });

  it('should render the hero image with the correct src and alt text', () => {
    const img = fixture.debugElement.query(By.css('.hero-image-wrapper img')).nativeElement;

    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/angular-testing-in-depth-hero.png');
    expect(img.getAttribute('alt')).toBe('Angular Testing In Depth Hero');
  });
  
  it('should display the page description paragraph', () => {
    const pageDescription = fixture.nativeElement.querySelector('.description');

    expect(pageDescription).toBeTruthy();
    expect(pageDescription?.textContent).toContain(component.pageDescription());
  });
});