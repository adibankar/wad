import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  registerinfo = {
    name: '',
    dob: '',
    email: '',
    dept: '',
    password: ''
  }

  // registerinfo = this.registerinfo.stringify()
  constructor(private router: Router){}
  register(){
    localStorage.setItem('registerinfo', JSON.stringify(this.registerinfo));
    alert('Registration Complete\nRedirecting to login page');

    this.router.navigate(['/login']);
  };
}
