import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';

import { FormsModule } from '@angular/forms';

// Importa el nuevo LayoutsModule
import { LayoutsModule } from './layouts/layouts.module';
import { UsersModule } from './features/users/users.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    UsersModule,
    CalendarModule,
    TableModule,
    CardModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    PanelModule,
    DividerModule,
    ToolbarModule,
    RippleModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
