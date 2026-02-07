import { Component, inject, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PackageService } from '../../service/package';
import { packageModel } from '../../models/package.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Busket } from "../busket/busket";
import { Counter } from "../counter/counter";
import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-packege',
  imports: [CommonModule, FormsModule, CardModule, ButtonModule],
  templateUrl: './packege.html',
  styleUrl: './packege.css',
})
export class Packege {


  packageSrv: PackageService = inject(PackageService);
  basketSrv: BusketService = inject(BusketService);
  authSrv: AuthService = inject(AuthService);

  list$ = this.packageSrv.getAll();

  flagUpdate: boolean = false;
  componentName: string = ''
  draftPackage = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quentity: 0
  }
  amount: number = 0;
  basket: busketModel = {}
  user: any = {}



  ngOnInit() {
    this.user = localStorage.getItem('user');
    if (this.user) {
      this.user = JSON.parse(this.user);
      this.getByUserId(this.user.id);
    }
  }
  get totalItemInCart() {
    return this.basket.purchasePackages?.reduce((sum, pkg) => sum + pkg.quantity!, 0) || 0;
  }

  getQuentityInCart(packageId: number): number {

    if (!this.basket || !this.basket.purchasePackages) return 0;
    
    const item = this.basket.purchasePackages.find(p => p.packageId === packageId);

    return item ? (item.quantity || 0) : 0;
  }
  getByUserId(userId: string) {
    this.basketSrv.getByUserId(userId).subscribe((b: any) => {
      this.basket = b;
    });
  }

  openEdit(p: packageModel) {
    this.flagUpdate = true;
    this.draftPackage = {
      id: p.id ?? 0,
      name: p.name ?? '',
      description: p.description ?? '',
      price: p.price ?? 0,
      quentity: p.quentity ?? 0
    };
  }

  save() {
    if (!this.draftPackage.name) return;
    const id = this.draftPackage.id;
    if (this.flagUpdate) {
      this.packageSrv.update(id!, this.draftPackage).subscribe(() => {
        this.refreshList();
        this.resetForm();
      });
    } else {
      this.packageSrv.add(this.draftPackage).subscribe(() => {
        this.refreshList();
        this.resetForm();
      });
    }
  }

  refreshList() {
    this.list$ = this.packageSrv.getAll();
  }

  resetForm() {
    this.flagUpdate = false;
    this.draftPackage = { id: 0, name: '', description: '', price: 0, quentity: 0 };
  }

  delete(id: number) {
    this.packageSrv.delete(id).subscribe(() => {
      this.list$ = this.packageSrv.getAll();
    });
  }

  sortBy(sortBy?: string) {
    this.list$ = this.packageSrv.sortBy(sortBy);
  }

  addPackage(item: packageModel) {
    return this.basketSrv.addPackage(this.basket.id!, item.id!).subscribe(() => {
      this.getByUserId(this.user.id);
    });
  }

  deletePackage(packageId: number) {
    return this.basketSrv.deletePackage(this.basket.id!, packageId).subscribe(() => {
      this.getByUserId(this.user.id);
    });
  }
  // getPackageById(id:number){
  //   this.router.na
  // }

}
