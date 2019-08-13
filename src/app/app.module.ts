import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import OrderModule
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, } from '@angular/material';
import { PdfviewComponent } from './pdfview/pdfview.component';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { SignComponent } from './sign/sign.component';
 
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  imports: [BrowserModule, FormsModule, PdfViewerModule,
    MatButtonModule, MatCheckboxModule,
    MatDialogModule, BrowserAnimationsModule,SignaturePadModule
 
  ],
  declarations: [AppComponent, HelloComponent, PdfviewComponent, SignComponent],
  bootstrap: [AppComponent],
  entryComponents: [PdfviewComponent, SignComponent],


})
export class AppModule { }
