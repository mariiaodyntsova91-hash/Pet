import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataResponse } from '../common/interfaces';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected title = signal('Pet');

  http = inject(HttpClient);

fetchData() {
  this.http.get<DataResponse>('http://localhost:3000/api/data').subscribe((response) => {

    this.title.update(() => 'Pet - ' + response.message); // Updates the title with the response message
  });
}
}
