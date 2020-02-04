import { BLE } from '@ionic-native/ble/ngx';
import { Component, NgZone } from '@angular/core';
// import { DetailPage } from '../detail/detail';
import { Http } from "@angular/http"
// import * as papa from "pap
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx"
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {
  
  devices: any[] = [];
  statusMessage: string;
  headerRow: any;
  csv: any[];

  constructor(private ble: BLE,
              private ngZone: NgZone,
              private http : Http,
              private router : Router,
              private androidPermissions: AndroidPermissions,
              private toastCtrl : ToastController) { 
  }


  //TODO: Check when bluetooth is closed!
  
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
    
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.INTERNAL_STORAGE);
    this.createMyCSV();
  }
  
  scan() {
    
    //TODO REMOVE THAT
    // let device : any = {"name" : "Test"};
    // this.router.navigate(['/details' , {device : JSON.stringify(device)}])

    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    // this.ble.scan([], 10).subscribe(
    //   device => this.onDeviceDiscovered(device), 
    //   error => this.scanError(error)
    // );



    this.ble.scan([], 10).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );


    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      if(device.name != undefined){
        this.devices.push(device);
      }
    });
  }

  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    let toast = await this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + ' selected');
    // this.navCtrl.push(DetailPage, {
    //   device: device
    // });


    this.router.navigate(['/details' , {device : JSON.stringify(device)}])
  }


  createMyCSV(){
    this.csv = [];
    this.headerRow = ["Name" , "Surname" , "Age" , "Index"];
    for(var i = 0 ; i < 10; i++){
        var localArray = [];
        
        localArray.push("Konstantinos");
        localArray.push("Tsirakos");
        localArray.push("18");
        localArray.push(i);

        this.csv.push(localArray);
    }

    console.log(this.csv)
    // this.downloadCSV();

  }

  getCsv(){
    this.http.get("assets/test.csv").subscribe(
      data => this.extractData(data),
      err => console.error(err)
    );
  }


  private extractData(data){
    // let csvData = data["_body"] || "";
    // // let parsed = papa.parse(csvData).data;

    // console.log(parsed);
    // let headerRow = parsed[0];
 
    // parsed.splice(0, 1);
    // let csvDataWhole = parsed;

    // this.headerRow = headerRow;
    // this.csv = csvDataWhole;
    
  }
 
  downloadCSV() {
  //  let csv = papa.unparse({
  //     fields: this.headerRow,
  //     data: this.csv
  //   });
 
  //   console.log(csv);
  //   // Dummy implementation for Desktop download purpose
  //   var blob = new Blob([csv]);
  //   var a = window.document.createElement("a");
  //   a.href = window.URL.createObjectURL(blob);
  //   a.download = "my.csv";
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  }
 
}
