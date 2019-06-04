import { CommandsComponent } from './commands/commands.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';


const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'commands'
  },
  {
    path: 'commands',
    component: CommandsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [CommonModule],
  providers: [],
})
export class PagesRoutingModule { }
