// src/app/page/crud/student.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Student {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  // initial dummy data
  private readonly _students = new BehaviorSubject<Student[]>([]);

  readonly students$ = this._students.asObservable();

  private get students(): Student[] {
    return this._students.value;
  }

  addStudent(firstName: string, middleName: string, lastName: string): void {
    const nextId = this.students.length ? Math.max(...this.students.map((s) => s.id)) + 1 : 1;

    const newStudent: Student = {
      id: nextId,
      firstName,
      middleName,
      lastName,
    };

    this._students.next([...this.students, newStudent]);
  }

  updateStudent(id: number, firstName: string, middleName: string, lastName: string): void {
    const updated = this.students.map((s) =>
      s.id === id ? { ...s, firstName, middleName, lastName } : s
    );
    this._students.next(updated);
  }

  deleteStudent(id: number): void {
    this._students.next(this.students.filter((s) => s.id !== id));
  }
}
