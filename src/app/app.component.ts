import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PdfviewComponent } from './pdfview/pdfview.component';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  signed = false;
  documents = [
    {
      name: 'document A',
      url: 'https://www.tutorialspoint.com/angular2/angular2_tutorial.pdf',
      signed: false
    },
    {
      name: 'document B',
      url: 'https://www.tutorialspoint.com/5g/5g_tutorial.pdf',
      signed: false
    }
  ]

  lastSign = () => {
    return this.documents.findIndex((ele) => ele.signed);
    //return false;
  }

  constructor(public dialog: MatDialog) {


  }

  NumberOfDoc = () => {
    this.documents.length;
  }

  


  openDialog(i): void {
    const dialogRef = this.dialog.open(PdfviewComponent, {
      width: '100vw',
      height: '80vh',
      data: this.documents[i],
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(i)
      this.documents[i].signed = result;
      if (i < this.documents.length - 1 && result) {
        i++;
        this.openDialog(i)
      }
    });
  }
}
