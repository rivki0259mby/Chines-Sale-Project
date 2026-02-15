import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- NG-ZORRO Modules ---
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message'; // להודעות הצלחה/שגיאה

// --- Services & Models ---
import { PackageService } from '../../service/package';
import { BusketService } from '../../service/busket';
import { AuthService } from '../../auth/auth-service';
import { packageModel } from '../../models/package.model';
import { busketModel } from '../../models/busket.model';

@Component({
  selector: 'app-package',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzSelectModule,
    NzModalModule,
    NzInputModule,
    NzInputNumberModule,
    NzIconModule
  ],
  templateUrl: './packege.html',
  styleUrl: './packege.css'
})
export class PackageComponent implements OnInit {
  // השמקות (Injections)
  private packageSrv = inject(PackageService);
  private basketSrv = inject(BusketService);
  public authSrv = inject(AuthService);
  private message = inject(NzMessageService);

  // נתונים
  list$ = this.packageSrv.getAll(); // Observable של רשימת החבילות
  basket: busketModel = {};
  user: any = null;

  // מצב המודאל (הדיב הצף למנהל)
  isVisible = false;
  isSaving = false;
  flagUpdate = false;

  // אובייקט זמני לעריכה/הוספה
  draftPackage: packageModel = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quentity: 0
  };

  // אפשרויות מיון
  selectedSort: string = 'price_desc';
  sortOptions = [
    { label: 'מחיר: מהגבוה לנמוך', value: 'price_desc' },
    { label: 'הכי פופולרי', value: 'most_purchased' }
  ];

  ngOnInit(): void {
    this.loadUserAndBasket();
  }

 
  private loadUserAndBasket(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchBasket();
    }
  }

  private fetchBasket(): void {
    if (this.user?.id) {
      this.basketSrv.getByUserId(this.user.id).subscribe({
        next: (res) => this.basket = res,
        error: () => this.message.error('שגיאה בטעינת סל הקניות')
      });
    }
  }

  
  showModal(): void {
    this.resetForm();
    this.isVisible = true;
  }

  openEdit(p: packageModel): void {
    this.flagUpdate = true;
    this.draftPackage = { ...p }; 
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetForm();
  }

  save(): void {
    if (!this.draftPackage.name || this.draftPackage.price! <= 0) {
      this.message.warning('נא למלא שם ומחיר תקינים');
      return;
    }

    this.isSaving = true;
    const request = this.flagUpdate
      ? this.packageSrv.update(this.draftPackage.id!, this.draftPackage)
      : this.packageSrv.add(this.draftPackage);

    request.subscribe({
      next: () => {
        this.message.success(this.flagUpdate ? 'החבילה עודכנה' : 'החבילה נוספה בהצלחה');
        this.refreshList();
        this.isVisible = false;
        this.isSaving = false;
        this.resetForm();
      },
      error: () => {
        this.message.error('פעולה נכשלה');
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    this.flagUpdate = false;
    this.draftPackage = { id: 0, name: '', description: '', price: 0, quentity: 0 };
  }

  
  delete(id: number): void {
    this.packageSrv.delete(id).subscribe(() => {
      this.message.info('החבילה הוסרה');
      this.refreshList();
    });
  }

  refreshList(): void {
    this.list$ = this.packageSrv.getAll();
  }

  sortBy(val: string): void {
    this.list$ = this.packageSrv.sortBy(val);
  }

  addPackage(pkg: packageModel): void {
    if (!this.authSrv.isLoggedIn()) {
      this.message.warning('יש להתחבר כדי להוסיף לסל');
      return;
    }
    this.basketSrv.addPackage(this.basket.id!, pkg.id!).subscribe(() => {
      this.fetchBasket();
    });
  }

  deletePackage(pkgId: number): void {
    this.basketSrv.deletePackage(this.basket.id!, pkgId).subscribe(() => {
      this.fetchBasket();
    });
  }

  getQuentityInCart(packageId: number): number {
    if (!this.basket?.purchasePackages) return 0;
    const found = this.basket.purchasePackages.find(p => p.packageId === packageId);
    return found ? (found.quantity || 0) : 0;
  }
}