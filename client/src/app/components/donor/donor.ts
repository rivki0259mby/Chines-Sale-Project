import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// NG-ZORRO
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { DonorSevice } from '../../service/donor';
import { donorModel } from '../../models/donor.model';
@Component({
  selector: 'app-donor',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzTableModule, NzModalModule,
    NzButtonModule, NzIconModule, NzInputModule, NzAvatarModule,
    NzPageHeaderModule, NzTooltipModule
  ],
  templateUrl: './donor.html',
  styleUrl: './donor.css'
})
export class Donor implements OnInit {
  private donorSrv = inject(DonorSevice);

  list$ = this.donorSrv.getAll();
  loading = false;
  showModal = false;
  flagUpdate = false;

  draftDonor: donorModel = {id:'', name: '', email: '', logoUrl: '', phoneNumber: '' };

  ngOnInit() { }

  openAddModal() {
    this.flagUpdate = false;
    this.draftDonor = { name: '', email: '', logoUrl: '' };
    this.showModal = true;
  }

  openEdit(donor: any) {
    this.flagUpdate = true;
    this.draftDonor = { ...donor };
    this.showModal = true;
  }

  save() {
    const action$ = this.flagUpdate
      ? this.donorSrv.update(this.draftDonor.id!, this.draftDonor)
      : this.donorSrv.add(this.draftDonor);

    action$.subscribe(() => {
      this.list$ = this.donorSrv.getAll();
      this.showModal = false;
    });
  }

  delete(id: string) {
    this.donorSrv.delete(id).subscribe(() => {
      this.list$ = this.donorSrv.getAll();
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.draftDonor.logoUrl = e.target.result; 
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.flagUpdate = false;
    this.draftDonor = { id: '', name: '', email: '', logoUrl: '' };
  }

}
