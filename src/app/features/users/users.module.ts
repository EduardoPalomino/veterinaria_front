import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { UserListComponent } from './pages/list/list.component'; // Asegúrate de que este nombre sea correcto
import { FormComponent } from './pages/form/form.component';

@NgModule({
  declarations: [
    UserListComponent, // Usa el nombre correcto del componente exportado
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule
  ],
  providers: [
    MessageService
  ],
  exports: [
    UserListComponent, // Exporta los componentes si los necesitas fuera de este módulo
    FormComponent
  ]
})
export class UsersModule {}
