import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { CanvasProps } from '../CanvasProps';
import { CanvasService } from '../canvas.service';
import { ComunicadorService } from '../comunicador.service';
import { CanvasFactory } from '../canvas-factory';
import {CentroProps} from '../centro-props';

@Component({
  selector: 'app-controles-lienzo',
  templateUrl: './controles-lienzo.component.html',
  styleUrls: ['./controles-lienzo.component.scss']
})

export class ControlesLienzoComponent implements OnInit {

  constructor(private lienzoService : CanvasService, private ref: ChangeDetectorRef, private comunicadorService: ComunicadorService){}

  editorCanvas: boolean;
  public lienzos = []; // lista objetos
  public props: CanvasProps = { // obj canvas
    canvasFill: '#ffffff',
    canvasImage: '',
    id: 1,
    nombre: null,
    opacity: null,
    fill: null,
    idCTRCentro:''
  };
  private centro: CentroProps = {
    aulas: [], canvasImage: "", height: 2000, id: 0, idCTRSede: "", width: 2000
  };
  canvas: fabric.Canvas;
  size: any;

  CanvasFactory: CanvasFactory;

  selected: fabric.Object;

  private ancho: number;
  private largo: number;
  private centroSeleccionadoID = 777;

  ngOnInit(): void {
    this.ancho = 0;
    this.largo = 0;
    this.editorCanvas = false;

    this.size = {
    width: 1000,
    height: 800
  };

    this.CanvasFactory = new CanvasFactory(this.lienzoService, this.comunicadorService);

    // ACTIVA / DESACTIVA EDICION CANVAS
    this.comunicadorService.recibirEditorObs.subscribe(data => {
      if (data === true) {
        this.editorCanvas = true;
      } else {
        this.editorCanvas = false;
      }
    });

    // ACTUALIZA OBJ CANVAS
    this.comunicadorService.recibirCanvasObs.subscribe(data => {

      this.canvas = data;
      this.selected = data.getActiveObject();
    })

    // SETTEA SIZE CENTRO
    this.comunicadorService.recibirCentroObs.subscribe(data => {
      this.centroSeleccionadoID = data
      this.lienzoService.getCentro(this.centroSeleccionadoID).subscribe(data => {
        this.size.width = data.width
        this.ancho = data.width
        // console.log('IDCENTRO '+' ****** '+data.id+' - - - - - - - - - '+data.aulas[0].idCTRCentro);
        this.lienzos = data.aulas;
        this.centro = data;

        for (let i = 0; i <= this.lienzos.length - 1; i++) {
          this.lienzos[i].idCTRCentro = this.centroSeleccionadoID;

        }
        // console.log('IDCENTRO '+' ****** '+data.id+' - - - - - -'+' -  '+this.centro.canvasImage+  '- '+' - - - '+data.aulas[0].idCTRCentro);
        this.props.canvasImage = this.centro.canvasImage


        this.canvas.setWidth(this.centro.width);
        this.canvas.setHeight(this.centro.height)

        this.changeSize()
            this.CanvasFactory.loadCanvasFromMocks(this.lienzos, this.centro);

        // this.size.width = 1
        //
        // this.size.height = this.centro.height
      });

    })

    this.changeSize()

  }


  /*
  * METODOS EDICION CANVAS
  * */
  activarEdicion(b: boolean): void {
    this.comunicadorService.enviarEditor(b);
  }

  changeSize(): void{

this.canvas.setWidth(this.size.width)
this.canvas.setHeight(this.size.height);
    this.size.width = this.ancho
    this.size.height = this.canvas.getHeight()

    this.comunicadorService.enviarCanvas(this.canvas)
}

  addFigure() : void{
this.CanvasFactory.addFigure()
}

  deleteAll(): void{
    this.CanvasFactory.confirmClear();

  this.comunicadorService.enviarCanvas(this.canvas)
}

  removeSelected(): void{

    this.CanvasFactory.removeSelected()
  }

  sendToBack(): void{
    this.CanvasFactory.sendToBack()
  }

  bringToFront(): void{
    this.CanvasFactory.bringToFront()
  }

  clone(): void{
    this.CanvasFactory.clone()
  }

  cleanSelect(): void{
    this.canvas.discardActiveObject().renderAll();
    this.CanvasFactory.cleanSelect()
  }


}
