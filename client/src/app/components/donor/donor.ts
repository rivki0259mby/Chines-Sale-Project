import { Component, inject } from '@angular/core';
import { DonorSevice } from '../../service/donor';
import { CommonModule } from '@angular/common';
import { donorModel } from '../../models/donor.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donor',
  imports: [CommonModule,FormsModule],
  templateUrl: './donor.html',
  styleUrl: './donor.css',
})
export class Donor {

  donorSrv: DonorSevice = inject(DonorSevice);

  flagUpdate: boolean = false;
  itemUpdate: donorModel = {};
 
  list$ = this.donorSrv.getAll();

  draftDonor: donorModel = {
    id: '',
    name: '',
    phoneNumber: '',
    email: '',
    logoUrl: ''
  };

  
 

  add(Id:string | undefined , name:string | undefined , phoneNumber :string | undefined , email :string | undefined , logoUrl :string | undefined){
    
    
    if(Id && name && phoneNumber && email ){
        this.donorSrv.add({id:Id , name :name ,phoneNumber:phoneNumber , email:email , logoUrl:logoUrl}).subscribe(date =>{
          this.list$ = this.donorSrv.getAll();
        });
    }
  }

  openEdit(d : donorModel){
    this.flagUpdate = true;
    this.draftDonor = { 
      id: d.id ?? '',
      name: d.name ?? '',
      phoneNumber: d.phoneNumber ?? '',
      email: d.email ?? '',
      logoUrl: d.logoUrl ?? ''
    };
  }
  save(){
    if(!this.draftDonor.name || !this.draftDonor.email) return;
    const id = this.draftDonor.id;
    if(this.flagUpdate){
      this.donorSrv.update(id!, this.draftDonor).subscribe( d =>{
       this.refreshList();
       this.resetForm();
      });
    }
    else{
      this.donorSrv.add(this.draftDonor).subscribe( d =>{
       this.refreshList();
       this.resetForm();
      });
    }
      
      }
  
  refreshList(){
    this.list$ = this.donorSrv.getAll();
  }
  resetForm(){
    this.flagUpdate = false;
    this.draftDonor = { id: '', name: '', phoneNumber: '', email: '', logoUrl: '' };
  }

  delete(id:string){
    this.donorSrv.delete(id).subscribe(d =>{
      this.list$ = this.donorSrv.getAll();
    })
  }

  filter(name?:string , email?:string , giftId?:number){
    this.list$ = this.donorSrv.filter(name,email,giftId);

  }

}