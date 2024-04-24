import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginInfo = {
    

    email: '',
  
    password: ''
  }
  registerinfo = {
    name: '',
    dob: '',
    email: '',
    dept: '',
    password: ''
  }

  constructor(private router: Router){}
  login(){
    const localStorageItem = localStorage.getItem('registerinfo');
    if (localStorageItem !== null) {
      this.registerinfo = JSON.parse(localStorageItem);
      console.log(this.registerinfo);
      if (typeof this.registerinfo === 'object' && this.registerinfo !== null) {
        if (this.registerinfo.email === this.loginInfo.email && this.registerinfo.password === this.loginInfo.password) {
          alert('Login Successfull');
          this.router.navigate(['home']);
        }
        else{
          alert('Invalid Credentials');
        }
      }
    }    
  }

  register(){
    this.router.navigate(['signup']);
  }
}
