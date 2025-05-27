import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'menuTop',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Menu_topListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  menu_topForm: FormGroup;
  mode:string='';
  constructor(
  private fb: FormBuilder,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private router: Router
  ) {
    this.menu_topForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }
  redirectToMenu(link:String) {
    console.log("click en boton");
    this.router.navigate([link]);
  }
}
