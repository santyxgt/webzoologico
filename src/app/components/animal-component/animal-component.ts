import { ChangeDetectorRef, Component } from '@angular/core';

import { AnimalService } from '../../services/animal-service';

import { ToastrService } from 'ngx-toastr';

import { take } from 'rxjs';

import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-animal-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-component.html',
  styleUrl: './animal-component.css',
  host: { ngSkipHydration: 'true' }
})

export class AnimalComponent {

  animalList: any = [];
  animalForm: FormGroup | any;

  idAnimal: any;
  editableAnimal: any = null;


  constructor(
    private cd: ChangeDetectorRef,
    private animalService: AnimalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: {}) => {
      this.animalList = data;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: ''
    });
    this.getAllAnimals();
  }

  newMessage(messageText: string) {

    this.toastr.success(
      'Clic aquí para actualizar la lista',
      messageText
    )
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());

  }

  newAnimalEntry() {
    this.animalService.newAnimal(this.animalForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /inicio y recargando la ventana
        this.router.navigate(['/inicio'])
          .then(() => {
            this.newMessage('Registro exitoso');
          })
      }
    );
  }

  ngOnChanges() {
    this.getAllAnimals();
  }

  updateAnimalEntry() {

    const formValue = Object.fromEntries(
      Object.entries(this.animalForm.value).filter(([_, v]) => v !== '' && v !== null)
    );

    this.animalService.updateAnimal(this.idAnimal, formValue).subscribe(() => {
      this.editableAnimal = null;
      this.getAllAnimals(); // refresca la lista directamente
      this.toastr.success('Animal editado correctamente');
    });
  }

  deleteAnimalEntry(id: any) {
    this.animalService.deleteAnimal(id).subscribe(() => {
      this.getAllAnimals(); // refresca la lista directamente
      this.toastr.success('Animal eliminado correctamente');
    });
  }

  toggleEditAnimal(id: any) {

    this.idAnimal = id;

    console.log(id);

    this.animalService.getOneAnimal(id).subscribe({

      next: (data) => {

        console.log(data);

        this.animalForm.patchValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo
        });

        this.editableAnimal = data;

      },

      error: (err) => {
        console.log(err);
      }

    });

  }






}