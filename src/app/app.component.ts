import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorLienzoComponent } from '../app/editor-lienzo/editor-lienzo.component';

import { CanvasService } from './canvas.service';
import {CentroProps} from './centro-props';
import {ComunicadorService} from './comunicador.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private  lienzoService: CanvasService, private comunicadorService: ComunicadorService) {
  this.mostrar = false;
  }

  title = 'angular-editor-fabric-js';

  public lienzos = []; // lista objetos
  public centro: CentroProps;
  public mostrar: boolean;
  public centroSeleccionadoID: number;


  @ViewChild('canvas', { static: false }) canvas: EditorLienzoComponent;

  editorCanvas: boolean;

  ngOnInit(): void {
    this.editorCanvas = false;

    // activa / desactiva el modo edicion
    this.comunicadorService.recibirEditorObs.subscribe(data => {
      if (data === true) {
        this.editorCanvas = true;
      } else {
        this.editorCanvas = false;
      }
    });

    // muestra / oculta los centros
    this.comunicadorService.recibirMostrarObs.subscribe(data => {this.mostrar = data; console.warn(data); });

    // cuando se selecciona un centro, se carga el centro y se entra al modo edicion de canvas
    this.comunicadorService.recibirCentroObs.subscribe(data => {this.centroSeleccionadoID = data;

      // cuando se selecciona un centro, se carga
      this.lienzoService.getCentro(this.centroSeleccionadoID).subscribe(data => {
        this.lienzos = data.aulas;
        this.centro = data;

        for (let i = 0; i <= this.lienzos.length - 1; i++) {
          this.lienzos[i].idCTRCentro = data.id;

        }
        this.canvas.loadCanvasFromMocks(this.lienzos, this.centro);
      });

    });
  }

}
