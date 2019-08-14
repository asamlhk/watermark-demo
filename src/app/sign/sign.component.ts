import { Component, ViewChild, Input} from '@angular/core';
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
  imagedata;
  
  @Input() signType;



  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 300,
    'canvasHeight': 150,
    //backgroundColor: "rgba(0, 0, 0, 1)"
  };

 

  constructor(private _sanitizer: DomSanitizer) {
    
    // no-op
  }

  getImage() {
     return this.signaturePad ?this._sanitizer.bypassSecurityTrustResourceUrl(this.signaturePad.toDataURL("png")): null;
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    let ele: any = document.getElementsByTagName("canvas")[0]
    let ctx = ele.getContext("2d");
 
 
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    //console.log(this.signaturePad.toDataURL());
    this.imagedata = this._sanitizer.bypassSecurityTrustResourceUrl(this.signaturePad.toDataURL("png"));
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    //console.log('begin drawing');
  }
}

