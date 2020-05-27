import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

interface FirebaseCourseRecord {
  adminEmail: string;
  password: string;
  name: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // list of course names
  private courses: string[] = [];
  private courseCollection: AngularFirestoreCollection<string>;

  public coursesSubj: BehaviorSubject<string[]> =  new BehaviorSubject<string[]>(undefined);

  constructor(
    private db: AngularFirestore,
  ) { 
    this.db.collection<FirebaseCourseRecord>('/courses').snapshotChanges().subscribe(docChActions => {
      this.courses = [];
      docChActions.forEach(dca => {
        const course = dca.payload.doc.data();
        this.courses.push(course.name);
      });
      // Tell all subscribers that the data has arrived.
      this.coursesSubj.next(this.courses);
    });
  }
}
