
import * as R from 'ramda';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent implements OnInit {
  src = '';
  page = 1;
  pdf;
  cpage = 0;
  pageRead = [];

  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.src = data.url;



  }

  @HostListener("scroll", ['$event'])
  scrollMe(event) {
    let v = document.getElementById('pdfview')

    console.log(v.scrollHeight, v.scrollTop, v.clientHeight)
    if (this.page < this.pdf.numPages && v.scrollHeight - v.scrollTop == v.clientHeight) {
      this.changePage(this.page + 1);

    }

    if (this.page > 1 && v.scrollTop == 0) {
      this.changePage(this.page - 1);
    }

  }

  ngOnInit() {

  }

  render() {
    this.watermark();
  }



  pageRendered(e: CustomEvent) {
    this.watermark();
    var element = document.getElementById('pdfview');

  }

  changePage(p) {
    this.page = p;
    this.pageRead[this.page - 1] = true;
    this.cpage = this.page;
    setTimeout(() => {
      this.watermark();
    }, 500)
    //this.watermark();
    document.body.scrollTop = 1; // For Safari
    var element = document.getElementById('pdfview');
    element.scrollTop = 1; // For Chrome, Firefox, IE and Opera
  }

  watermark() {
    //return
    var can = document.getElementById('pdfview').querySelector('canvas');
    var ctx = can.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "30px Arial";
    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        ctx.strokeText("Readonly", 300 * i, 200 * j)
      }
    }
  }



  update() {
    this.pageRead[this.page - 1] = true;
    this.cpage = this.page;
    this.watermark();
  }

  callBackFn(pdf) {
    // do anything with "pdf"
    this.pdf = pdf;
    this.pageRead = R.range(0, pdf.numPages).map(
      x => false
    )
    this.pageRead[0] = true;
  }


  readAllPages() {
    return this.pageRead.filter(x => !x).length != 0;
  }



  onNoClick() {
    this.dialogRef.close();
  }



}