import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { RouterTestingHarness } from '@angular/router/testing';
describe('App', () => {
  let harness: RouterTestingHarness;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes)
      ]
    }).compileComponents();
    harness = await RouterTestingHarness.create();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });

  it('should render the navigation toolbar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;

    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
  });
});