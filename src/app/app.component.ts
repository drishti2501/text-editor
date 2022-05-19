import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  randomId: any;
  constructor(private router: Router) {}
  goToEditor() {
   this.randomId = Math.floor(Math.random() * 100);
   this.router.navigate(['/editor'],{queryParams: {id: this.randomId}})
  }
  
}
