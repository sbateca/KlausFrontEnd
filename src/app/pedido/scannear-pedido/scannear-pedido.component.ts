import {Component, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scannear-pedido',
  templateUrl: './scannear-pedido.component.html',
  styleUrls: ['./scannear-pedido.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ScannearPedidoComponent implements OnInit {

  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;

  constructor(private referenciaVentanaModal: MatDialogRef<ScannearPedidoComponent>) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      /* console.log(devices); */
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){
              if (dev.label.includes('e2eSoft iVCam')){
                  choosenDev = dev;
                  break;
              }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
      }
  });

  

  this.qrScannerComponent.capturedQr.subscribe(result => {
      if(result!=null){
        /* console.log("Se detecto un QR nuevo")
        console.log(result); */
        this.referenciaVentanaModal.close(result);
        
      }
  });
  }
}
