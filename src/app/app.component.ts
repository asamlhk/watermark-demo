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
        name: 'USD',
        url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/T19_USD_DBS%20(11-2018)%20with%20PICS%20-%20Acroform%20-%201%20field.PDF?alt=media&token=18d40fb2-3e96-41ff-805a-0e55c03410cb',
        signed: false,
        signatures: []
    },
    {
      name: 'La Vie',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/TC7%20-%20La%20Vie%20(EN%2C%20HK).pdf?alt=media&token=cf242713-5862-44f0-882f-77f4dbb9b145',
      signed: false,
      signatures: [
        {
          page: 1,
          x: 100,
          y: 200,
          style: 'holder',
          htmlfield: null,
          meta: null,
        },
        {
          page: 1,
          x: 400,
          y: 200,
          style: 'insured'
        },
        {
          page: 15,
          x: 100,
          y: 700,
          style: 'holder',

        },
        {
          page: 15,
          x: 400,
          y: 700,

          style: 'insured'
        }
      ]
    },
    {
      name: 'Application Form',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/IND_3220082170_EPOSAPP_NA_NA_20190618.pdf?alt=media&token=8a3b70cd-6aad-48df-92ed-05dbd53e7bcb',
      signed: false,
      signatures: [
        {
          page: 13,
          x: 100,
          y: 200,
          style: 'holder',
          htmlfield: null,
          meta: null,
        },
      ]
    },
    {
      name: 'Signed Doc',
      url: 'https://firebasestorage.googleapis.com/v0/b/storage-5ad5a.appspot.com/o/newpdf%20(66).pdf?alt=media&token=36b59ffb-04a4-4207-98ca-9267b69affe6',
      signed: true
    }

  ]

  constructor(public dialog: MatDialog) {

  }

  openDialog(i): void {
    const dialogRef = this.dialog.open(PdfviewComponent, {
      width: '100vw',
      height: '100vh',
      minWidth: '100vw',
      data: this.documents[i],
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.next)
        this.openDialog(i + 1)

    });
  }
}
