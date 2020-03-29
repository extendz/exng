import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityMeta } from 'extendz/core';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent {
  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  public onSelect(model: EntityMeta) {
    this.router.navigate([model.name], { relativeTo: this.activeRoute });
  } // onSelect()
  
} //class
