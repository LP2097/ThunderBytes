import { Component } from '@angular/core';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';

import { GooglePlus } from '@ionic-native/google-plus';
import {NavController, NavParams, Platform} from 'ionic-angular';
import {HomePage} from "../../pages/home/home";
import {Storage} from "@ionic/storage";




@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {

  user: Observable<firebase.User>;
  user1;

  constructor(private afAuth: AngularFireAuth,
              private gplus: GooglePlus,
              private platform: Platform,
              private navCtrl: NavController,
              private storage: Storage) {

    this.getUserInfo();

  }

  /// Our login Methods will go here


  async nativeGoogleLogin(): Promise<void> {
    try {

      const gplusUser = await this.gplus.login({
        'webClientId': '890055678350-r6u12dqibd51uugojugojuflb42q8qvh.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })
       await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
        this.getUserInfo();
        this.navCtrl.push(HomePage);
    } catch(err) {
      console.log(err)
    }
  }


  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      this.getUserInfo();
      this.storage.set('username', this.user1.displayName);
      this.storage.set('userPhoto',this.user1.photoURL);
      this.navCtrl.setRoot(HomePage,{
        username: this.user1.displayName,
        userPhoto: this.user1.photoURL
      });
    } catch(err) {
      console.log(err)
    }

  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.getUserInfo();
  }

  getUserInfo(){
    this.user = this.afAuth.authState;
    this.user1 = firebase.auth().currentUser;
    console.log(JSON.stringify("USER: "+JSON.stringify(this.user)))
    console.log(JSON.stringify("USER: "+JSON.stringify(this.user1)))
  }
}
