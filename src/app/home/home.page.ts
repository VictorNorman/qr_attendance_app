import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { CoursesService } from '../service/courses.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public scannedCode = 'Nothing yet';
  public course = '';     // the course for which attendance is being recorded.
  public isScanBtnDisabled = true;
  public courses: string[] = [];

  constructor(
    private barcodeScanner: BarcodeScanner,
    private cSvc: CoursesService,
  ) {
    // Get the list of courses from the service, once it has gotten them
    // from the database.
    this.cSvc.coursesSubj.subscribe(data => {
      this.courses = data;
    });
  }

  async scanCode() {
    const barcodeData = await this.barcodeScanner.scan({
      resultDisplayDuration: 0,  // don't display the QR encoded string when decoding it.
    });
    this.scannedCode = barcodeData.text;
  }

  setCourse(event) {
    this.course = event.detail.value;
    console.log(event.detail.value);
    this.isScanBtnDisabled = false;
  }

}
