import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SinglemachinePage} from "../singlemachine/singlemachine";

@IonicPage()
@Component({
  selector: 'page-machine',
  templateUrl: 'machine.html',
})
export class MachinePage {

  //--------------------- start variabili ---------------------
  data;
  list: number;
  //--------------------- end variabili ---------------------


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.list=0;            // imposto di default la lista 0 = tutti
  }

  /**
   * In base al macchinario scelto si apre una pagina con i grafici relativi alla macchina scelta
   * @param machine è un parametro che dove viene passato il nome del macchinario
   */
  readChart(machine){
    console.log(machine);
    this.navCtrl.push(SinglemachinePage, {
      'machine':machine,
    })
  }

  /**
   * funzione per il raggruppamento delle macchina in base alla selezione
   * @param list è un parametro che indica il raggruppamento delle macchine scelte dall'utente
   */
  onChange(list){
    switch (list){
      case 0:
        this.list=0;
        break;
      case 1:
        this.list=1;
        break;
      case 2:
        this.list=2;
        break;
      case 3:
        this.list=3;
        break;
    }
  }

}
