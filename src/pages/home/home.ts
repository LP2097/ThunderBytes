import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user;
  photo;

  constructor(public navCtrl: NavController, public navParams: NavParams, private provider: Provider) {

   this.getUserInfo();
  }


  googleLogout(){
    this.provider.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  async getUserInfo(){

      this.user= await this.provider.displayName;
      this.photo= await this.provider.imageUrl;


    console.log("user home: "+this.user)
  }
}
