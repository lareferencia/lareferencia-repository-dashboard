import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  readFileContent(file: File): Observable<string> {
    return new Observable((obs) => {
      const reader = new FileReader();
      reader.onload = () => {
        obs.next(reader.result.toString());
      };
      reader.readAsText(file);
    });
  }
}
