import { Injectable, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})

export class BluetoothService {
  peripheral : any;
  stateMessage: string  = "Press start to start recording";
  statusMessage : string;
  interval: any;
  csv: any;
  headerRow: String[] ;
  writeInterval: any;
  now: number;
  buttonState = "start";
  started: boolean;
  timeelapsed : string = "Time: 0s";
  modal : any;
  fps : string = "FPS: 0"
  counter: any = 0;
  fpsInterval: any;
  showConnectionStatus: boolean;
  acceleration: any = { };
  SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
  CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"

  constructor(
    
    private ble: BLE,
    private ngZone: NgZone,
    // private file : File,
    // private socialSharing : SocialSharing,
    public modalController : ModalController,
    // private route: ActivatedRoute,

  ) {

    this.initializeValues();
    this.createCSV();
   }


   private initializeValues(){
    this.acceleration = {
      "x" : 0 ,
      "y" : 0 ,
      "z" : 0
    };
   }

   private setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }


   private connectToBluetoothDevice(){
    this.ble.connect(this.peripheral.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
   }


   private onConnected(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
      console.log("Starting notification")
      this.ble.startNotification(this.peripheral.id , this.SERVICE ,"6e400003-b5a3-f393-e0a9-e50e24dcca9e").subscribe(
        (message) => {
          if(this.started == true){
            this.showConnectionStatus = false;
            var converted = new Float32Array(message , 0 ,3)
            // this.fps++;
            this.acceleration = {
              "x" : converted[0].toFixed(3).replace(/['"]+/g , ''),
              "y" : converted[1].toFixed(3).replace(/['"]+/g , ''),
              "z" : converted[2].toFixed(3).replace(/['"]+/g , ''),
            }
          }else{
            this.showConnectionStatus = true;
          }
        },
        e => console.error(e)
      )
      this.readMessagesage()
    });
  }



  private readMessagesage() {

    this.started = true;
    this.buttonState = "stop";
    this.now = Date.now();
    this.writeInterval = setInterval(() => {
      this.csv.push([this.acceleration.x , this.acceleration.y , this.acceleration.z , Date.now() - this.now]);
      this.counter++;
      this.timeelapsed = `Time: ${((Date.now() - this.now) / 1000).toFixed(1)}s`
      // console.log(this.acceleration);
    } , 10)


    this.fpsInterval = setInterval(() => {
      this.fps = `FPS: ${this.counter}`
      this.counter = 0;
    } , 1000)
    

    
  }

  private onDeviceDisconnected(peripheral){
    console.warn("Disconected from" , peripheral)
  }
  

  createCSV(){
    this.csv = [];
    this.headerRow = ["X" , "Y" , "Z" , "Time (ms)"];
    console.log(this.csv)
  }


  getCurrentAcceleration(){
    return this.acceleration;
  }

  connectToDevice(device){
    return new Promise((resolve , reject) => {
      this.peripheral = device;
      console.log(this.peripheral);
      this.connectToBluetoothDevice();
      resolve();
    })
  }

  dummyTest(){
    console.log("ImplementedThis");
  }
}


