import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphsHomePage } from './graphs-home.page';

const routes: Routes = [
  {
    path: '',
    component: GraphsHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphsHomePageRoutingModule {}
