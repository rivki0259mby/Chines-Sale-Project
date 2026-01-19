import { Routes } from '@angular/router';
import { Category } from './components/category/category';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Donor } from './components/donor/donor';

export const routes: Routes = [
    // {path:'',component:},
    {path:'category',component:Category},
    {path:'donors',component:Donor},
    {path:'login',component:Login},
    {path:'register',component:Register}
    
    // {path:'logout',}
];
