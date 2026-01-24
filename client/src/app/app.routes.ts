import { Routes } from '@angular/router';
import { Category } from './components/category/category';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Donor } from './components/donor/donor';
import { GetGiftById } from './components/gift/get-gift-by-id/get-gift-by-id';

export const routes: Routes = [
    // {path:'',component:},
    {path:'category',component:Category},
    {path:'gift/:id',component:GetGiftById},
    {path:'donors',component:Donor},
    {path:'login',component:Login},
    {path:'register',component:Register},
    
    
    
    // {path:'logout',}
];
