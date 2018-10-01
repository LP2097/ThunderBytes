import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";
import {HomePage} from "../home/home";
import {GooglePlus} from "@ionic-native/google-plus";

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














}
