import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GooglePlus} from "@ionic-native/google-plus";
import {User} from "../../app/models/User";
import {AngularFireAuth} from "@angular/fire/auth";


/*
  Generated class for the Provider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Provider {

  constructor(public http: HttpClient, private googlePlus: GooglePlus, private afAuth: AngularFireAuth) {
    console.log('Hello Provider Provider');
  }

  user;
  displayName=null;
  email=null;
  familyName=null;
  userId=null;
  givenName=null;
  imageUrl=null;
  isLoggedIn=null;

  async login(): Promise<any> {
    await this.googlePlus.login({})
      .then(res => {
        console.log('dopo'+res);
        this.user=res;
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;

        this.isLoggedIn = true;
        return res;
      })
      .catch(err => console.error(err));
  }



  logout() {
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";
        this.user="";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
  }


  async loginWithEmailAndPassword(user: User) {
    await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log('dopo'+res);
        this.user=res;

        this.isLoggedIn = true;

      })
      .catch(err => console.error(err));
  }

}
