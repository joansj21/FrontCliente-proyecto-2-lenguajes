import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuponClientService {

  private apiUrl="http://localhost:5049/api"


  constructor(private http:HttpClient) { }

  cuponListUser(id: number): Observable<any> {
    const url = `${this.apiUrl}/CuponClient/${id}`;


    return this.http.get<any>(url);
  }




}
