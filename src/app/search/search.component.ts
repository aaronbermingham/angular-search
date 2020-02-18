import { Component, OnInit } from '@angular/core';

import { Observable, Subject, fromEventPattern } from 'rxjs';

import {
  catchError,
  debounceTime, distinctUntilChanged, switchMap, tap
} from 'rxjs/operators';

import {SearchService} from './search.service';
import {HttpClient} from '@angular/common/http';

// Gituser 'class'
export interface Gituser {
  login: string;
  id: number;
  node_id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
}

export interface Gitreponse {
  gitUser: Gituser;
  total_count: number;
  incomplete_results: boolean;
  items: Gituser[];
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.css' ]
})
export class SearchComponent implements OnInit {
  users$: Observable<Gituser[]>;
  private searchTerms = new Subject<string>(); // Subjects are both observers and observable
  searchName: string;
  response: Gitreponse;
  gitUser: Gituser;
  private gitUrl = 'https://api.github.com/search/users?q=';
  constructor(private searchService: SearchService, private http: HttpClient) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      /* The debounceTime operator emits the latest value and helps
      in delaying the values transmitted by the root Observable for
      the specified time.
      Here, it wait 300ms after each keystroke before considering the term */
      debounceTime(300),

      /* ignore new term if same as previous term, Returns an observable
       series that carries only distinguished adjacent elements according
       to the key selector and the comparer. */
      distinctUntilChanged(),

      // RxJS operator it is widely used to get the latest value emitted by the observable
      switchMap((term: string) => this.searchService.searchUsers(term)),
    );
  }

  // method to return a specific user
  getUser(user) {
    const url = `${this.gitUrl}${user}`; // url for the user
    // gets the users url and returns it
    return this.http.get(url).pipe(
      tap(_ => console.log(`fetched user login=${user.login}`))
    ).subscribe(v => console.log(v));
  }

  selUser(gitUser) {
    console.log(gitUser);
    this.gitUser = gitUser;
    console.log(this.gitUser.login);
  }

  /*
  getUser(searchName) {
    this.http.get('https://api.github.com/search/users?q=' + this.searchName)
      .subscribe((response: Gitreponse) => {
        this.response = response;
        console.log(this.response.items[0].login);
      });
    console.log(this.searchName);
  }

  selUser(gitUser) {
    console.log(gitUser);
    this.gitUser = gitUser;
    console.log(this.gitUser.login);
  }
*/
}
