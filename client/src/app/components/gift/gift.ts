import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { GiftService } from '../../service/gift';
import { BusketService } from '../../service/busket';
import { DonorSevice } from '../../service/donor';
import { AuthService } from '../../auth/auth-service';
import { CategoryService } from '../../service/category';
import { giftModel } from '../../models/Gift.model';
import { busketModel } from '../../models/busket.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-gift',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    NzModalModule, NzGridModule, NzIconModule, NzButtonModule,
    NzInputModule, NzSelectModule, NzTooltipModule,
  ],
  templateUrl: './gift.html',
  styleUrl: './gift.css',
})
export class Gift implements OnInit, OnChanges {
  public authSrv = inject(AuthService);
  public giftSrv = inject(GiftService);
  private donorSrv = inject(DonorSevice);
  private basketSrv = inject(BusketService);
  private categorySrv = inject(CategoryService);

  @Input() categoryId: number = 0;

  list$ = this.giftSrv.getAll();
  categories$ = this.categorySrv.getAll();
  donors$ = this.donorSrv.getAll();
  errorMessage: string | null = null;

  basket: busketModel = { tickets: [] };
  showAdminForm: boolean = false;
  flagUpdate: boolean = false;

  draftGift: giftModel = {
    id: 0, name: '', description: '', price: 0, imageUrl: '',
    categoryId: 0, donorId: '', isDrown: false, tickets: []
  };

  ngOnInit() {
    this.refreshData();
    const userData = localStorage.getItem('user');
    if (userData) {
      this.loadBasket(JSON.parse(
        userData).id);

    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryId']) this.filterBySlot();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // מגבילים את הרוחב ל-800 פיקסלים בלבד
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // הפיכה ל-Base64 באיכות מופחתת (0.7 מתוך 1)
          this.draftGift.imageUrl = canvas.toDataURL('image/jpeg', 0.7);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  openAddModal() {
    this.resetForm();
    this.showAdminForm = true;
  }

  openEdit(g: giftModel) {
    this.errorMessage = null;
    this.flagUpdate = true;
    this.draftGift = { ...g };
    this.showAdminForm = true;
  }

  save() {
    const action$ = this.flagUpdate
      ? this.giftSrv.update(this.draftGift.id!, this.draftGift)
      : this.giftSrv.add(this.draftGift);

    action$.subscribe(() => {
      this.filterBySlot();
      this.showAdminForm = false;
      this.resetForm();
    });
    if (!this.draftGift.name || !this.draftGift.donorId) {
      this.errorMessage = 'שם הפרס ותורם הם שדות חובה';
      return;

    }
    this.errorMessage = null; // איפוס הודעות שגיאה קודמות
  }

  delete(id: number) {
    this.giftSrv.delete(id).subscribe(() => this.filterBySlot());
  }

  filterBySlot() {
    this.list$ = this.categoryId === 0
      ? this.giftSrv.getAll()
      : this.giftSrv.filter(undefined, undefined, undefined, this.categoryId);
  }

  loadBasket(userId: string) {
    this.basketSrv.getByUserId(userId).subscribe(b => this.basket = b);
  }

  addGift(giftId: number) {
    if (this.basket.id) {
      this.basketSrv.addTicket({ giftId, purchaseId: this.basket.id, quantity: 1 })
        .subscribe(res => this.basket = res);
    }
  }

  resetForm() {
    this.flagUpdate = false;
    this.draftGift = { id: 0, name: '', description: '', price: 0, imageUrl: '', categoryId: 0, donorId: '', isDrown: false, tickets: [] };
  }

  refreshData() {
    this.categories$ = this.categorySrv.getAll();
    this.donors$ = this.donorSrv.getAll();
  }

  lottery(gift: giftModel) {
    this.giftSrv.lottery(gift).pipe(
      catchError(err => {
        this.errorMessage = "ההגרלה נכשלה - לא נמצאו קונים עבור המתנה .";
        return of(null);
      })
    ).subscribe(() => {
      this.refreshData();
    });
  }
}
