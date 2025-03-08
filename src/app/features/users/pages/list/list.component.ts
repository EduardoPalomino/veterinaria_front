import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html'
})
export class UserListComponent implements OnInit {
  users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'María López', email: 'maria@example.com', role: 'User' },
  ];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  roles = [
    { label: 'Administrador', value: 'Admin' },
    { label: 'Usuario', value: 'User' },
  ];

  userForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  applyGlobalFilter() {
    // Aquí debes implementar la lógica real de filtro
    console.log('Filtrando:', this.globalFilter);
  }

  openModal(mode: 'Nuevo' | 'Editar', user?: any) {
    this.modalTitle = `${mode} Usuario`;
    this.modalVisible = true;

    if (mode === 'Editar' && user) {
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset();
    }
  }

  saveUser() {
    if (this.userForm.valid) {
      const user = this.userForm.value;

      if (user.id) {
        // Editar
        this.users = this.users.map(u => u.id === user.id ? user : u);
      } else {
        // Nuevo
        user.id = this.users.length + 1;
        this.users.push(user);
      }

      this.modalVisible = false;
    }
  }

  deleteUser(user: any) {
    this.users = this.users.filter(u => u.id !== user.id);
  }
}
