import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  roles = [
    { label: 'Administrador', value: 'Admin' },
    { label: 'Usuario', value: 'User' },
  ];

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  applyGlobalFilter() {
    console.log('Filtrando:', this.globalFilter);
    // Aquí puedes agregar lógica para filtrar la lista de usuarios en el frontend
  }

  openModal(mode: 'Nuevo' | 'Editar', user?: User) {
    console.log(mode);
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
        // Editar usuario en el backend
        this.userService.update(user.id, user).subscribe(() => {
          this.loadUsers(); // Recargar lista después de editar
        });
      } else {
        // Crear usuario en el backend
        this.userService.create(user).subscribe(() => {
          this.loadUsers(); // Recargar lista después de crear
        });
      }

      this.modalVisible = false;
    }
  }

  deleteUser(user: User) {
    if (confirm(`¿Seguro que quieres eliminar a ${user.nombre}?`)) {
      this.userService.delete(user._id).subscribe(() => {
        this.loadUsers(); // Recargar lista después de eliminar
      });
    }
  }
}
