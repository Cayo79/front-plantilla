import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FormsRoutes } from './forms.routing';
import { BasicComponent } from './form-basic/basic.component';
import { FormvalComponent } from './form-validation/form-validation.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(FormsRoutes), FormsModule, NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    BasicComponent,
    FormvalComponent,
    MultiselectComponent
  ]
})
export class FormModule { }
