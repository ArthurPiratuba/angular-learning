import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

interface Task {
  task: string;
  startTime: Date;
  endTime: Date;
}

@Component({
  standalone: true,
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss']
})
export class GanttChartComponent implements OnInit {

  private tasks: Task[] = [
    { task: 'Tarefa 1', startTime: new Date(2024, 5, 1), endTime: new Date(2024, 5, 3) },
    { task: 'Tarefa 2', startTime: new Date(2024, 5, 4), endTime: new Date(2024, 5, 7) },
    { task: 'Tarefa 3', startTime: new Date(2024, 5, 5), endTime: new Date(2024, 5, 8) },
  ];

  constructor() { }

  ngOnInit(): void {
    this.createGanttChart();
  }

  private createGanttChart(): void {
    const svg = d3.select('svg');
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain([
        d3.min(this.tasks, (d: Task) => d.startTime) as Date,
        d3.max(this.tasks, (d: Task) => d.endTime) as Date
      ])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(this.tasks.map((d: Task) => d.task))
      .range([0, height])
      .padding(0.1);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat((domainValue: Date | d3.NumberValue, index: number) => {
        const date = domainValue instanceof Date ? domainValue : new Date(domainValue.valueOf());
        return d3.timeFormat("%d/%m/%Y")(date);
      }));

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));

    const bars = g.selectAll('.bar')
      .data(this.tasks)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: Task) => x(d.startTime)!)
      .attr('y', (d: Task) => y(d.task)!)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', (d, i) => color(i.toString()))
      .transition()
      .duration(1000)
      .attr('width', (d: Task) => x(d.endTime)! - x(d.startTime)!);

    // Drag behavior
    const drag = d3.drag<SVGRectElement, Task>()
      .on('drag', (event, d) => {
        const dx = event.dx;
        const newStartTime = new Date(d.startTime.getTime() + dx * (x.domain()[1].getTime() - x.domain()[0].getTime()) / width);
        const newEndTime = new Date(d.endTime.getTime() + dx * (x.domain()[1].getTime() - x.domain()[0].getTime()) / width);

        d.startTime = newStartTime;
        d.endTime = newEndTime;

        d3.select(event.sourceEvent.target)
          .attr('x', x(newStartTime)!)
          .attr('width', x(newEndTime)! - x(newStartTime)!);

        this.updateAxis(x, y);
      })
      .on('end', () => {
        this.updateData();
      });

    g.selectAll<SVGRectElement, Task>('.bar').call(drag);
  }

  private updateAxis(x: d3.ScaleTime<number, number>, y: d3.ScaleBand<string>): void {
    (d3.select('.axis--x') as d3.Selection<SVGGElement, unknown, HTMLElement, any>)
      .transition()
      .duration(500)
      .call(d3.axisBottom(x).tickFormat((domainValue: Date | d3.NumberValue, index: number) => {
        const date = domainValue instanceof Date ? domainValue : new Date(domainValue.valueOf());
        return d3.timeFormat("%d/%m/%Y")(date);
      }) as any);

    (d3.select('.axis--y') as d3.Selection<SVGGElement, unknown, HTMLElement, any>)
      .transition()
      .duration(500)
      .call(d3.axisLeft(y));
  }

  private updateData(): void {
    console.log(this.tasks);
  }
}
