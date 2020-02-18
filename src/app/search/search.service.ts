import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Gituser } from './search.component';

@Injectable()
export class SearchService {

private gitUrl = 'https://api.github.com/search/users?q='; // URL that user login will be added to
constructor( private http: HttpClient) { }

// method that searches for GitUsers
searchUsers(term: string): Observable<Gituser[]> {
  if (!term.trim()) {
    // if not search term, return empty Git user array.
    return of([]);
  }
  return this.http.get<Gituser[]>(`${this.gitUrl}${term}`).pipe( // pipe allows multiple functions to be combined
    map(x => x['items']), // map transforms the object
    tap(x => x.length ? // tap performs side effects only when the Observable returned by tap is subscribed
       console.log(`found users matching "${term}"`) : // message for found users
       console.log(`no users matching "${term}"`)), // message for when user is not found
    catchError(this.handleError<Gituser[]>('searchUsers', [])) // error catching
  );
}

// method that handles any errors
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {


    console.error(error); // log to console

    console.log(`${operation} failed: ${error.message}`); // log error message

    return of(result as T);
  };
}

}
