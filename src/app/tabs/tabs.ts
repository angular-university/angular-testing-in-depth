import { Component, input, output, model } from '@angular/core';
@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class TabsComponent {
  tabs = input.required<{label: string, value: any}[]>();
  
  value = model.required<any>();

  tabChanged = output<any>();

  selectTab(val: any) {
    this.value.set(val);
    this.tabChanged.emit(val);
  }
}