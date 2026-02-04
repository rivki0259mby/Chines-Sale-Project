import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Busket } from "./components/busket/busket";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterModule, Busket],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
