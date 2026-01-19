import { Component, inject } from '@angular/core';
import { DonorSevice } from '../../service/donor';
import { CommonModule } from '@angular/common';
import { donorModel } from '../../models/donor.model';

@Component({
  selector: 'app-donor',
  imports: [CommonModule],
  templateUrl: './donor.html',
  styleUrl: './donor.css',
})
export class Donor {

  donorSrv: DonorSevice = inject(DonorSevice);

  flagUpdate: boolean = false;
  itemUpdate: donorModel = {};
  currentId: string = '';
  currentName: string = '';
  currentPhoneNumber: string = '';
  currentEmail: string = '';
  currentLogoUrl: string = '';
  
  list$ = this.donorSrv.getAll();

  add(Id:string | undefined , name:string | undefined , phoneNumber :string | undefined , email :string | undefined , logoUrl :string | undefined){
    
    
    if(Id && name && phoneNumber && email ){
        this.donorSrv.add({id:Id , name :name ,phoneNumber:phoneNumber , email:email , logoUrl:logoUrl}).subscribe(date =>{
          this.list$ = this.donorSrv.getAll();
        });
    }
  }

  updateOpen(d : donorModel){
    if(!this.flagUpdate){
      this.currentId = d.id!;
      this.currentName = d.name!;
      this.currentPhoneNumber = d.phoneNumber!;
      this.currentEmail = d.email!;
      this.currentLogoUrl = d.logoUrl!;
    }
    this.flagUpdate = !this.flagUpdate;
  }
  
  update(id : string | undefined , name : string | undefined , phoneNumber : string | undefined , email : string | undefined , logoUrl : string | undefined  ){
    let donor = {
      id,
      name,
      phoneNumber,
      email,
      logoUrl
    }
    this.donorSrv.update(this.currentId,donor).subscribe( d =>{
      this.list$ = this.donorSrv.getAll();  
      this.updateOpen(donor);
    })
  }

  delete(id:string){
    this.donorSrv.delete(id).subscribe(d =>{
      this.list$ = this.donorSrv.getAll();
    })
  }


}
