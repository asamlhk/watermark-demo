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
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/form2.pdf?alt=media&token=83bab914-590f-4154-9770-e3275d286472',
      signed: false
    },
    {
      name: 'document B',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/form3.pdf?alt=media&token=8e3a3966-02a0-4764-8a97-df7079c24074',
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
