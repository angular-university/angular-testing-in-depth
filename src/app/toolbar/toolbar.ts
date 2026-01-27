import { Component,signal,output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'toolbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  activeTab = signal<'courses' | 'about'>('courses');
  
  tabChanged = output<'courses' | 'about'>();

  select(tab: 'courses' | 'about') {
    this.activeTab.set(tab);
    this.tabChanged.emit(tab);
  }
}
