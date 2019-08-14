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
      name: 'La Vie',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/TC7%20-%20La%20Vie%20(EN%2C%20HK).pdf?alt=media&token=cf242713-5862-44f0-882f-77f4dbb9b145',
      signed: false
    },
    {
      name: 'document B',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/IND_3220082170_EPOSAPP_NA_NA_20190618.pdf?alt=media&token=8a3b70cd-6aad-48df-92ed-05dbd53e7bcb',
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
      height: '100vh',
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
