import { Component, signal } from '@angular/core';
import {HelloWorld} from '../hello-world/hello-world';

@Component({
  selector: 'about-us',
  imports: [
    HelloWorld
  ],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  title = signal('Welcome!');
  subTitle = signal('Welcome to Angular Testing Course');
  pageDescription = signal('Master the art of high-quality software delivery. This course provides a deep dive into the Angular testing ecosystem, covering everything from basic unit tests to complex integration scenarios with Signals and modern routing. Our goal is to empower developers to write maintainable, bug-free code with confidence.');
}
