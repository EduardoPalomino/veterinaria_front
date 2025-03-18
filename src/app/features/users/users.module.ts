import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

// PrimeNG Services
import { MessageService } from 'primeng/api';

// Componentes
import { UserListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

// Servicios
import { UserService } from './services/user.service';
import { RolService } from '../rols/services/rol.service';
@NgModule({
  declarations: [
    UserListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule
  ],
  providers: [
    MessageService,
    UserService,
    RolService
  ],
  exports: [
    UserListComponent,
    FormComponent
  ]
})
export class UsersModule {}
