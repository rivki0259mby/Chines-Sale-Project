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


    add(name:string | undefined , description :string |undefined){
    
    
      if(name && description){
        this.categorySrv.add({name :name ,description :description}).subscribe(date =>{
          this.list$ = this.categorySrv.getAll();
        });
      }
    }
    updateOpen(id :number | undefined ){
      if(!this.flagUpdate){
        this.currentId = id!;
      }
      this.flagUpdate = !this.flagUpdate;
    }
    update(name : string | undefined , description : string | undefined  ){
      console.log(name,description);
      
      this.categorySrv.getById(this.currentId).subscribe({
        next : (item) =>{
          if(!item) return;
          item.name = name;
          item.description = description;
          this.categorySrv.update(item).subscribe( c =>{
            this.list$ = this.categorySrv.getAll();  
      })
    },
    });
    }

    delete(id:number){
      this.categorySrv.delete(id).subscribe(d =>{
        this.list$ = this.categorySrv.getAll();
      });
    }

}
