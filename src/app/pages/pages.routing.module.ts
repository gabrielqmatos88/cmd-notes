import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommandsComponent } from './commands/commands.component';
import { PagePasswordComponent } from './password/page-password.component';


const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'commands'
  },
  {
    path: 'commands',
    component: CommandsComponent
  },
  {
    path: 'password',
    component: PagePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class PagesRoutingModule { }
