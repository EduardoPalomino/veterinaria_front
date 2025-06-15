import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class DashboardListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode:string='';

  // ---  DATOS DE SESSION ------
  nombre:any  = sessionStorage.getItem('nombre');
  email:any  = sessionStorage.getItem('email');
  rol_id:any  = sessionStorage.getItem('rol_id');
  // ---  DATOS DE SESSION ------

  constructor(
  private fb: FormBuilder,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private router: Router
  ) {

  }

  ngOnInit(): void {
  }
  redirectToMenu(link:String) {
    console.log("click en boton");
    this.router.navigate([link]);
  }
}
