import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl="http://localhost:5049/api"

  //private apiUrlEpisode="https://rickandmortyapi.com/api/episode"
  constructor(private http:HttpClient) { }


  UserLogin(mail: string, pass: string): Observable<User> {
    // Agrega los parámetros de consulta a la URL
    const url = `${this.apiUrl}/User?mail=${mail}&password=${pass}`;
    return this.http.get<User>(url);
  }

  userRegister(user: User): Observable<User> {
    const url = `${this.apiUrl}/User`;
    return this.http.post<User>(url, user);
  }
}
