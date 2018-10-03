import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";
import {HomePage} from "../home/home";
import {GooglePlus} from "@ionic-native/google-plus";
import {User} from "../../app/models/User";


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private navCrtl: NavController,
              private provider: Provider) {



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  userInfo;
  isUserLoggedIn;

  async googleLogin(){
     await this.provider.login();
    this.navCrtl.setRoot(HomePage,{
      'user': this.userInfo
    });
  }

  async EmailPasswordLogin(user:User){
   await  this.provider.loginWithEmailAndPassword(user);
    this.navCrtl.setRoot(HomePage,{
      'user': this.userInfo
    });
  }














}
