import { Component, inject } from '@angular/core';
import { CategoryService } from '../../service/category';
import { CategoryModel } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Gift } from '../gift/gift';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, Gift, RouterModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  categorySrv: CategoryService = inject(CategoryService)

  list$ = this.categorySrv.getAll();
  flagUpdate: boolean = false;
  itemUpdate: CategoryModel = {};
  categoryId ?: number = 0;

  draftCategory: CategoryModel = {
    id: 0,
    name: '',
    description: ''
  }
  openEdit(d: CategoryModel) {
    this.flagUpdate = true;
    this.draftCategory = {
      id: d.id ?? 0,
      name: d.name ?? '',
      description: d.description ?? ''
    };
  }
  save() {
    if (!this.draftCategory.name || !this.draftCategory.description) return;
    const id = this.draftCategory.id;
    if (this.flagUpdate) {
      this.categorySrv.update(id!, this.draftCategory).subscribe(d => {
        this.refreshList();
        this.resetForm();
      });
    }
    else {
      this.categorySrv.add(this.draftCategory).subscribe(d => {
        this.refreshList();
        this.resetForm();
      });
    }

  }

  getById(id:number){
    if(id == 0 ){
      this.categoryId = 0;
    }
    else{
    this.categorySrv.getById(id).subscribe(c =>{      
      this.categoryId = c.id;    
    });}
  }
  refreshList() {
    this.list$ = this.categorySrv.getAll();
  }
  resetForm() {
    this.flagUpdate = false;
    this.draftCategory = { id: 0, name: '', description: ''};
  }



  delete(id: number) {
    this.categorySrv.delete(id).subscribe(d => {
      this.list$ = this.categorySrv.getAll();
    });
  }

}
