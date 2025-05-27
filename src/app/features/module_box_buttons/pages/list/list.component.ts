import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'moduleBoxButton',
  templateUrl: './list.component.html'
})
export class Module_box_buttonListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  module_box_buttonForm: FormGroup;
  mode:string='';
  constructor(
  private fb: FormBuilder
  ) {
    this.module_box_buttonForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }
  ngOnInit(): void {

  }


}
