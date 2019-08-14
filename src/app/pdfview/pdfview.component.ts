
import * as R from 'ramda';
import { Component, Inject, OnInit, ViewChild, HostListener, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, pipe, interval } from "rxjs";
import 'rxjs/add/observable/fromEvent';
import { debounceTime, throttle } from 'rxjs/operators';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData } from 'pdfjs-dist';
import { SignComponent } from '../sign/sign.component';


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

  readonly dpiRatio = 96 / 72;

  @ViewChild("vc", { read: ViewContainerRef }) vc: ViewContainerRef;

  changingPage = false;
  timeout = 10;

  signFields = [
    {
      page: 1,
      fields: [],
      htmlfields: []
    },
    {
      page: 2,
      fields: [
        {
          x: 0,
          y: 0,
          style: 'holder'
        },
        {
          x: 100,
          y: 0,
          style: 'insured'
        }
      ],
      htmlfields: []

    },
    {
      page: 3,
      fields: [
        {
          x: 50,
          y: 100,
          style: 'holder'
        }
      ],
      htmlfields: []

    }
  ]

  showSignField(page) {

    this.signFields.forEach(fs => {
      fs.htmlfields.forEach(
        f => f.style.display = 'none'
      )
    });


    const fs = this.signFields.filter(p => p.page === page);

    if (fs[0]) {
      fs[0].htmlfields.forEach(
        f => f.style.display = 'block'
      );
    }


  }

  addSignField(x, y, signType) {
    const factory = this.componentFactoryResolver
      .resolveComponentFactory(SignComponent);
    const component: ComponentRef<SignComponent> = factory
      .create(this.vc.parentInjector);

    component.instance.display = true;
    component.instance.signType = signType;

    let element: HTMLElement = <HTMLElement>component.location.nativeElement;


    element.style.position = "absolute";
    element.style.top = y + "px";
    element.style.left = x + "px";
    element.style.display = 'none';


    this.vc.insert(component.hostView);

    return element;
  }

  loadComplete(pdf: PDFDocumentProxy): void {
    for (let i = 1; i <= pdf.numPages; i++) {

      // track the current page

      let currentPage = null;
      pdf.getPage(i).then(p => {
        currentPage = p;

        return p.getAnnotations();
      }).then(ann => {

        const annotations = (<any>ann) as PDFAnnotationData[];

        annotations
          .filter(x => x.subtype == 'link')

          .forEach(a => {


          });
      });
    }

    this.signFields.forEach(
      fs => {
        fs.htmlfields = fs.fields.map(
          f => this.addSignField(f.x, f.y, f.style)
        )

      }
    )
    this.changePage(1);
  }

  ngAfterViewInit() {
    const pdfview = document.getElementById('pdfview');
    setInterval(
      () => {
        this.timeout != 0 ? this.timeout -= 1 : '';
      }, 1000
    );
    Observable.fromEvent(pdfview, 'scroll')
      .pipe(
        //debounceTime(30),
        throttle(val => interval(10))
      )
      .subscribe((event) => {
        const offsetX = 0//document.getElementById("pdfview").offsetLeft;
        const offsetY = 0//document.getElementById("pdfview").offsetTop;


        const ele = event.srcElement;
        let v = document.getElementById('pdfview');
        const fields = this.signFields.filter(x => x.page == this.cpage);
        if (fields[0]) {

          fields[0].htmlfields.forEach(


            (f, i) => {
              const originTop = fields[0].fields[i].y;
              f.style.top = originTop - v.scrollTop + offsetY + 'px'
              f.style.left = fields[0].fields[i].x + 'px'
            }

          )
        }
        /*
        if (this.cpage < this.pdf.numPages && v.scrollHeight - v.scrollTop <= v.clientHeight + 50) {
          this.changePage(this.cpage + 1);
        }

        if (this.cpage > 1 && v.scrollTop == 0) {
          this.changePage(this.cpage - 1);
        }
        */
      });
  }


  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver,

  ) {

    this.src = data.url;
    this.signed = data.signed;

  }

  changePage(p) {
    this.cpage = p;
    this.pageRead[this.cpage - 1] = true;
    this.showSignField(this.cpage);

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