import { Component,Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'moduleBoxTitle',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class Module_box_titleListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  @Input() title: string = '';

  module_box_titleForm: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder
  ) {
    this.module_box_titleForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

}
