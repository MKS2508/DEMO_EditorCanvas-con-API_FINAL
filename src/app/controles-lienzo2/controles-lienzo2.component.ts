import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorLienzoComponent } from '../../app/editor-lienzo/editor-lienzo.component';
import { CanvasService } from "../../app/canvas.service";
import { ComunicadorService } from "../comunicador.service";
import { CanvasFactory } from "../canvas-factory";
import {CentroProps} from "../centro-props";

@Component({
  selector: 'app-controles-lienzo2',
  templateUrl: './controles-lienzo2.component.html',
  styleUrls: ['./controles-lienzo2.component.scss'],
})

export class ControlesLienzo2Component implements OnInit {
  public lienzos = []; // lista objetos

  private centro: CentroProps = {
    aulas: [], canvasImage: '', height: 2000, id: 0, idCTRSede: '', width: 2000

  };
  private centroSeleccionadoID: number = 777;

  constructor(private lienzoService: CanvasService, private comunicadorService: ComunicadorService) {}

  canvas: fabric.Canvas;
  size = {
    width: 10,
    height: 10
  }
  CanvasFactory: CanvasFactory;
  selected: fabric.Object;
  canvasImage: string = '';
  listaValores: Array<number>=[]
  editorCanvas: boolean;


// comunicacion entre componentes
  ngOnInit(): void {
    this.editorCanvas = false;
    this.centroSeleccionadoID = 777;
    this.CanvasFactory = new CanvasFactory(this.lienzoService, this.comunicadorService)

    //ACTIVA DESACTIVA EDICION
    this.comunicadorService.recibirEditorObs.subscribe(data => {
      if (data === true) {
        this.editorCanvas = true;
      } else {
        this.editorCanvas = false;
      }
    });

    //Actualiza canvas
    this.comunicadorService.recibirCanvasObs.subscribe(data => {this.canvas = data});

    //Carga centro y Aulas
    this.comunicadorService.recibirCentroObs.subscribe(data => {
      this.centroSeleccionadoID = data;
      this.lienzoService.getCentro(data).subscribe(data2 =>
      {
        this.centro = data2;

        this.lienzos = this.centro.aulas;

        for (let i = 0; i <= this.lienzos.length - 1; i++) {
          this.lienzos[i].idCTRCentro = data2.id;

        }

        this.listaValores.push(data2.id);
        this.listaValores.push(data2.id+22);

        this.canvasImage = this.centro.canvasImage
      });
    })

  };

// metodos  control  canvas

  public saveCanvasToDB(): void {
    // this.centroSeleccionadoID = this.listaValores[0]
    // this.canvas.saveCanvasToDB(this.centroSeleccionadoID);

this.CanvasFactory.saveCanvasToBD(this.centroSeleccionadoID)
  }

  public setCanvasImage(): void {
    this.CanvasFactory.setCanvasImageParam(this.canvasImage)
    // this.comunicadorService.enviarMensajeCanvasImage(this.canvasImage);
  }

  public mostrarCentros(): void {
    this.comunicadorService.enviarMostrar(false)
  }
}
