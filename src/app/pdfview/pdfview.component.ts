import * as R from 'ramda';
import { Component, Inject, OnInit, ViewChild, HostListener, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ElementRef, } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable, pipe, interval } from "rxjs";
import 'rxjs/add/observable/fromEvent';
import { debounceTime, throttle } from 'rxjs/operators';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { PDFAnnotationData, OPS } from 'pdfjs-dist';
import { SignComponent } from '../sign/sign.component';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';


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
  page = 1;

  dpiRatio//; = 96 / 72 * 1.2;

  @ViewChild("vc", { read: ViewContainerRef }) vc: ViewContainerRef;

  changingPage = false;


  signatures = [];

  signFields = [];
  scale = 1;

  allSigned = () => {
    return this.signatures.map(
      s => s.sign.imagedata != null
    ).every(s => s)


  }
  pageNeedtoSign = () => {
    const sp = this.signatures.map(s => s.sign.meta.page);
    const l = new Set(sp);

    return l.size;
  }

  signedPages = () => {
    const sp = this.signatures.filter(
      s => s.sign.imagedata == null
    ).map(s => s.sign.meta.page);
    const l = new Set(sp);

    return l.size;
  }


  showSignField(page) {
    if (typeof this.signFields == 'undefined')
      return;
    this.signFields.filter(f => f.htmlfield).forEach(
      f => {
        f.page == page ? f.htmlfield.style.display = 'block' : f.htmlfield.style.display = 'none'
      }
    );
  }

  addSignField(x, y, signType, page) {
    const ratio = 1;

    const factory = this.componentFactoryResolver
      .resolveComponentFactory(SignComponent);
    const component: ComponentRef<SignComponent> = factory
      .create(this.vc.parentInjector);

    const instance = component.instance;

    instance.display = true;
    instance.signType = signType;
    instance.meta = {
      page: page,
      x: x * this.dpiRatio,
      y: y * this.dpiRatio,
      signType: signType
    }

    let element: HTMLElement = <HTMLElement>component.location.nativeElement;

    this.signatures.push(
      {
        sign: instance,

      }
    )

    element.style.position = "absolute";
    element.style.top = y * this.dpiRatio + "px";
    element.style.left = x * this.dpiRatio + "px";
    this.vc.insert(component.hostView);

    return element;
  }

  /** poc for client side pdf generation  */
  genPDF() {
    this.pdf.getData().then(
      data => {
        PDFDocument.load(data).then(
          pdfDoc => {

            const pages = pdfDoc.getPages();

            const ops = [];

            this.signatures.filter(s => s.sign.imagedata != null).forEach(
              s => {
                const meta = s.sign.meta;
                var sign = s.sign.imagedata.replace('data:image/png;base64,', '');
                const page = pages[meta.page - 1];
                const { width, height } = page.getSize();
                const op = pdfDoc.embedPng(sign).then(
                  pngImage => {
                    page.drawImage(pngImage, {
                      x: meta.x / this.dpiRatio,
                      y: height - meta.y / this.dpiRatio - 30,
                      height: pngImage.scale(0.3).height,
                      width: pngImage.scale(0.3).width,
                    })
                  });

                ops.push(op);
              }
            );
            Promise.all(ops
            ).then(
              () => {
                pdfDoc.flush();
                pdfDoc.save().then(
                  data => {
                    var downloadBlob, downloadURL;

                    downloadBlob = function (data, fileName, mimeType) {
                      var blob, url;
                      blob = new Blob([data], {
                        type: mimeType
                      });
                      url = window.URL.createObjectURL(blob);
                      downloadURL(url, fileName);
                      setTimeout(function () {
                        return window.URL.revokeObjectURL(url);
                      }, 1000);
                    };

                    downloadURL = function (data, fileName) {
                      var a;
                      a = document.createElement('a');
                      a.href = data;
                      a.download = fileName;
                      document.body.appendChild(a);
                      a.style = 'display: none';
                      a.click();
                      a.remove();
                    };

                    downloadBlob(data, 'newpdf.pdf', 'application/octet-stream');
                  })
              });
          }

        )

      }
    )
  }

  loadComplete(pdf: PDFDocumentProxy): void {
    let ps = [];
    this.pdf = pdf;



    pdf.getMetadata().then(m => m).then(m => console.log(m))
    for (let i = 1; i <= pdf.numPages; i++) {
      let currentPage = null;


      ps.push(pdf.getPage(i).then(p => {
        currentPage = p;
        

        this.dpiRatio = (960 / p.getViewport(1).width);
        return p.getAnnotations();
      }).then(ann => {
        if (this.signFields) {

          const annotations = (<any>ann) as PDFAnnotationData[];
          const h = currentPage.getViewport(1).height;
  
          const sf = annotations
          .filter(
                s => s.fieldType == 'Sig'//s.subtype == 'fieldType'
              )
            .map(a => {
              return {
                page: i,
                x: a.rect[0],
                y: h-a.rect[1],
                style: 'normal'
              }
            });


          this.signFields = this.signFields.concat(sf);
        }


      }));
    }
    Promise.all(ps).then(
      () => {
        if(this.signFields)
          this.signFields.forEach(f => f.htmlfield = this.addSignField(f.x, f.y, f.style, f.page));
        this.changePage(1);
        
      }
    );
  }

  ngAfterViewInit() {
  }


  constructor(
    public dialogRef: MatDialogRef<PdfviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer

  ) {
    this.src = data.url;
    this.signed = data.signed;
    this.signFields = data.signatures;
  }


  changePage(p) {
    this.cpage = p;
    this.pageRead[this.cpage - 1] = true;
    this.showSignField(this.cpage);

    document.body.scrollTop = 1; // For Safari
    var element = document.getElementById('pdfview');
    element.scrollTop = 1;
    setTimeout(
      () => {
      this.watermark()
      }, 500
    );
  }

  watermark() {
    //return
    if (!this.signed) return;
   // console.log(document.getElementById('vc').querySelector('canvas'));

    
    var can = document.querySelector('canvas');
    var ctx = can.getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.font = "30px Arial";
    //ctx.clearRect(0,0,can.width, can.height);
    //ctx.rotate(-45);
    for (var i = -100; i < 100; i++) {
      for (var j = -100; j < 100; j++) {
        ctx.fillText("Readonly", 300 * i, 200 * j);
      }
    }
     
    ctx.restore();
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


  onNoClick() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({
      next: true
    });
  }




}