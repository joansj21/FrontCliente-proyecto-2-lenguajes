import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  private apiUrl="http://localhost:5049/api"


  constructor(private http:HttpClient) { }


  getAllCupon(): Observable<any> {
    // Agrega los parámetros de consulta a la URL
    const url = `${this.apiUrl}/CuponesEmpresa`;
    return this.http.get<any>(url);
  }

  getCarritoCupon(id:number): Observable<any> {
    // Agrega los parámetros de consulta a la URL
    const url = `${this.apiUrl}/CuponesEmpresa/`+id;
    return this.http.get<any>(url);
  }




}
