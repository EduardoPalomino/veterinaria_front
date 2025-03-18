import {Rol} from "../app/features/rols/interfaces/rol.interface";
import {RolService} from "../app/features/rols/services/rol.service";

const fs = require('fs');
const path = require('path');

// 📌 Obtener argumentos de la consola
const args: string[] = process.argv.slice(2);
if (args.length < 1) {
  console.error('Uso: ts-node src/generadores-angular/generate-module.ts <nombreTabla> <campo1 campo2 ...>');
  process.exit(1);
}

const tableName: string = args[0];
const fields: string[] = args.slice(1).join(' ').split(/\s+/); // 🔥 Captura los argumentos aunque vengan sin comas

// 📌 Definir las carpetas y archivos
const baseDir: string = path.join(__dirname, `../app/features/${tableName}s`);
const folders: string[] = ['interfaces', 'models', 'pages/form', 'pages/list', 'services'];
const files: Record<string, string> = {
  [`interfaces/${tableName}.interface.ts`]: generateInterfaceContent(tableName, fields),
  [`models/${tableName}.model.ts`]: generateModelContent(tableName, fields),
  [`pages/form/form.component.html`]: ``,
  [`pages/form/form.component.ts`]: generateFormTsContent(tableName, fields),
  [`pages/list/list.component.html`]:generateListsHtmlContent(tableName, fields),
  [`pages/list/list.component.ts`]:generateListsContent(tableName, fields),
  [`pages/list/list.component.scss`]: ``,
  [`${tableName}s.module.ts`]: generateModuleContent(tableName),
  [`app-routing.module.ts`]: generateRoutingContent(tableName),
  [`services/${tableName}.service.ts`]: generateServiceContent(tableName),
};

