import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class InventoryService {

  constructor(private http: Http) { }


  getInventoryGeneral(limit: number, page: number, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'inventory/general/' + limit + '/' + page+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryGeneralPackings(limit: number, page: number, code: string, attr: string = ''): Observable<any> {
    return this.http.get(environment.url + 'inventory/general/packings/' + limit + '/' + page + '?code='+ code+ '&attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPermanence(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'inventory/permanence/' + limit + '/' + page + '/'+ code+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryQuantity(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'inventory/quantity/' + limit + '/' + page + '/'+ code+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryPackingHistoric(limit: number, page: number, serial: string, code: string, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'inventory/packing/historic/' + limit + '/' + page + '/'+ serial+ '/'+ code+ '?attr='+ attr)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventoryBattery(limit: number, page: number, code: string, attr: string = ''): Observable<any> {

    return this.http.get(environment.url + 'inventory/battery/' + limit + '/' + page + '?code='+ code+ '&attr='+ attr  )
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventorySupplier(limit: number, page: number, supplier: string): Observable<any> {

    return this.http.get(environment.url + 'inventory/supplier/' + limit + '/' + page + '/'+ supplier)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getInventorySupplierByPlantAnd(limit: number, page: number, code: string, supplier: string, project: string): Observable<any> {

    return this.http.get(environment.url + 'inventory/plant/' + limit + '/' + page + '/'+ code + '/'+ supplier+ '/'+ project)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


}
