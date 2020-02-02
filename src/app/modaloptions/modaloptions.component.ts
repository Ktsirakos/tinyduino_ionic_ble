import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modaloptions',
  templateUrl: './modaloptions.component.html',
  styleUrls: ['./modaloptions.component.scss'],
})
export class ModaloptionsComponent implements OnInit {
  constructor(private modalController : ModalController) { }

  ngOnInit() {}


  messenger(event){
    console.log(event)
    this.modalController.dismiss({
      "email" : event.data
    })
  }
}
