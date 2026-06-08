import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'toolbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './toolbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './toolbar.scss',
})
export class Toolbar {

}
