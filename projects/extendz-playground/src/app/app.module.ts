import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ExtRootModule } from "extendz/api";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //
    ExtRootModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
