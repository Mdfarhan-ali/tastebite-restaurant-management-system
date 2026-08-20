import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerLayout } from "./layouts/customer-layout/customer-layout";
import { Home } from "./features/home/pages/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('tastebite-frontend');
}
