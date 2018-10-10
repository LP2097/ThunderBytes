import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import {IonicStorageModule} from '@ionic/storage'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import { CacheModule } from "ionic-cache";
import {LoginPage} from "../pages/login/login";
import { Provider } from '../providers/provider/provider';
import {HttpModule} from "@angular/http";
import { HttpClientModule} from "@angular/common/http";
import {SettingsPage} from "../pages/settings/settings";
import { JustgageModule } from 'angular2-justgage';
import { ChartsModule } from 'ng2-charts';
import {MachinePage} from "../pages/machine/machine";
import {GaugeModule} from "angular-gauge";
import {SinglemachinePage} from "../pages/singlemachine/singlemachine";
import {SplashPage} from "../pages/splash/splash";





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
    SettingsPage,
    MachinePage,
    SinglemachinePage,
    SplashPage


  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    IonicStorageModule.forRoot(),
    CacheModule.forRoot(),
    AngularFireAuthModule,
    HttpModule,
    HttpClientModule,
    JustgageModule,
    ChartsModule,
    GaugeModule.forRoot(),





  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SettingsPage,
    MachinePage,
    SinglemachinePage,
    SplashPage


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    Provider,


  ]
})
export class AppModule {}
