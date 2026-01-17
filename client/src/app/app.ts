import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Category } from './components/category/category';
import { Register } from './components/register/register';
import { Login } from './components/login/login';



@Component({
  selector: 'app-root',
  imports: [Category,Register,Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
