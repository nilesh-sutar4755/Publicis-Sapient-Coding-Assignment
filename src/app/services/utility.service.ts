import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private httpClient: HttpClient) {

  }

  range(start, end) {
    return ([...Array(end + 1).keys()].filter(value => end >= value && start <= value));
  }

  getAPICall(serviceEndpoint,url): Observable<any> {
    return this.httpClient.get(serviceEndpoint + url)
  }

}
