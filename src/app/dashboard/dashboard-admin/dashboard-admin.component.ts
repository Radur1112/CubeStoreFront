import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from 'src/app/share/generic.service';
import { CartService, ItemCart } from 'src/app/share/cart.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { AuthenticationService } from 'src/app/share/authentication.service';
import Chart from 'chart.js/auto';



@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  datos:any;
  destroy$:Subject<boolean>=new Subject<boolean>();
  currentUser:any;
  cantCompras: number = 0;
  topSellingProducts: any[] = [];
  chartData: number[] = [];
  chartLabels: string[] = [];
  public chart: any;
  chartData2: number[] = [];
  chartLabels2: string[] = [];
  public chart2: any;
  chartData3: number[] = [];
  chartLabels3: string[] = [];
  public chart3: any;
  topCalificaciones: any[] = [];
  worstCalificaciones: any[] = [];



constructor(
    private cartService: CartService,
    private noti: NotificacionService,
    private gService: GenericService,
    private router: Router,
    private route:ActivatedRoute,
    private auth:AuthenticationService
  ) {
    this.auth.currentUser.subscribe((x)=>(this.currentUser=x));

  }

  ngOnInit(): void {
    this.comprasHoy();
    this.fetchTopSellingProducts();
    this.topVendedores();
    this.worstVendedores();
  }

  comprasHoy(){
    this.gService.list('factura/')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.datos = data.filter((factura: any) => {
        const createdAt = new Date(factura.createdAt);
        return createdAt >= today;
      });
      this.cantCompras = this.datos.length;
    });
  }

  fetchTopSellingProducts() {
    this.gService.list('producto/top')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.topSellingProducts = data;
        this.chartData = this.topSellingProducts.map(producto => producto.salesCount);
        this.chartLabels = this.topSellingProducts.map(producto => producto.nombre);
        this.createChart();
      });
  }

  topVendedores() {
    this.gService.list('evaluacion/top')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.topCalificaciones = data;
        this.chartData2 = this.topCalificaciones.map(usuario => usuario.averageRating);
        this.chartLabels2 = this.topCalificaciones.map(usuario => usuario.nombre);
        this.createChart2();
      });
  }

  worstVendedores() {
    this.gService.list('evaluacion/bot')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data:any)=>{
        this.worstCalificaciones = data;
        this.chartData3 = this.worstCalificaciones.map(usuario => usuario.averageRating);
        this.chartLabels3 = this.worstCalificaciones.map(usuario => usuario.nombre);
        this.createChart3();
      });
  }

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'polarArea',
      // type: 'doughnut',

      data: {
        labels: this.chartLabels, 
	       datasets: [
          { label: "Vendidos este mes:", data: this.chartData,},
          ]
      },
      options: { aspectRatio:2.5}
    });
  }

  createChart2(){
    this.chart = new Chart("MyChart2", {
      type: 'bar',
      // type: 'doughnut',

      data: {
        labels: this.chartLabels2, 
	       datasets: [
          { label: "Puntuacion Promedia", data: this.chartData2,backgroundColor: [
            'rgba(100, 255, 100, 0.5)'],},
          ]
      },
      options: { aspectRatio:2.5}
    });
  }
  createChart3(){
    this.chart = new Chart("MyChart3", {
      type: 'bar',
      // type: 'doughnut',

      data: {
        labels: this.chartLabels3, 
	       datasets: [
          { label: "Puntuacion Promedia", data: this.chartData3, backgroundColor: [
            'rgba(255, 0, 0, 0.5)'],},
          ]
      },
     
      options: { aspectRatio:2.5}
    });
  }



  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
