import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import { ToastController } from '@ionic/angular';

// interface FirebaseMeetingSubmissionRecord {
//   firstName: string;
//   lastName: string;
//   userId: string;
//   notes: string;
// }

interface FirebaseMeetingRecord {
  qrCodeStr: string;
  timeGenerated: Date;
  submissionsId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private db: AngularFirestore,
    private toastCtrl: ToastController,
  ) { }

  // NOTE: when trying to submit, must check if the QR code is correct.  Also 
  // perhaps that the time is in some acceptable interval?

  // got the course, qr code, name, notes, etc.
  // Get the mtgs from the meetings collection. Iterate through to find matching
  // QR code string.
  // Add record to submissions.
  // from https://stackoverflow.com/questions/34718668/firebase-timestamp-to-date-and-time.
  // Probably is over-complicated.
  private convertTimestampToDate(timestamp: Timestamp | any): Date | any {
    return timestamp instanceof Timestamp
      ? new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
      : timestamp;
  }

  submit(firstName: string, lastName: string, userId: string, courseName: string,
    codeStr: string, notes: string) {
    const meetingsDoc = this.db.collection('/meetings').doc<FirebaseMeetingRecord>(courseName);
    let message = '';

    meetingsDoc.get().subscribe(async data => {
      const mtgs: FirebaseMeetingRecord[] = data.data()['mtgs'];
      const meeting = mtgs.find(m => m.qrCodeStr === codeStr);
      if (!meeting) {
        message = 'Submission failed: you probably submitted to the incorrect course.'
      } else {
        await this.db.doc(meeting.submissionsId).update({
          submissions: firestore.FieldValue.arrayUnion({
            firstName,
            lastName,
            userId,
            notes,
          })
        });
        message = 'Submission succeeded!';
      }
      const t = await this.toastCtrl.create({
        message,
        position: 'middle',
        duration: 1000,
      });
      t.present();
    });
  }
}
