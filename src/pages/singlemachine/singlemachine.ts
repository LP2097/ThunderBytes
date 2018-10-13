import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as $ from 'jquery'
import {VerniciaturaPrimaMano} from "../../app/models/CharData";

/**
 * Generated class for the SinglemachinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-singlemachine',
  templateUrl: 'singlemachine.html',
})
export class SinglemachinePage {

  public lineChartData;


  titleGraphs: string = "\uf043";
  Subtitle: string;
  percentMeasure: string = "20";
  unitMeasure: string = " l";
  nameMachine: string;
  name;
  timeSelect: string;

  //variabili dei sensori posizionati
  amperometro: any;
  umidita: any;
  ventilatore: any;
  temperature: any;
  timeData: any;
  rpm: any;

  //primo API mostra la media e la seleziono con questa variabile
  val: string = "somma";

  //salvo la data selezionata cosi se cambio da somma a media resta salvata
  time: string;

  //stringa sul nome della macchina per la richiesta api
  apiMachine: string;


  options = {
    min: 0,
    title: 'Umidità'
  };
  max = 100;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public http: HttpClient) {
    this.nameMachine = navParams.get('machine');

  }

  //all'avvio della pagina nasconde il grafico con relativi bottoni e scritte
  ionViewDidLoad(){
      $(".circleProcess, .controlVal, #consumationFR, .loader").hide();

      if(this.nameMachine == "FornoRiscaldamento"){
      this.nameMachine = "Forno riscaldamento";
    }else if(this.nameMachine == "FornoRaffredamento"){
      this.nameMachine = "Forno raffredamento";
    }else if(this.nameMachine == "FornoCottura"){
      this.nameMachine = "Forno cottura";
    }else if(this.nameMachine == "vPrimaMano"){
      this.nameMachine = "Verniciatura Prima Mano";
    }else if(this.nameMachine == "vSeccondaMano"){
      this.nameMachine = "Verniciatura Secconda Mano";
    }else if(this.nameMachine == "motoreUno"){
      this.nameMachine = "Motore uno";
    }else if(this.nameMachine == "motoreDue") {
      this.nameMachine = "Motore due";
    }
  }

  //al click salva il periodo selezionato e richiama la funziona della somma quella predefinita
  segmentChangedTime(selectTime){
    this.time = selectTime.value;
    this.sumData(this.nameMachine);
  }


  //funzione al click del segmento somma o media situato in basso
  segmentChangedVal(selectVal){
    if(selectVal.value == "somma")
      this.sumData();
    else if(selectVal.value == "media")
      this.mediaData();

  }

  //funzione che gestisde le api riguardanti la somma
  async sumData(nameMachine){
    $(".circleProcess, .controlVal, #consumationFR").show();              // mostro il grafico e scritte nascoste prima
    if(this.time == "ora") {
      this.timeSelect = "nell'ultima ora";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimaOra";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimaOra";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimaOra";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimaOra";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimaOra";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimaOra";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimaOra";
          break;

      }
    }else if(this.time == "minuti"){
      this.timeSelect = "nell'ultimi dieci minuti";
      switch (nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimiMinuti";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimiMinuti";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimiMinuti";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimiMinuti";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimiMinuti";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimiMinuti";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimiMinuti";
          break;

      }
    }else if(this.time == "giorno"){
      this.timeSelect = "nell'ultimo giorno";
      switch (nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "sumFornoRiscaldamentoUltimoGiorno";
          break;

        case "Forno raffredamento":
          this.apiMachine = "sumFornoRaffredamentoUltimoGiorno";
          break;

        case "Forno cottura":
          this.apiMachine = "sumFornoCotturaUltimoGiorno";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "sumvPrimaManoUltimoGiorno";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "sumvSeccondaManoUltimoGiorno";
          break;

        case "Motore uno":
          this.apiMachine = "sumMotoreUnoUltimoGiorno";
          break;

        case "Motore due":
          this.apiMachine = "sumMotoreDueUltimoGiorno";
          break;

      }
    }
    this.getMachine(this.nameMachine);
  }

  mediaData(){
    if(this.time == "ora") {
      this.timeSelect = "nell'ultima ora";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimaOra";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimaOra";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimaOra";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimaOra";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimaOra";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimaOra";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimaOra";
          break;

      }
    }else if(this.time == "minuti"){
      this.timeSelect = "nell'ultimi dieci minuti";
      console.log(this.nameMachine);
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimiMinuti";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimiMinuti";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimiMinuti";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimiMinuti";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimiMinuti";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimiMinuti";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimiMinuti";
          break;

      }
    }else if(this.time == "giorno"){
      this.timeSelect = "nell'ultimo giorno";
      switch (this.nameMachine) {
        case "Forno riscaldamento":
          this.apiMachine = "meanFornoRiscaldamentoUltimoGiorno";
          break;

        case "Forno raffredamento":
          this.apiMachine = "meanFornoRaffredamentoUltimoGiorno";
          break;

        case "Forno cottura":
          this.apiMachine = "meanFornoCotturaUltimoGiorno";
          break;

        case "Verniciatura Prima Mano":
          this.apiMachine = "meanvPrimaManoUltimoGiorno";
          break;

        case "Verniciatura Secconda Mano":
          this.apiMachine = "meanvSeccondaManoUltimoGiorno";
          break;

        case "Motore uno":
          this.apiMachine = "meanMotoreUnoUltimoGiorno";
          break;

        case "Motore due":
          this.apiMachine = "meanMotoreDueUltimoGiorno";
          break;

      }
    }
    this.getMachine(this.nameMachine);
  }


  createCircle(){
    this.Subtitle = (percent: number) : string => { return percent + this.unitMeasure}
  }


  getMachine(machine){
    //utilizzare machine per fare chiamate api
     this.http.get("http://localhost:5000/" + this.apiMachine) //equivalente del metodo get di ajax
       .timeout(3000)
       .subscribe(data =>{
         console.log(data);
          if(machine == "Forno riscaldamento"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
          }else if(machine == "Forno raffredamento"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
          }else if(machine == "Forno cottura"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
          }else if(machine == "Verniciatura Prima Mano"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;
          }else if(machine == "Verniciatura Secconda Mano"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;
          }else if(machine == "Motore uno"){
            this.rpm = data[0].rpm;
            this.timeData = data[0].time;
          }else if(machine == "Motore due"){
            this.rpm = data[0].rpm;
            this.timeData = data[0].time;
          }
           this.updatePercentMeasure();
           this.createCircle();
         },
         error =>{
           alert("errore in fase di chiamata");
         })
   }

  updatePercentMeasure(){
    //variabile che cambia in base al passaggio da un sensore all'altro
    this.percentMeasure = this.umidita;
  }

   /*doRefresh(){
     console.log("chiamata a get Machine");
     this.temperature=[];
     this.time=[];
     this.getMachine(this.machine);
   }*/

}
