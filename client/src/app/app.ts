import { Component, signal } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
=======
import { RouterOutlet } from '@angular/router';
import { Category } from './components/category/category';
import { Register } from './components/register/register';
import { Login } from './components/login/login';

>>>>>>> f978e9afe15bc038fa62762b353524bb4b9c5c0f


@Component({
  selector: 'app-root',
<<<<<<< HEAD
  imports: [RouterOutlet,RouterLink,RouterModule],
=======
  imports: [Category,Register,Login],
>>>>>>> f978e9afe15bc038fa62762b353524bb4b9c5c0f
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
