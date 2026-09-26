import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Technician } from '../models/technician.model';

@Injectable({
  providedIn: 'root',
})
export class TechnicianService {
  private readonly firestore = inject(Firestore);

  private readonly techniciansCollection = collection(
    this.firestore,
    'technicians'
  );

  // =========================================================
  // ALL TECHNICIANS
  // =========================================================

  readonly technicians$: Observable<Technician[]> =
    collectionData(
      this.techniciansCollection,
      {
        idField: 'id',
      }
    ) as Observable<Technician[]>;

  // =========================================================
  // GET ALL
  // =========================================================

  getAll(): Observable<Technician[]> {
    return this.technicians$;
  }

  // =========================================================
  // CREATE
  // =========================================================

  async create(
    data: Omit<
      Technician,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<string> {
    const document = await addDoc(
      this.techniciansCollection,
      {
        ...data,

        active: data.active ?? true,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      }
    );

    return document.id;
  }

  // =========================================================
  // UPDATE
  // =========================================================

  async update(
    id: string,
    data: Partial<Technician>
  ): Promise<void> {
    const technicianRef = doc(
      this.firestore,
      'technicians',
      id
    );

    await updateDoc(
      technicianRef,
      {
        ...data,

        updatedAt: serverTimestamp(),
      }
    );
  }

  // =========================================================
  // DELETE
  // =========================================================

  async delete(
    id: string
  ): Promise<void> {
    const technicianRef = doc(
      this.firestore,
      'technicians',
      id
    );

    await deleteDoc(technicianRef);
  }
}
