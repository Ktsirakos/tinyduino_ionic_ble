import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as papa from "papaparse"
import { ThrowStmt } from '@angular/compiler';
import { ModalController } from '@ionic/angular';
import { ModaloptionsComponent } from '../modaloptions/modaloptions.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {


  peripheral : any;
  acceleration : any = {};
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
  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private ble: BLE,
    private ngZone: NgZone,
    private file : File,
    private socialSharing : SocialSharing,
    public modalController : ModalController
  ) {


   }

  ngOnInit() {
    this.peripheral =  JSON.parse(this.route.snapshot.paramMap.get("device"));

    
    console.log(this.file.applicationStorageDirectory);

    this.setStatus('Connecting to ' + this.peripheral.name || this.peripheral.id);

    this.acceleration = {
      "x" : 0 ,
      "y" : 0 ,
      "z" : 0
    };
    this.ble.connect(this.peripheral.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );



    this.createMyCSV();
  }
  
  
  createMyCSV(){
    this.csv = [];
    this.headerRow = ["X" , "Y" , "Z" , "Time (ms)"];
    console.log(this.csv)
  }
  

  
  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
      this.readMessagesage()
    });
  }

  onDeviceDisconnected(peripheral){
    console.warn("Disconected from" , peripheral)
  }


  async presentModal() {
    this.modal = await this.modalController.create({
      component : ModaloptionsComponent,
      cssClass: 'my-custom-modal-css'
    });

    // return new Promise((resolve , reject) => {
    //   this.modal.present().then((data) => {
    //     resolve();
    //   });
    // })

    return await this.modal.present();
  }

  async saveFile(){
    this.buttonState = "start"
    console.log("Called");
    clearInterval(this.writeInterval);

    // this.presentModal().then(async () => {
    //   const { data2 } = await this.modal.onDidDismiss()
    //   console.log(data2);
    // });

    await this.presentModal();
    const { data } = await this.modal.onDidDismiss();
    console.log(data); 
    let senderEmail = data.email;

    this.ble.stopNotification(this.peripheral.id , this.SERVICE ,"6e400003-b5a3-f393-e0a9-e50e24dcca9e").then(data => console.log(data)).catch(err => console.error(err));
    let csvBlob = papa.unparse({
      fields: this.headerRow,
      data: this.csv
    });
 
    // console.log(csvBlob);
    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csvBlob]);

    this.file.writeFile(this.file.applicationStorageDirectory , "data.csv" , blob , {replace : true}).then((data) => {
      console.log(data)

      // Check if sharing via email is supported
        this.socialSharing.canShareViaEmail().then(() => {
          // Sharing via email is possible
          // Share via email

          this.socialSharing.shareViaEmail('Attaching CSV Data', 'CSV data from Application', [senderEmail] , null , null , "file://" + data.fullPath).then(() => {
            // Success!
            console.log("Success")

            this.file.writeFile(this.file.externalApplicationStorageDirectory , "data.csv" , blob , {replace : true}).then((data) => {
              console.log(data);                
            }).catch(err => console.error(err));
          }).catch((err) => {
            console.error(err)
            // Error!
          });
        }).catch(() => {
          // Sharing via email is not possible
        });


        
    }).catch(err => {
      console.error(err);
    });
  }

  
    
  SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
  CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"


  readMessagesage() {

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
      
  
      this.ble.startNotification(this.peripheral.id , this.SERVICE ,"6e400003-b5a3-f393-e0a9-e50e24dcca9e").subscribe(
        (message) => {
          
          
          var converted = new Float32Array(message , 0 ,3)
          console.log(converted)
          // this.fps++;
          this.acceleration = {
            "x" : converted[0].toFixed(3).replace(/['"]+/g , ''),
            "y" : converted[1].toFixed(3).replace(/['"]+/g , ''),
            "z" : converted[2].toFixed(3).replace(/['"]+/g , ''),
          }
        },
        e => console.error(e)
      )
    }

    // Disconnect peripheral when leaving the page
    ionViewWillLeave() {
      console.log('ionViewWillLeave disconnecting Bluetooth');
      // clearInterval(this.interval);
      this.ble.disconnect(this.peripheral.id).then(
        () => {
          console.log('Disconnected ' + JSON.stringify(this.peripheral))
          clearInterval(this.writeInterval);
          clearInterval(this.fpsInterval);
          // this.router.navigateByUrl('/home');
        },
        () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
      )
    }
  
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
