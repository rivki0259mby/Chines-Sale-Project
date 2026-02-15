import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG & Zorro Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { ticketModel } from '../../models/ticket.model';

@Component({
  selector: 'app-busket',
  standalone: true,
  imports: [
    FormsModule, CommonModule, CardModule, ButtonModule,
    ProgressBarModule, DividerModule, ScrollPanelModule, NzDrawerModule
  ],
  templateUrl: './busket.html',
  styleUrl: './busket.css',
})
export class Busket implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  basketSrv: BusketService = inject(BusketService);
  router = inject(Router);
  basket: busketModel = {};
  user: any = {};

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.getByUserId(this.user.id);
    }
    this.basketSrv.busketUpdate.subscribe(() => {
      if (this.user.id && this.user) this.getByUserId(this.user.id);
    }
    );
  }

  getByUserId(userId: string) {
    this.basketSrv.getByUserId(userId).subscribe(b => this.basket = b);
  }

  closeSidebar() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  addPackageToCart(packageId: number) {
    if (!this.basket.id) return;
    this.basketSrv.addPackage(this.basket.id, packageId).subscribe(res => this.basket = res);
  }

  removePackageFromCart(packageId: number) {
    if (!this.basket.id) return;
    this.basketSrv.deletePackage(this.basket.id, packageId).subscribe(res => this.basket = res);
  }

  addGift(giftId: number) {
    const ticket = { giftId, purchaseId: this.basket.id, quantity: 1 };
    this.basketSrv.addTicket(ticket).subscribe(res => this.basket = res);
  }

  deleteGift(ticketId: number) {
    this.basketSrv.deleteTicket(this.basket.id!, ticketId).subscribe(res => this.basket = res);
  }

  get usedTickets(): number { return this.basket.tickets?.length || 0; }
 
  get totalPurchasedTickets(): number {
    return this.basket.purchasePackages?.reduce((sum, pp) =>
      sum + ((pp.quantity || 0) * (pp.package?.quentity || 0)), 0) || 0;
  }

  get remainingTickets(): number {
    const rem = this.totalPurchasedTickets - this.usedTickets;
    return rem > 0 ? rem : 0;
  }

  get groupTickets(): any[] {
    if (!this.basket?.tickets) return [];
    const groups = this.basket.tickets.reduce((acc: any, ticket: ticketModel) => {
      const id = ticket.giftId || 'unknown';
      if (!acc[id]) acc[id] = { ...ticket, totalTickets: 0 };
      acc[id].totalTickets++;
      return acc;
    }, {});
    return Object.values(groups);
  }

}