// 📌 Crear carpetas
folders.forEach((folder: string) => {
  const dirPath: string = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${dirPath}`);
  }
});

// 📌 Crear archivos
Object.entries(files).forEach(([filePath, content]: [string, string]) => {
  const fullPath: string = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`📄 Archivo creado: ${fullPath}`);
  }
});

console.log('🎉 Módulo generado exitosamente.');

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateInterfaceContent(name: string, fields: string[]): string {
  const className: string = capitalize(name);
  const defaultFields: string[] = ['_id: string'];
  const fieldLines: string[] = fields.map((field: string) => `${field}: string`);
  const timestamps: string[] = ['created_at: string', 'updated_at: string'];

  return `export interface ${className} {\n  ${[...defaultFields, ...fieldLines, ...timestamps].join(';\n  ')};\n}`;
}

// 📌 Función para generar el contenido del modelo con los campos dinámicos
function generateModelContent(name: string, fields: string[]): string {
  const className: string = capitalize(name);

  // 🔥 Generar los campos del modelo con valores por defecto
  const fieldLines: string[] = fields.map((field: string) => `  ${field} = '';`);
  const timestamps: string[] = ['  created_at = \'\';', '  updated_at = \'\';'];

  return `import { ${className} } from '../interfaces/${name}.interface';

export class ${className}Model implements ${className} {
  _id = '';
${[...fieldLines, ...timestamps].join('\n')}

  constructor(data?: Partial<${className}>) {
    Object.assign(this, data);
  }
}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateServiceContent(name: string): string {
  const className = capitalize(name);
  const interfaceName = className; // Se asume que la interfaz tiene el mismo nombre
  const endpointVar = name.toUpperCase() + '_ENDPOINT';

  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ${interfaceName} } from '../interfaces/${name}.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ${className}Service {

  private apiUrl = \`\${environment.API_URL}\${environment.${endpointVar}}\`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<${interfaceName}[]> {
    return this.http.get<${interfaceName}[]>(this.apiUrl);
  }

  getById(id: string): Observable<${interfaceName}> {
    return this.http.get<${interfaceName}>(\`\${this.apiUrl}/\${id}\`);
  }

  create(data: ${interfaceName}): Observable<${interfaceName}> {
    return this.http.post<${interfaceName}>(\`\${this.apiUrl}/\create\`, data);
  }

  update(id: string, data: ${interfaceName}): Observable<${interfaceName}> {
    return this.http.put<${interfaceName}>(\`\${this.apiUrl}/update/\${id}\`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/delete/\${id}\`);
  }
}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateRoutingContent(name: string): string {
  const className = capitalize(name);
  return `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ${className}ListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: ${className}ListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${className}sRoutingModule { }`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateModuleContent(name: string): string {
  const className = capitalize(name);
  return `import { NgModule } from '@angular/core';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
// Componentes
import { ${className}ListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';

// Servicios
import { ${className}Service } from './services/${name}.service';

@NgModule({
  declarations: [
    ${className}ListComponent,
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
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    ${className}Service
  ],
  exports: [
    ${className}ListComponent,
    FormComponent
  ]
})
export class ${className}sModule {}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateListsContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const importServiceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `import { ${capitalize(cleanField)}Service } from '../../../${cleanField}s/services/${cleanField}.service';`;
    })
    .join(',\n      ');

  const importInterfaceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `import { ${capitalize(cleanField)} } from '../../../${cleanField}s/interfaces/${cleanField}.interface';`;
    })
    .join(',\n      ');

  const arrayInterfaceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `${cleanField}s: ${capitalize(cleanField)}[]= [];`;
    })
    .join(',\n      ');

  const selectedFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `selected_${cleanField}:{ label: string; value: string }[]=[];`;
    })
    .join(',\n      ');

  const constructorFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `,private ${cleanField}Service:${capitalize(cleanField)}Service`;
    })
    .join(',\n      ');

  const onInitFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `this.load${capitalize(cleanField)}s();`;
    })
    .join(',\n      ');


  const loadInitFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `load${capitalize(cleanField)}s() {
    this.${cleanField}Service.getAll().subscribe({
      next: (data) => {
        this.${cleanField}s = data;
        this.selected_${cleanField} = this.${cleanField}s.map(${cleanField} => ({
          label: ${cleanField}.descripcion,
          value: ${cleanField}._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar ${cleanField}s:', err);
      }
    });
  }`;
    })
    .join(',\n      ');


  const editPatchFields = fields
    .map(field => {
      return `${field}: ${name}.${field}`;
    })
    .join(',\n      ');

  return `import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ${className}Service } from '../../services/${name}.service';
${importServiceFields}
import { ${className} } from '../../interfaces/${name}.interface';
${importInterfaceFields}

@Component({
  selector: 'app-${name}-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ${className}ListComponent implements OnInit {
  ${name}s: ${className}[] = [];
  filtered${className}s: ${className}[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  ${selectedFields}
  ${name}Form: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private ${name}Service: ${className}Service,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  ${constructorFields}
  ) {
    this.${name}Form = this.fb.group({
      _id: [null],
      ${formFields}
    });
  }

  ngOnInit(): void {
    this.load${className}s();
    ${onInitFields}
  }

  load${className}s() {
    this.${name}Service.getAll().subscribe({
      next: (data) => {
        this.${name}s = data;
        this.filtered${className}s = [...this.${name}s];
      },
      error: (err) => {
        console.error('Error al cargar ${className}s:', err);
      }
    });
  }

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filtered${className}s = [...this.${name}s];
      return;
    }

    this.filtered${className}s = this.${name}s.filter((${name}) =>
        Object.values(${name}).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', ${name}?: ${className}) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = \`\${mode} ${className}\`;
    this.modalVisible = true;

    if (mode === 'Editar' && ${name}) {
      this.${name}Form.patchValue({
      ${editPatchFields}
      });
    } else {
      this.${name}Form.reset();
    }
  }

  confirmarEliminacion(${name}: ${className}) {
    console.log("Clic en eliminar:", ${name});
    this.confirmationService.confirm({
      message: \`¿Estás seguro de eliminar el ${className}: \${${name}.descripcion}?\`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.delete${className}(${name});
      }
    });
  }

delete${className}(${name}: ${className}) {
    this.${name}Service.delete(${name}._id).subscribe({
      next: () => {
        this.load${className}s();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: \`${className} "\${${name}.descripcion}" eliminado correctamente\`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el ${name}:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: \`No se pudo eliminar el ${name} "\${${name}.descripcion}"\`
        });
      }
    });
  }

  saveRegistro() {
    if (this.${name}Form.valid) { // Verifica que el formulario sea válido
      const ${name} = this.${name}Form.value; // Obtener valores del formulario

      console.log(JSON.stringify(${name}));
      ${name}._id === null && delete ${name}._id;
      console.log(JSON.stringify(${name}));

      if (this.mode === 'Nuevo') {
        this.${name}Service.create(${name}).subscribe({
          next: (data) => {
            console.log('${className} guardado con éxito:', data);
            this.${name}s.push(data); // Agregar el nuevo ${name} a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.load${className}s(); // Recargar lista de ${name}s
          },
          error: (err) => {
            console.error('Error al guardar el ${name}:', err);
          }
        });
      }else{
        this.${name}Service.update(${name}._id, ${name}).subscribe(() => {
          this.modalVisible = false;
          this.load${className}s();
        });
      }
    }
  }


}
`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateListsHtmlContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const tableHeaders = fields.map(
    (field) => `<th pSortableColumn="${field}">${capitalize(field)} <p-sortIcon field="${field}"></p-sortIcon></th>`
  ).join('\n          ');

  const tableRows = fields.map(
    (field) => `<td>{{ ${name}.${field} }}</td>`
  ).join('\n          ');


  const dropdownpComponentFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `<div class="p-field">
            <label for="${cleanField}_id">${capitalize(cleanField)}</label>
            <p-dropdown
              id="${cleanField}_id"
              [options]="selected_${cleanField}"
              formControlName="${cleanField}_id"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecciona un ${cleanField}">
            </p-dropdown>
          </div>`;
    })
    .join('\n      ');

  const elemenRows = fields.map(
    (field) => `<div class="p-field">
            <label for="${field}Input">${capitalize(field)}</label>
            <input pInputText id="${field}Input" formControlName="${field}" />
            <input pInputText id="_idInput" formControlName="_id" [hidden]="true"  />
          </div>`
  ).join('\n          ');

  return `<p-card>
  <ng-template pTemplate="title">Lista de ${className}</ng-template>
  <ng-template pTemplate="content">
    <p-toast></p-toast>

    <div class="p-datatable-header">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span class="p-input-icon-left w-full sm:w-20rem flex-order-1 sm:flex-order-0">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            placeholder="Búsqueda"
            class="p-inputtext p-component p-element w-full"
            [(ngModel)]="globalFilter"
            (ngModelChange)="applyGlobalFilter()">
        </span>

        <button pButton icon="pi pi-user-plus" label="Nuevo ${className}"
                class="p-button-sm p-button-outlined" (click)="openModal('Nuevo')">
        </button>
      </div>
    </div>

    <p-table #table [value]="filtered${className}s" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50, 100]"
             [globalFilterFields]="${JSON.stringify(fields).replace(/"/g, "'")}" [responsiveLayout]="'scroll'">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
          ${tableHeaders}
          <th>Acciones</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-${name} let-i="rowIndex">
        <tr>
          <td>{{ i + 1 }}</td>
          ${tableRows}
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-warning" (click)="openModal('Editar', ${name})"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="confirmarEliminacion(${name})"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
    <!-- Confirmation -->
    <p-confirmDialog></p-confirmDialog>
    <!-- Confirmation -->
    <!-- Modal -->
    <p-dialog [(visible)]="modalVisible" [header]="modalTitle" [modal]="true" [closable]="true" [style]="{width: '500px'}">
      <form [formGroup]="${name}Form" >
        <div class="p-fluid">
           ${elemenRows}
           ${dropdownpComponentFields}
        </div>
        <div class="p-dialog-footer">
          <button pButton type="button" label="Cancelar" class="p-button-text" (click)="modalVisible = false"></button>
          <button pButton type="button" label="Guardar" class="p-button-text" (click)="saveRegistro()"></button>
        </div>
      </form>
    </p-dialog>
    <!-- Modal -->
  </ng-template>
</p-card>
`;
}
// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateFormTsContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const tableHeaders = fields.map(
    (field) => `<th pSortableColumn="${field}">${capitalize(field)} <p-sortIcon field="${field}"></p-sortIcon></th>`
  ).join('\n          ');

  const tableRows = fields.map(
    (field) => `<td>{{ ${name}.${field} }}</td>`
  ).join('\n          ');

  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name}-form',
  templateUrl: './form.component.html'
})
export class FormComponent {}`;
}



// 📌 Función para capitalizar la primera letra
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
