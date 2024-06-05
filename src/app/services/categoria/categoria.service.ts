import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl="http://localhost:5049/api/CuponesEmpresa/categorias"


  constructor(private http:HttpClient) { }


  getAllCategoria(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

}
