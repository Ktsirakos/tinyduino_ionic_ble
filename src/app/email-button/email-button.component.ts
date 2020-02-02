import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-email-button',
  templateUrl: './email-button.component.html',
  styleUrls: ['./email-button.component.scss'],
})
export class EmailButtonComponent implements OnInit {


  @Input() name : string;
  @Input() email : string;
  @Output() emailMessenger = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onButtonPress(){
    this.emailMessenger.emit({"event" : "close" , "data" : this.email});
  }

}
