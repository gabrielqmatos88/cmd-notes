import { PagePasswordComponent } from './pages/password/page-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CommandsComponent } from './pages/commands/commands.component';
import { WikiComponent } from './pages/wiki/wiki.component';

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
    path: 'wiki',
    component: WikiComponent
  },
  {
    path: 'password',
    component: PagePasswordComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class AppRoutingModule { }
