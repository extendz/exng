import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EntityMeta, EntityMetaResponse, ExtRootConfig, EXT_ROOT_CONFIG } from 'extendz/core';
import { EntityMetaService } from 'extendz/service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'ext-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  @Output() select: EventEmitter<EntityMeta> = new EventEmitter<EntityMeta>();

  models$: Observable<EntityMetaResponse>;

  constructor(
    @Inject(EXT_ROOT_CONFIG) private rootConfig: ExtRootConfig,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private entityMetaService: EntityMetaService
  ) {
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(this.rootConfig.svgIconSet);
    this.iconRegistry.addSvgIconSetInNamespace('api-root', url);
  }

  ngOnInit(): void {
    this.models$ = this.entityMetaService.getRoot().pipe(
      map((d) => {
        const filtterd = {};
        Object.entries(d).forEach(([key, value]) => {
          if (!value.hidden) filtterd[key] = value;
        });
        return filtterd;
      })
    );
  }

  onSelect(modelName: string) {
    this.entityMetaService
      .getModel(modelName)
      .pipe(take(1))
      .subscribe((model) => this.select.emit(model));
  }
}
