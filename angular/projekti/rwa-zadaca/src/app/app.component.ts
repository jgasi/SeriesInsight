import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rwaZadaca';
  putanja = '';

  constructor() {}

  //ovo ne koristim
  prebaciNa(putanja: string, dogadaj: String) {
    console.log(dogadaj);
    this.putanja = putanja;
  }
}
