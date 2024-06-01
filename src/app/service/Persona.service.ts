import { Persona } from './../model/persona';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  readonly BASE_URL: string = 'http://localhost:5000/api/v1/personas';

  constructor(private http: HttpClient) {}

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.BASE_URL}/listar`);
  }

  registrarPersona(form: any) {
    return this.http.post(`${this.BASE_URL}/agregar`, form);
  }

  actualizarPersona(form: any) {
    return this.http.post(`${this.BASE_URL}/actualizar`, form);
  }

  eliminarPersona(persona: Persona) {
    return this.http.delete(`${this.BASE_URL}/delete`, { body: persona });
  }
}
