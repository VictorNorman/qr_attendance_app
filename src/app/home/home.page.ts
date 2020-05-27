import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { CoursesService } from '../services/courses.service';
import { SubmissionService } from '../services/submission.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public scannedCode = null;
  public course = '';     // the course for which attendance is being recorded.
  public isScanBtnDisabled = true;
  public courses: string[] = [];
  public notes = '';

  constructor(
    private barcodeScanner: BarcodeScanner,
    private cSvc: CoursesService,
    private sSvc: SubmissionService,
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
    this.isScanBtnDisabled = false;
  }

  // Submit name info, course, qr info, and notes to firebase.
  submit() {
    this.sSvc.submit(this.course, this.scannedCode, this.notes);
    this.scannedCode = null;
  }

}
