import { CommandsComponent } from './commands/commands.component';
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
  declarations: [],
  providers: [],
})
export class PagesRoutingModule { }
