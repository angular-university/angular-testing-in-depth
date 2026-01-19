import { Component } from '@angular/core';
import {HelloWorld} from '../hello-world/hello-world';

@Component({
  selector: 'app-about-us',
  imports: [HelloWorld],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {

}
