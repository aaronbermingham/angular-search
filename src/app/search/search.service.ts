import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Gituser } from './search.component';

@Injectable()
export class SearchService {
clientID: string = 'PAST YOUR CLIENT ID';
private gitUrl = 'https://api.github.com/search/users?q=';
constructor( private http: HttpClient) { }
searchUsers(term: string): Observable<Gituser[]> {
  if (!term.trim()) {
    // if not search term, return empty Git user array.
    return of([]);
  }
  return this.http.get<Gituser[]>(`${this.gitUrl}/?login=${+term}`).pipe(
    map(x => x['items']),
    tap(x => x.length ?
       console.log(`found users matching "${term}"`) :
       console.log(`no users matching "${term}"`)),
    catchError(this.handleError<Gituser[]>('searchUsers', []))
  );
}
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}


}