import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { NgDatabaseFactory } from "./core/factory/database-factory";
import { IdGenerator } from "./core/id-generator/id-generator";
import { IndexedDB, NG_DATABASES } from "./core/indexed-db.service";
import { NgDataBase } from "./core/types/database.type";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [IndexedDB, NgDatabaseFactory, IdGenerator],
})
export class IndexedDBModule {
  static forRoot(
    databases: NgDataBase[] = []
  ): ModuleWithProviders<IndexedDBModule> {
    return {
      ngModule: IndexedDBModule,
      providers: [{ provide: NG_DATABASES, useValue: databases }],
    };
  }
}
