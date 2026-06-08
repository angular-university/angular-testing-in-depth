import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'hello-world',
  imports: [],
  templateUrl: './hello-world.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hello-world.scss',
})
export class HelloWorld {

  message = 'Hello World!';

}
