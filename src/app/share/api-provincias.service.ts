import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, elementAt, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiProvinciasService {


  constructor(private http: HttpClient) { }

  getProvincias(): Observable<any> {
    const url = `https://ubicaciones.paginasweb.cr/provincias.json`;
    const all = this.http.get(url).pipe(map((response: any) => response));
    return all;
  }

  getCantones(provincia:any): Observable<any> {
    const url = `https://ubicaciones.paginasweb.cr/provincia/${provincia}/cantones.json`;
    const all = this.http.get(url).pipe(map((response: any) => response));
    return all;
  }

  getDistritos(provincia:any, canton:any): Observable<any> {
    const url = `https://ubicaciones.paginasweb.cr/provincia/${provincia}/canton/${canton}/distritos.json`;
    const all = this.http.get(url).pipe(map((response: any) => response));
    return all;
  }
/*
  getProvincias(): Observable<any> {
    
    const all = this.http.get(this.url).pipe(map((response: any) => {
      const provincias = response.features.reduce((uniqueValues, feature) => {
        const nomProv = feature.attributes.NOM_PROV;
        if (!uniqueValues.includes(nomProv)) {
          uniqueValues.push(nomProv);
        }
        return uniqueValues;
      }, []);
      return provincias.sort();
    }));
    
    return all;
  }
  
  getCantones(provincia:any): Observable<any> {
    const all = this.http.get(this.url).pipe(map((response: any) => {
      const cantones = response.features.reduce((uniqueValues, feature) => {
        const nomProv = feature.attributes.NOM_PROV;
        const nomCant = feature.attributes.NOM_CANT;
        if (!uniqueValues.includes(nomProv) && nomProv == provincia) {
          uniqueValues.push(nomCant);
        }
        return uniqueValues;
      }, []);
      return cantones.sort();
    }));
    
    return all;
  }
  
  getDistritos(provincia:any, canton:any): Observable<any> {
    const all = this.http.get(this.url).pipe(map((response: any) => {
      const distritos = response.features.reduce((uniqueValues, feature) => {
        const nomProv = feature.attributes.NOM_PROV;
        const nomCant = feature.attributes.NOM_CANT;
        const nomDist = feature.attributes.NOM_DIST;
        if (!uniqueValues.includes(nomProv) && nomProv == provincia && nomCant == canton) {
          uniqueValues.push(nomDist);
        }
        return uniqueValues;
      }, []);
      return distritos.sort();
    }));
    
    return all;
  }*/
}
