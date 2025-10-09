import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { DashboardComponent } from './admin/dashboard/dashboard.component';



@Component({
  selector: 'app-root',
  standalone : true,
  imports: [
    CommonModule,
    RouterOutlet
],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title = 'angular';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      const title = data['title'] || 'Toolify';  // título por defecto
      this.titleService.setTitle(title);
    });
  }
}
