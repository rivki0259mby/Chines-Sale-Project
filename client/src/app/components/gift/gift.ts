import { Component, inject } from '@angular/core';
import { GiftService } from '../../service/gift';
import { giftModel } from '../../models/Gift.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Input,OnChanges,SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { AuthService } from '../../auth/auth-service';
import { ticketModel } from '../../models/ticket.model';

@Component({
  selector: 'app-gift',
  imports: [CommonModule,FormsModule],
  templateUrl: './gift.html',
  styleUrl: './gift.css',
})
export class Gift  {
  
  router = inject(Router);
  authSrv:AuthService = inject(AuthService)
  giftSrv: GiftService = inject(GiftService)
  basketSrv:BusketService = inject(BusketService);

  list$ = this.giftSrv.getAll();
  flagUpdate: boolean = false;
  @Input() categoryId ?: number = 0;
  basket : busketModel = {}
  user:any = {}

  draftGift: giftModel = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: 0,
    donorId: '',
    winnerId: '',
    isDrown: false
  }
  ngOnInit(){
    this.user = localStorage.getItem('user')
    if(this.user){
      this.user = JSON.parse(this.user)
      this.getByUserId(this.user.id)
    }
  }
  getByUserId(userId:string){
    this.basketSrv.getByUserId(userId).subscribe(b =>{
      this.basket = b;

    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    
    if (changes['categoryId']) {
      if(this.categoryId==0) {
        this.list$ = this.giftSrv.getAll();
      }
      if(this.categoryId && this.categoryId > 0){
      const newCategoryId = changes['categoryId'].currentValue;
      this.filter(undefined, undefined, undefined,newCategoryId);
      } else {
        this.refreshList();
      }
    }
  }
  openEdit(g: giftModel) {
    this.flagUpdate = true;
    this.draftGift = {
      id: g.id ?? 0,
      name: g.name ?? '',
      description: g.description ?? '',
      price: g.price ?? 0,
      imageUrl: g.imageUrl ?? '',
      categoryId: g.categoryId ?? 0,
      donorId: g.donorId ?? '',
      winnerId: g.winnerId ?? undefined,
      isDrown: g.isDrown ?? false
    };
  }
  save() {
   
    
    if (!this.draftGift.name ) return;
    const id = this.draftGift.id;
    if (this.flagUpdate) {
      this.giftSrv.update(id!, this.draftGift).subscribe(d => {
        this.refreshList();
        this.resetForm();
      });
    }
    else {
      this.giftSrv.add(this.draftGift).subscribe(d => {
        this.refreshList();
        this.resetForm();
      });
    }

  }

  refreshList() {
    this.list$ = this.giftSrv.getAll();
  }
  resetForm() {
    this.flagUpdate = false;
    this.draftGift = { id: 0, name: '', description: '', price: 0, imageUrl: '', categoryId: 0, donorId: '', winnerId: '', isDrown: false };
  }
  getGiftById(id:number){
    this.router.navigate([`/gift`,id]);

  }



  delete(id: number) {
    this.giftSrv.delete(id).subscribe(d => {
      this.list$ = this.giftSrv.getAll();
    });
  }
  filter(name?:string, donorId?:string ,buyerCount?:number, categoryId?:number ){
    this.list$ = this.giftSrv.filter(name,donorId,buyerCount,categoryId);

  }
  lottery(giftId:number){
    this.giftSrv.lottery(giftId).subscribe(d =>{
      this.refreshList();
    });
  }
  addGift(giftId : number){
    const ticket = {
      giftId: giftId,
      purchaseId: this.basket.id,
      quantity:1
      
    }
    
    return this.basketSrv.addTicket(ticket).subscribe((updateBusket:busketModel)=>{
      this.basket = updateBusket;
    });
  }
  deleteGift(giftId:number){
    return this.basketSrv.deleteTicket(this.basket.id!,giftId).subscribe((updateBusket:busketModel)=>{
      this.basket = updateBusket;
    });
  }



}
