import { Routes } from '@angular/router';
import { Category } from './components/category/category';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Donor } from './components/donor/donor';
import { GetGiftById } from './components/gift/get-gift-by-id/get-gift-by-id';

import { PackageComponent } from './components/packege/packege';
import { PaymentComponent } from './components/payment/payment';
import { Home } from './components/home/home';
import { Winners } from './components/winners/winners';

export const routes: Routes = [
    // {path:'',component:},
    {path:'',component:Home},
    {path:'package',component:PackageComponent},
    {path:'category',component:Category},
    {path:'gift/:id',component:GetGiftById},
    {path:'donors',component:Donor},
    {path:'login',component:Login},
    {path:'register',component:Register},
    {path:'payment/:basketId',component:PaymentComponent},
    {path:'winners',component:Winners}
    
    
    
    
    // {path:'logout',}
];
