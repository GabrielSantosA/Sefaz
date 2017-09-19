import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { GC16 } from '../shared/models/gc16';
import { environment } from '../../environments/environment';

@Injectable()
export class GC16Service {

  constructor(private http: Http) { }

  getGC16sPagination(limit: number, page: number, attr: any): Observable<any> {
    return this.http.get(environment.url + 'gc16/list/all/pagination/' + limit + '/' + page+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveAll(): Observable<any> {
    return this.http.get(environment.url + 'gc16/list/all')
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  retrieveGC16(id: string): Observable<any>{
    return this.http.get(environment.url + 'gc16/retrieve/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateGC16(id: string, gc16: GC16): Observable<any>{
    return this.http.put(environment.url + 'gc16/update/' + id,gc16)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteGC16(id: string): Observable<any>{
    return this.http.delete(environment.url + 'gc16/delete/' + id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  createGC16(gc16: GC16): Observable<any>{
    console.log(gc16);
    return this.http.post(environment.url + 'gc16/create', gc16)
      .map((res: Response) => res.json())
      .catch((error: any) => {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
      });
  }

}
