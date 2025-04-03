import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../../rols/services/rol.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { Rol } from '../../../rols/interfaces/rol.interface';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  rols: Rol[]= [];
  selected_rol:{ label: string; value: string }[]=[];
  usuarioForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private usuarioService: UsuarioService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  ,private rolService:RolService
  ) {
    this.usuarioForm = this.fb.group({
      _id: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      rol_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
     this.loadRols();
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data.map(usuario=>({
          ...usuario,
          rol_nombre:this.rols.find(rol=>rol._id==usuario.rol_id)?.descripcion||'Sin Rol'
        }));
        this.filteredUsuarios = [...this.usuarios];
      },
      error: (err) => {
        console.error('Error al cargar Usuarios:', err);
      }
    });
  }

loadRols() {
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.rols = data;
        this.selected_rol = this.rols.map(rol => ({
          label: rol.descripcion,
          value: rol._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar rols:', err);
      }
    });
  }

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filteredUsuarios = [...this.usuarios];
      return;
    }

    this.filteredUsuarios = this.usuarios.filter((usuario) =>
        Object.values(usuario).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', usuario?: Usuario) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = `${mode} Usuario`;
    this.modalVisible = true;

    if (mode === 'Editar' && usuario) {
      this.usuarioForm.patchValue({
       _id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: usuario.password,
      rol_id: usuario.rol_id
      });
    } else {
      this.usuarioForm.reset();
    }
  }

  confirmarEliminacion(usuario: Usuario) {
    console.log("Clic en eliminar:", usuario);
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Usuario: ${usuario.nombre}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteUsuario(usuario);
      }
    });
  }

deleteUsuario(usuario: Usuario) {
    this.usuarioService.delete(usuario._id).subscribe({
      next: () => {
        this.loadUsuarios();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Usuario "${usuario.nombre}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el usuario:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el usuario "${usuario.nombre}"`
        });
      }
    });
  }

  saveRegistro() {
    if (this.usuarioForm.valid) { // Verifica que el formulario sea válido
      const usuario = this.usuarioForm.value; // Obtener valores del formulario

      console.log(JSON.stringify(usuario));
      usuario._id === null && delete usuario._id;
      console.log(JSON.stringify(usuario));

      if (this.mode === 'Nuevo') {
        this.usuarioService.create(usuario).subscribe({
          next: (data) => {
            console.log('Usuario guardado con éxito:', data);
            this.usuarios.push(data); // Agregar el nuevo usuario a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.loadUsuarios(); // Recargar lista de usuarios
            this.mensajeConfirmacion(usuario,"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el usuario:', err);
          }
        });
      }else{
        this.usuarioService.update(usuario._id, usuario).subscribe(() => {
          this.modalVisible = false;
          this.loadUsuarios();
          this.mensajeConfirmacion(usuario,"Registro Actualizado");
        });
      }
    }
  }

  onChangeRol(e: any) {
        this.usuarioForm.patchValue({rol_id:e.value});
       } 

  mensajeConfirmacion(usuario: Usuario,mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: ` Usuario "${usuario.nombre}" ${mensaje}`
    });
  }

}
