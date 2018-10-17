import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Provider} from "../../providers/provider/provider";
import {HomePage} from "../home/home";
import {User} from "../../app/models/User";
import {AngularFireAuth} from "@angular/fire/auth";
import {TabsPage} from "../tabs/tabs";


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
              private provider: Provider,
              private alertCtrl: AlertController,
              private afAuth: AngularFireAuth) {



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  userInfo;
  isUserLoggedIn;

  async googleLogin(){
    await this.provider.login();
    if (this.provider.isLoggedIn) {
      this.navCrtl.setRoot(TabsPage, {
        'user': this.userInfo,
      });
      this.provider.autentication = 'google';
    }

  }

  async EmailPasswordLogin(user:User){
    console.log("parametri di user"+JSON.stringify(user.email));
    if(user.email && user.password) {
      console.log("Provider login");
      await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log('dopo'+JSON.stringify(res));
          this.provider.user=res;
          this.provider.email=user.email;
          console.log("e:"+user.email);
          this.provider.isLoggedIn = true;
          this.navToHomePage();
        })
        .catch(err => this.errorLogin());
    } else {
      this.errorLogin()
    }
  }


  errorLogin() {
    let alert = this.alertCtrl.create({
      title: 'Errore',
      message: 'Email o Password errati ',
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    alert.present();
  }

  navToHomePage(){
    this.navCrtl.setRoot(TabsPage, {
      'user': this.userInfo,
    });
    this.provider.autentication='email';
  }




}
