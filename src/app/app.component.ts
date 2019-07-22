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
  constructor(public dialog: MatDialog) {
    

  }

 
  openDialog(): void {
    const dialogRef = this.dialog.open(PdfviewComponent, {
      width: '100vw',
      height: '90vh',
      data: {
        url: "https://www.tutorialspoint.com/angular2/angular2_tutorial.pdf"
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.signed = result;

    });
  }
}
