import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CuponClient } from 'src/app/interfaces/cupon-client';
import { Pago } from 'src/app/interfaces/pago';
import { Promocion } from 'src/app/interfaces/promocion';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apiUrl="http://localhost:5049/api"

  //private apiUrlEpisode="https://rickandmortyapi.com/api/episode"
  constructor(private http:HttpClient) { }




  pagoRegister(pago: Pago): Observable<Pago> {
    const url = `${this.apiUrl}/Pago`;
    return this.http.post<Pago>(url, pago);
  }


  cuponRegister(cuponClient: any): Observable<any> {
    const url = `${this.apiUrl}/CuponClient`;

    // Verifica que el objeto cuponClient tiene todos los campos necesarios
    console.log('Enviando cuponClient:', JSON.stringify(cuponClient, null, 2));

    return this.http.post<any>(url, cuponClient);
  }




}
