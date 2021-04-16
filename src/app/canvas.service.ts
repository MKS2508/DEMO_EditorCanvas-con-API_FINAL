import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { ObjProps } from "./obj-props";
import {CentroProps} from "./centro-props";

@Injectable()
export class CanvasService {

    constructor(private http: HttpClient) {}

  private url: string =  "http://192.168.1.139:8080/centro/";
  private url3: string = "http://192.168.1.139:8080/lienzo/";
  private url5: string = "http://192.168.1.139:8080/lienzos/";
  private url6: string = "http://192.168.1.139:8080/centros/"



  getCentro(idCentro: number): Observable<CentroProps> {
        return this.http.get<CentroProps>(this.url+idCentro);
    }

  getCentros(): Observable<CentroProps[]> {
    return this.http.get<CentroProps[]>(this.url6);
  }

 // asocia un objeto existente a un centro.
  addToCentro(idCentro: number, idObj: number): Observable<CentroProps> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.http.put<CentroProps>(this.url+idCentro+'/aula/'+idObj, httpOptions);
  };

  postLienzo(newObject: ObjProps): Observable<ObjProps> {
        return this.http.post<ObjProps>(this.url3, newObject);
    };

  updateLienzo(object: any): Observable<ObjProps>{
    let httpParams = new HttpParams()
      .set('id', object.id);
    httpParams.set('nombre', object.nombre);
    httpParams.set('width',object.width);
    httpParams.set('height',object.height);
    httpParams.set('left_canvas', object.left_canvas);
    httpParams.set('top_canvas', object.top_canvas);
    httpParams.set('angle', object.angle);
    httpParams.set('fill', object.fill);
    httpParams.set('opacity', object.opacity);
    httpParams.set('scaleX', object.scaleX);
    httpParams.set('scaleY', object.scaleY)
    const httpOptions = {
      params: httpParams,
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };


    return this.http.put<ObjProps>(this.url3+object.id, httpOptions);

  };

  deleteLienzo(idObject: number): Observable<ObjProps>{

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
          };


         return this.http.delete<ObjProps>(this.url3+idObject, httpOptions);

    };

  updateCentro(object: CentroProps): Observable<CentroProps>{
    console.log(object)
      // this.postLienzo(object.aulas[0])
      // this.updateLienzo(object.aulas[1])
      // this.updateLienzo(object.aulas[2])
      // this.updateLienzo(object.aulas[3])

      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      };
         return this.http.put<CentroProps>(this.url+object.id, object, httpOptions);

    }

  postCentro(object: CentroProps): Observable<CentroProps>{
    return this.http.post<CentroProps>(this.url, object);
  }

  findLienzo(id: any): Observable<ObjProps>{
        return this.http.get<ObjProps>(this.url5+id);

    }


}

