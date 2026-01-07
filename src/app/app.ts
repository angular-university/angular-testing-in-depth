import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './toolbar/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-testing-in-depth');
}
