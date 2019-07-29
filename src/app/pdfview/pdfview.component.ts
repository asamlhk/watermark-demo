
import * as R from 'ramda';
import { Component, Inject, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, pipe, interval } from "rxjs";
import 'rxjs/add/observable/fromEvent';
//import 'rxjs/add/observable/throttle';
//import 'rxjs/add/observable/debounceTime';
import { debounceTime, throttle } from 'rxjs/operators';


@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent implements AfterViewInit {
  src = '';
  //page = 1;
  pdf;
  cpage = 0;
  pageRead = [];
  signed = false;

  changingPage = false;

  ngAfterViewInit() {
    const pdfview = document.getElementById('pdfview');
    Observable.fromEvent(pdfview, 'scroll')
      .pipe(
        debounceTime(50),
        throttle(val => interval(50))
      )
      .subscribe((event) => {
        console.log(event)
        const ele = event.srcElement
        console.log({
          scrollH: ele.scrollHeight - ele.scrollTop,
          clientHeight: ele.clientHeight
        })
        //scrollHeight: 1142
        let v = document.getElementById('pdfview')
        if (this.cpage < this.pdf.numPages && v.scrollHeight - v.scrollTop <= v.clientHeight + 50) {
          this.changePage(this.cpage + 1);
        }

        if (this.cpage > 1 && v.scrollTop == 0) {
          this.changePage(this.cpage - 1);
        }
      })
  }


  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.src = data.url;
    this.signed = data.signed;



  }


  /*
    @HostListener("scroll", ['$event'])
    scrollMe(event) {
      let v = document.getElementById('pdfview')
      if (this.cpage < this.pdf.numPages && v.scrollHeight - v.scrollTop <= v.clientHeight) {
        this.changePage(this.cpage + 1);
      }
      //if (this.cpage > 1 && v.scrollTop == 0) {
        //this.changePage(this.cpage - 1);
      //}
    }
    */

  changePage(p) {
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
    if (!this.signed) return;
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