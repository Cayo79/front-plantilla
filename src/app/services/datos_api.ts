import { HttpHeaders } from '@angular/common/http';

const urlbase = 'http://localhost:8081/';

const base = urlbase + 'api/';
export const DatosApi = {
    urlBaseApi: base,
    url: urlbase,
    httpOptions: {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
};
