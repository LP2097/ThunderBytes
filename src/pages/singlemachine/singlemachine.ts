import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as $ from 'jquery'
import * as moment from 'moment';
import {influxData} from "../../app/models/InfluxData";

@IonicPage()
@Component({
  selector: 'page-singlemachine',
  templateUrl: 'singlemachine.html',
})
export class SinglemachinePage {

  //variabili grafico a linee
  lineChartData:Array<any> = [{data: []}];
  lineChartLabels:Array<any> = [];
  lineChartLegend:boolean = false;
  lineChartType:string = 'line';
  lineChartOptions:any = {
    responsive: true
  };
  lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  titleGraphs: string = "\uf043";
  Subtitle: string;
  percentMeasure: string = "20";
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

  //refresh dei dati controlla se era su somma o media ed esegue il refresh
  doRefresh(refresher){
    if(this.val == "somma")
      this.sumData();
    else if(this.val == "media")
      this.mediaData();

    if (refresher != 0)
      refresher.complete();
  }

  //all'avvio della pagina nasconde il grafico con relativi bottoni e scritte
  ionViewDidLoad(){

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

    //di default seleziono i minuti e mostro i grafici
    this.time = "minuti";
    this.sumData()

  }

  //al click salva il periodo selezionato e richiama la funziona della somma quella predefinita
  segmentChangedTime(selectTime){
    this.time = selectTime.value;
    this.sumData();
  }

  //svuoto gli array del grafico
  initialvarGraphs(){
    this.lineChartData = [{data: []}];
    this.lineChartLabels.length = null;
  }


  //funzione al click del segmento somma o media situato in basso
  segmentChangedVal(selectVal){
    if(selectVal.value == "somma"){
      this.val = "somma";
      this.sumData();
    }
    else if(selectVal.value == "media"){
      this.mediaData();
      this.val = "media";
    }
  }

  //funzione che gestisde le api riguardanti la somma
  sumData(){
    $(".circleProcess, .controlVal, #consumationFR, .graphs").show();              // mostro il grafico e scritte nascoste prima

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
      switch (this.nameMachine) {
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
      switch (this.nameMachine) {
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
    //this.Subtitle = (percent: number) : string => { return percent + " %"}
  }

  getMachine(machine){
     this.http.get<influxData[]>("http://localhost:5000/" + this.apiMachine) //equivalente del metodo get di ajax
       .timeout(3000)
       .subscribe(data =>{
          if(machine == "Forno riscaldamento"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
            console.log(data[0].umidita);
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].umidita);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Forno raffredamento"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].umidita);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Forno cottura"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.amperometro = data[0].amperometro;
            this.umidita = data[0].umidita;
            this.ventilatore = data[0].ventilatore;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].umidita);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Verniciatura Prima Mano"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].umidita);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Verniciatura Secconda Mano"){
            this.temperature = data[0].temperatura;
            this.timeData = data[0].time;
            this.umidita = data[0].umidita;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].umidita);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Motore uno"){
            this.rpm = data[0].rpm;
            this.timeData = data[0].time;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].rpm);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }else if(machine == "Motore due"){
            this.rpm = data[0].rpm;
            this.timeData = data[0].time;
            this.calcPercent();

            this.initialvarGraphs();
            for(let i=0; i<data.length; i++){
              // TODO creare uno switch per ogni sezione in base a dove mi trovo nei sensori
              this.lineChartData[0].data.push(data[i].rpm);
              this.lineChartLabels.push(moment(data[i].time).format('h:mm'));
            }
          }
          console.log(this.umidita);
           this.updatePercentMeasure();
           this.createCircle();
         },
         error =>{
           alert("errore in fase di chiamata");
         })
   }

   calcPercent(){
    switch(this.time){
     case "minuti":
         this.umidita = (this.umidita/7000)*100;
         this.temperature = (this.temperature/7000)*100;
         this.ventilatore = (this.ventilatore/70000)*100;
         this.rpm = (this.rpm/70000)*100;
         this.amperometro = (this.amperometro/11200)*100;
         break;
     case "ora":
        this.umidita = (this.umidita/42000)*100;
        this.temperature = (this.temperature/42000)*100;
        this.ventilatore = (this.ventilatore/4200000)*100;
        this.rpm = (this.rpm/4200000)*100;
        this.amperometro = (this.amperometro/67200)*100;
        break;
     case "giorno":
       this.umidita = (this.umidita/1008000)*100;
       this.temperature = (this.temperature/1008000)*100;
       this.ventilatore = (this.ventilatore/100800000)*100;
       this.rpm = (this.rpm/100800000)*100;
       this.amperometro = (this.amperometro/1612800)*100;
       break;
     }
   }

  updatePercentMeasure(){
    //variabile che cambia in base al passaggio da un sensore all'altro
    this.percentMeasure = this.umidita.toFixed(2);
  }


  //funzioni al click sul grafico
  chartClicked(e:any):void {
    console.log(e);
  }

  chartHovered(e:any):void {
    console.log(e);
  }
}
