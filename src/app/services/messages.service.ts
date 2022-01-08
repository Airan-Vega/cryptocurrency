import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor() {}

  guardar(message: string) {
    Swal.fire('Guardado', message, 'success');
  }

  actualizar(message: string) {
    Swal.fire('Actualizado', message, 'success');
  }

  borrar(title: string, message: string) {
    Swal.fire(title, message, 'success');
  }

  confirmar(title: string, message: string) {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
    });
  }

  errorApi(message: string, err: HttpErrorResponse) {
    console.warn(err);
    Swal.fire({
      icon: 'error',
      title: 'Error en la petición de la API',
      text: message,
    });
  }

  errorNoExiste(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
    });
  }
}
