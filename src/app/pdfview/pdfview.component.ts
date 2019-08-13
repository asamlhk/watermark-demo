
import * as R from 'ramda';
import { Component, Inject, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, pipe, interval } from "rxjs";
import 'rxjs/add/observable/fromEvent';
import { debounceTime, throttle } from 'rxjs/operators';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData } from 'pdfjs-dist';

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent implements AfterViewInit {
  src = '';

  pdf;
  cpage = 0;
  pageRead = [];
  signed = false;
  signfield: HTMLElement;
  readonly dpiRatio = 96 / 72;


  changingPage = false;
  timeout = 10;

  loadComplete(pdf: PDFDocumentProxy): void {
    for (let i = 1; i <= pdf.numPages; i++) {

      // track the current page
      
      let currentPage = null;
      pdf.getPage(i).then(p => {
        currentPage = p;

        // get the annotations of the current page
        return p.getAnnotations();
      }).then(ann => {

        // ugly cast due to missing typescript definitions
        // please contribute to complete @types/pdfjs-dist
        const annotations = (<any>ann) as PDFAnnotationData[];
console.log(i)
        annotations
          //.filter(a => a.subtype === 'Widget') // get the form field annotation only
          .forEach(a => {

            // get the rectangle that represent the single field
            // and resize it according to the current DPI
            const fieldRect = currentPage.getViewport(this.dpiRatio)
              .convertToViewportRectangle(a.rect);
            console.log({
              'page': i,
              'widget': a
            })

            // add the corresponding input
            //this.addInput(a, fieldRect);
          });
      });
    }
  }

  ngAfterViewInit() {
    this.signfield = document.getElementById('signHere');
    const pdfview = document.getElementById('pdfview');
    setInterval(
      () => {
        this.timeout != 0 ? this.timeout -= 1 : '';
      }, 1000
    );
    Observable.fromEvent(pdfview, 'scroll')
      .pipe(
        debounceTime(30),
        throttle(val => interval(30))
      )
      .subscribe((event) => {
        const ele = event.srcElement;
        let v = document.getElementById('pdfview');
        this.signfield.style.top = 200 - v.scrollTop + 'px';
        if (this.cpage < this.pdf.numPages && v.scrollHeight - v.scrollTop <= v.clientHeight + 50) {
          this.changePage(this.cpage + 1);
        }

        if (this.cpage > 1 && v.scrollTop == 0) {
          this.changePage(this.cpage - 1);
        }
      });
  }


  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.src = data.url;
    this.signed = data.signed;



  }

  changePage(p) {
    this.cpage = p;
    this.pageRead[this.cpage - 1] = true;

    //setTimeout(() => {
      //this.watermark();
    /}, 300)
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
    this.loadComplete(pdf);
  }


  readAllPages() {
    return this.timeout == 0 && this.pageRead.filter(x => !x).length == 0;
  }

  onNoClick() {
    this.dialogRef.close();
  }



}