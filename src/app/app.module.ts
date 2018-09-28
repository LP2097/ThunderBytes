import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import {IonicStorageModule, Storage} from '@ionic/storage'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import {AngularFireModule} from "@angular/fire";
import {GoogleLoginComponent} from "../components/google-login/google-login";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {LoginPage} from "../pages/login/login";


var config = {
  apiKey: "AIzaSyCs6L9tlde9ZWw_3Fo4VNLE2wCSeb-8XeY",
  authDomain: "thunderbytes-28c25.firebaseapp.com",
  databaseURL: "https://thunderbytes-28c25.firebaseio.com",
  projectId: "thunderbytes-28c25",
  storageBucket: "thunderbytes-28c25.appspot.com",
  messagingSenderId: "890055678350"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    GoogleLoginComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    IonicStorageModule.forRoot(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GooglePlus

  ]
})
export class AppModule {}
