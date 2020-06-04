import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public userId = '';
  public firstName = '';
  public lastName = '';

  constructor(
    private storage: Storage,
    private router: Router,
  ) { }

  submit() {
    console.log('got it');

    this.storage.set('userId', this.userId);
    this.storage.set('firstName', this.firstName);
    this.storage.set('lastName', this.lastName);

    this.router.navigateByUrl('/home');
  }

  disableSubmitBtn() {
    return this.userId === '' || this.firstName === '' || this.lastName === '';
  }

}

