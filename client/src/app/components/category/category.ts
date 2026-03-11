import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

// NG-ZORRO Imports
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { CategoryService } from '../../service/category';
import { CategoryModel } from '../../models/category.model';
import { AuthService } from '../../auth/auth-service';
import { Gift } from '../gift/gift';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Gift,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  // Dependency Injection
  private categorySrv = inject(CategoryService);
  public authService = inject(AuthService);

  // Properties
  list$ = this.categorySrv.getAll();
  categoryId: number = 0;
  showAdminForm: boolean = false;
  flagUpdate: boolean = false;

  draftCategory: CategoryModel = {
    id: 0,
    name: '',
    description: ''
  };

  ngOnInit(): void {
    this.refreshList();
  }

  getById(id: number) {
    this.categoryId = id;
  }

  openEdit(c: CategoryModel) {
    this.flagUpdate = true;
    this.draftCategory = { ...c };
    this.showAdminForm = true;
  }

  save() {
    if (!this.draftCategory.name) return;

    const action$ = this.flagUpdate
      ? this.categorySrv.update(this.draftCategory.id!, this.draftCategory)
      : this.categorySrv.add(this.draftCategory);

    action$.subscribe(() => {
      this.refreshList();
      this.resetForm();
      this.showAdminForm = false;
    });
  }

  delete(id: number) {
    this.categorySrv.delete(id).subscribe(() => this.refreshList());
  }

  refreshList() {
    this.list$ = this.categorySrv.getAll();
  }

  resetForm() {
    this.flagUpdate = false;
    this.draftCategory = { id: 0, name: '', description: '' };
  }
}
