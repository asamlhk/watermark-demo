
import * as R from 'ramda';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent {
  src = '';
  //page = 1;
  pdf;
  cpage = 0;
  pageRead = [];
  signed = false;

  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.src = data.url;
  }

  @HostListener("scroll", ['$event'])
  scrollMe(event) {
    let v = document.getElementById('pdfview')
    if (this.cpage < this.pdf.numPages && v.scrollHeight - v.scrollTop <= v.clientHeight) {
      this.changePage(this.cpage + 1);

    }
    if (this.cpage > 1 && v.scrollTop == 0) {
      this.changePage(this.cpage - 1);
    }
  }



  changePage(p) {
    //this.page = p;
    this.cpage = p;
    this.pageRead[this.cpage - 1] = true;

    setTimeout(() => {
      this.watermark();
    }, 300)
    //this.watermark();
    document.body.scrollTop = 1; // For Safari
    var element = document.getElementById('pdfview');
    element.scrollTop = 1; // For Chrome, Firefox, IE and Opera
  }

  watermark() {
    //return
    var can = document.getElementById('pdfview').querySelector('canvas');
    var ctx = can.getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.font = "30px Arial";
    //ctx.clearRect(0,0,can.width, can.height);
    ctx.rotate(-45);
    for (var i = -100; i < 100; i++) {
      for (var j = -100; j < 100; j++) {
        ctx.fillText("Readonly", 300 * i, 200 * j);
      }
    }
    ctx.rotate(45);
    ctx.restore();
  }

  update() {
    this.pageRead[this.cpage - 1] = true;
    this.cpage = this.cpage;
    this.watermark();
  }

  callBackFn(pdf) {
    // do anything with "pdf"
    this.pdf = pdf;
    this.pageRead = R.range(0, pdf.numPages).map(
      x => false
    )
    this.pageRead[0] = true;
    this.changePage(1);
  }


  readAllPages() {
    return this.pageRead.filter(x => !x).length != 0;
  }

  onNoClick() {
    this.dialogRef.close();
  }



}