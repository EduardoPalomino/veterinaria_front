import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-list',
  templateUrl: './list.component.html'
})
export class LoginListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  loginForm: FormGroup;
  mode:string='';
  nombre: string = '';
  password: string = '';

  constructor(
  private fb: FormBuilder,
  private router: Router
  ) {
    this.loginForm = this.fb.group({
      _id: [null],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }
  login(){
    console.log("estas haciendo login");
    this.router.navigate(['dashboards']);
  }
}
