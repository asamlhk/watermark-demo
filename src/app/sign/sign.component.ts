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

  getWidth(rect) {
    return rect ? rect[2] - rect[0] + 'px' : '200px';
  }
  getHeight(rect) {
    return rect ? rect[3] - rect[1] + 'px' : '50px';
  }
  getColor(name) {
    /*
  //  Apply:

//Policyowner: Light grey - R: 237, G: 237, B: 237 #ededed

Witness: Light green - R: 211, G: 221, B: 184 (same as Agent) #d3ddb8

Agent (Advisor): Light green - R: 211, G: 221, B: 184 #d3ddb8

Insured: Light blue - R: 179, G: 193, B: 217 #b3c1d9

Payor: Light yellow - R: 252, G: 242, B: 207 #fcf2cf

Account Holder: Light orange - R: 247, G: 230, B: 215 (for Autopay DDA form) #f7e6d7

Joint Account Holder: Light orange - R: 247, G: 230, B: 215 (for Autopay DDA form) #f7e6d7
*/


    return name ? name.includes("policyOwnerSignature") ? '#ededed' :
      //name.includes("jointAccountHolderSignature") ? '#f7e6d7' :
      name.includes("accountHolderSignature") ? '#f7e6d7' :
        'gray' : 'gray';

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

