// src/app/page/crud/crud.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student } from './student.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
  styleUrls: ['./crud.css'],
})
export class CrudComponent implements OnInit, OnDestroy {
  // full list from service
  private allStudents: Student[] = [];

  // filtered + paged lists for display
  filteredStudents: Student[] = [];
  pagedStudents: Student[] = [];

  // form fields
  firstName = '';
  middleName = '';
  lastName = '';

  // editing state
  editingId: number | null = null;

  // search and pagination
  searchTerm = '';
  pageSize = 5;
  currentPage = 1;
  totalPages = 1;

  private sub?: Subscription;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.sub = this.studentService.students$.subscribe((students) => {
      this.allStudents = students;
      this.applyFilterAndPagination();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ---- CRUD ----

  onSubmit(): void {
    const f = this.firstName.trim();
    const m = this.middleName.trim();
    const l = this.lastName.trim();
    if (!f || !l) return; // require first + last

    if (this.editingId === null) {
      // CREATE
      this.studentService.addStudent(f, m, l);
    } else {
      // UPDATE
      this.studentService.updateStudent(this.editingId, f, m, l);
    }

    this.resetForm();
  }

  startEdit(student: Student): void {
    this.editingId = student.id;
    this.firstName = student.firstName;
    this.middleName = student.middleName;
    this.lastName = student.lastName;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteStudent(id: number): void {
    this.studentService.deleteStudent(id);
  }

  private resetForm(): void {
    this.editingId = null;
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
  }

  // ---- SEARCH ----

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  // ---- PAGINATION ----

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilterAndPagination();
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // ---- INTERNAL: filter + paginate ----

  private applyFilterAndPagination(): void {
    const term = this.searchTerm.trim().toLowerCase();

    // filter
    if (term) {
      this.filteredStudents = this.allStudents.filter((s) => {
        const full = `${s.firstName} ${s.middleName} ${s.lastName}`.toLowerCase();
        return full.includes(term);
      });
    } else {
      this.filteredStudents = [...this.allStudents];
    }

    // pagination
    this.totalPages = Math.max(1, Math.ceil(this.filteredStudents.length / this.pageSize));

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedStudents = this.filteredStudents.slice(start, end);
  }
}
