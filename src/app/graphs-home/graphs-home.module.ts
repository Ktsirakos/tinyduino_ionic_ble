import { DataReplayService } from './../services/data-replay.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphsHomePageRoutingModule } from './graphs-home-routing.module';

import { GraphsHomePage } from './graphs-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphsHomePageRoutingModule
  ],
  declarations: [GraphsHomePage],
  providers : [
    DataReplayService
  ]
})
export class GraphsHomePageModule {}
