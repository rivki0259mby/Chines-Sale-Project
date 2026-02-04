import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BusketService } from '../../service/busket';
import { busketModel } from '../../models/busket.model';
import { packageModel } from '../../models/package.model';
import { ticketModel } from '../../models/ticket.model';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {

  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<void>();


}
