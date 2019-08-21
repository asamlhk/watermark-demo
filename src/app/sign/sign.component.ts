import { Component, ViewChild, Input } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent {
  @Input() display;
  signed = false;
  imagedata = null;

  @Input() signType;
  @Input()
  meta;


  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
  };



  constructor(private _sanitizer: DomSanitizer) {
  }

 

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    let ele: any = document.getElementsByTagName("canvas")[0]
    let ctx = ele.getContext("2d");
  }

  done() {
    this.imagedata = this.signaturePad.toDataURL("png");
  }

  safeUrl = (image) => {
    this._sanitizer.bypassSecurityTrustResourceUrl(image);
  }

  drawComplete() {
    
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    //console.log('begin drawing');
  }
}

