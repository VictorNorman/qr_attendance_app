import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';


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
  ) { }

  loadAllData() {
    if (this.courses.length !== 0) {
      return;
    }

    this.courses = [];
    this.courseCollection = this.db.collection<string>('courses');

    this.courseCollection.get().subscribe(q => {
      q.forEach(d => {
        console.log('d = ', d.data().name);
        this.courses.push(d.data().name);
      });
      // Tell all subscribers that the data has arrived.
      this.coursesSubj.next(this.courses);
    });
  }

}
