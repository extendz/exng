import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action, TabAction, ToolbarConfig } from 'extendz/core';

@Component({
  selector: 'ext-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() config: ToolbarConfig;
  @Output() action = new EventEmitter<TabAction>();

  showAdd?: boolean = true;
  fab: TabAction;
  color?: string;

  constructor() {}

  ngOnInit(): void {
    this.fab = this.config?.fab;
    this.color = this.config?.fab?.color;
  }
}
