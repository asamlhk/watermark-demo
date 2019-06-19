import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PdfviewComponent } from './pdfview/pdfview.component';
 

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  read = false;
  constructor(public dialog: MatDialog) {
    

  }

 
  openDialog(): void {
    const dialogRef = this.dialog.open(PdfviewComponent, {
      width: '100vw',
      data: {
        url: "https://gahp.net/wp-content/uploads/2017/09/sample.pdf"
      },
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.read = result;

    });
  }
}
