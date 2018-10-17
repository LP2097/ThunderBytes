import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";
import {UserInfo} from "../../app/models/UserInfo";
import {LoginPage} from "../login/login";
import {App} from 'ionic-angular';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  autentication;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private app:App,
              private provider: Provider) {
    console.log("mail"+this.provider.email);

    this.getUserInfo();


  }

  user:UserInfo = new UserInfo();

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }



  getUserInfo(){
    let autentication= this.provider.autentication;
    console.log("autenticazione: "+autentication );
    if(autentication=='google'){
      this.user = this.provider.user;
    console.log(this.user)}
    else{
      this.user.givenName="Guest";
      this.user.imageUrl="../../assets/imgs/guest.png";
      this.user.familyName="-";
      console.log(this.provider.user.email);
      this.user.email=this.provider.email;

    }

  }

  logout() {
    this.provider.logout();
    this.app.getRootNav().setRoot(LoginPage);
  }
}
