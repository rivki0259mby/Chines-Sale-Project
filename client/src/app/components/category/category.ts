import { Component, inject } from '@angular/core';
import { CategoryService } from '../../service/category';
import { CategoryModel } from '../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
    categorySrv : CategoryService = inject(CategoryService)

    list$ = this.categorySrv.getAll();
    flagUpdate :boolean = false;
    itemUpdate: CategoryModel = {};
    currentId:number = 0;
    currentName:string = '';
    currentDescription:string = '';


    add(name:string | undefined , description :string |undefined){
    
    
      if(name && description){
        this.categorySrv.add({name :name ,description :description}).subscribe(date =>{
          this.list$ = this.categorySrv.getAll();
          
        });
      }
    }
    updateOpen(c : CategoryModel ){
      if(!this.flagUpdate){
        this.currentId = c.id!;
        this.currentName = c.name!;
        this.currentDescription = c.description!;
      }
      this.flagUpdate = !this.flagUpdate;
    }
    update(name : string | undefined , description : string | undefined  ){
      
          let item = {
            name,
            description 
          }
          
          this.categorySrv.update(this.currentId,item).subscribe( c =>{
          this.list$ = this.categorySrv.getAll();  
          this.updateOpen(item);
    
    })
    }

    delete(id:number){
      this.categorySrv.delete(id).subscribe(d =>{
        this.list$ = this.categorySrv.getAll();
      });
    }

}
