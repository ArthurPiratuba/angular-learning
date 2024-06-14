import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GanttChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gantt-chart-demo';
}
