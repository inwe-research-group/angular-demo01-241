import { PersonaService } from './../service/Persona.service';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Persona } from '../model/persona';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-persona',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registrar-persona.component.html',
  styleUrl: './registrar-persona.component.css',
})
export class RegistrarPersonaComponent {
  personaArray: Persona[] = [];
  personaForm: FormGroup;

  constructor(private personaService: PersonaService) {
    this.personaForm = new FormGroup({
      apellido_paterno: new FormControl('', []),
      apellido_materno: new FormControl('', []),
      nombres: new FormControl('', []),
      fecha_nacimiento: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.getPersonas();
  }

  getPersonas(): void {
    this.personaService.getPersonas().subscribe(
      (result: any) => {
        this.personaArray = result.data;
      },
      (err: any) => {
        console.log(err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Advertencia...',
          text: 'Ah ocurrido un error!',
        });
      }
    );
  }
  registrarPersona(): void {
    console.log('test');
    console.log(this.personaForm.value);
    this.personaService.registrarPersona(this.personaForm.value).subscribe(
      (result: any) => {
        console.log(this.personaForm.value);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'registrarPersona...',
          text: 'Se registro exitosamente los datos de la Persona!',
        });
        this.personaForm.reset();
        this.getPersonas();
      },
      (err: any) => {
        console.log(this.personaForm.value);
        console.log(err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Advertencia...',
          text: 'Ah ocurrido un error al registrar Persona!',
        });
      }
    );
  }
}
