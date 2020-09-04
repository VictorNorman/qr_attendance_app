import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { CoursesService } from '../services/courses.service';
import { SubmissionService } from '../services/submission.service';
import { Storage } from '@ionic/storage';

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

  public firstName = '';
  public lastName = '';
  public userId = '';

  public version = '0.8.3';

  constructor(
    private barcodeScanner: BarcodeScanner,
    private cSvc: CoursesService,
    private sSvc: SubmissionService,
    private storage: Storage,
  ) {
    // Get the list of courses from the service, once it has gotten them
    // from the database.
    this.cSvc.coursesSubj.subscribe(data => {
      this.courses = data;
    });

    this.storage.get('firstName').then(f => this.firstName = f);
    this.storage.get('lastName').then(l => this.lastName = l);
    this.storage.get('userId').then(u => this.userId = u);

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
    this.sSvc.submit(this.firstName, this.lastName, this.userId, this.course, this.scannedCode, this.notes);
    this.scannedCode = null;
  }

  clearRegistrationInfo() {
    this.storage.remove('userId');
    this.storage.remove('firstName');
    this.storage.remove('lastName');
  }

}
