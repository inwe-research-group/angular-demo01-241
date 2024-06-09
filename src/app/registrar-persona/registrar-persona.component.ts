import { PersonaService } from './../service/Persona.service';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Persona } from '../model/persona';
import Swal from 'sweetalert2';
import { CommonModule, formatDate } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-registrar-persona',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './registrar-persona.component.html',
  styleUrl: './registrar-persona.component.css',
})
export class RegistrarPersonaComponent {
  personaArray: Persona[] = [];
  personaForm: FormGroup;
  offset: number;
  isEdited: boolean = false;
  page: number;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private personaService: PersonaService
  ) {
    this.page = 1;
    this.offset = new Date().getTimezoneOffset();
    this.personaForm = new FormGroup({
      id_persona: new FormControl('', []),
      apellido_paterno: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      apellido_materno: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      nombres: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      fecha_nacimiento: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getPersonas();
  }

  getPersonas(): void {
    if (this.isEdited) this.isEdited = false;
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
    if (this.isEdited) {
      this.actualizarPersona();
    } else {
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

  editarPersona(persona: Persona): void {
    Swal.fire({
      title: 'Esta seguro de modificar la persona seleccionada?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaForm.setValue({
          id_persona: persona.id_persona,
          apellido_paterno: persona.apellido_paterno,
          apellido_materno: persona.apellido_materno,
          nombres: persona.nombres,
          fecha_nacimiento: formatDate(
            persona.fecha_nacimiento,
            'yyyy-MM-dd',
            this.locale,
            'UTC' + this.offset
          ),
        });
        this.isEdited = true;
      }
    });
  }

  actualizarPersona(): void {
    //console.log('test');
    //console.log(this.personaForm.value);
    this.personaService.actualizarPersona(this.personaForm.value).subscribe(
      (result: any) => {
        //console.log(this.personaForm.value);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'actualizarPersona...',
          text: 'Se actualizo exitosamente los datos de la Persona!',
        });
        this.personaForm.reset();
        this.getPersonas();
      },
      (err: any) => {
        //console.log(this.personaForm.value);
        //console.log(err);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Advertencia...',
          text: 'Ah ocurrido un error al actualizar Persona!',
        });
      }
    );
  }

  eliminarPersona(persona: Persona): void {
    Swal.fire({
      title: 'Esta seguro de eliminar la persona seleccionada?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.eliminarPersona(persona).subscribe(
          (result: any) => {
            console.log(persona);
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'eliminarPersona...',
              text: 'Se elimino exitosamente la Persona!',
            });
            this.getPersonas();
          },
          (err: any) => {
            console.log(persona);
            console.log(err);
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Advertencia...',
              text: 'Ah ocurrido un error al eliminar Persona!',
            });
          }
        );
      }
    }); //end then
  } //end metodo
}
