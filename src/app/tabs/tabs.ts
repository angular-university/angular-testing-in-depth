import { Component, input, output, model } from '@angular/core';
import { TabData } from './tabs.model';
import { CourseCategory } from '../model/course';
@Component({
  selector: 'tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class TabsComponent {
  tabs = input.required<TabData[]>();

  value = model.required<string>();

  tabChanged = output<CourseCategory>();

  selectTab(val: any) {
    this.value.set(val);
    this.tabChanged.emit(val);
  }
}
