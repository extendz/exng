import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RootComponent } from "./root.component";

@NgModule({
  declarations: [RootComponent],
  exports: [RootComponent],
  imports: [CommonModule]
})
export class ExtRootModule {}
