import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {MachinePage} from "../machine/machine";
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;        // variabile che si riferisce alla homePage
  tab2Root = MachinePage;     // variabile che si riferisce alla pagina macchine
  tab3Root = SettingsPage;    // variabile che si riferisce alla pagine setting

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
