import {Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit} from '@angular/core';
import { fabric } from 'fabric';

import { ObjProps } from "../obj-props";

import { CanvasProps } from '../CanvasProps';
import { CanvasService } from '../canvas.service';
import {CentroProps} from "../centro-props";
import { CanvasFactory } from "../canvas-factory";
import {ComunicadorService} from "../comunicador.service";

@Component({
  selector: 'app-editor-lienzo',
  templateUrl: './editor-lienzo.component.html',
  styleUrls: ['./editor-lienzo.component.scss'],
})

export class EditorLienzoComponent implements AfterViewInit, OnInit {

  ngOnInit(): void {
// recibe y actualiza objeto canvas y objeto selected
this.comunicadorService.recibirCanvasObs.subscribe(data => {
  this.canvas = data;
  this.selected = this.canvas.getActiveObject()

});    }

  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;

  public canvas: fabric.Canvas;
  CanvasFactory: CanvasFactory = new CanvasFactory(this._lienzoService, this.comunicadorService);

  public props: CanvasProps = { // obj canvas
    canvasFill: '#ffffff',
    canvasImage: '',
    id: 1,
    nombre: null,
    opacity: null,
    fill: null,
    idCTRCentro:''
  };

  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 1140,
    height: 800
  };

  public figureEditor: boolean = false;

  public selected: fabric.Object;

  constructor(private _lienzoService: CanvasService, private ref: ChangeDetectorRef, private comunicadorService: ComunicadorService) {
  }

  // AQUI SE INICIALIZA EL CANVAS
  ngAfterViewInit(): void {

    // AQUI SE INICIALIZA EL CANVAS
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });

    this.canvas.on({
      'object:moving': (e) => {
      },
      'object:modified': (e) => {
        const selectedObject = e.target;
        this.selected = selectedObject;


      },
      'object:selected': (e) => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'red';
        let obj: ObjProps = {
          angle: 0,
          fill: "",
          height: 0,
          id: 0,
          idCTRCentro: "",
          left_canvas: 0,
          lienzo: "",
          nombre: "",
          opacity: 0,
          scaleX: 0,
          scaleY: 0,
          top_canvas: 0,
          width: 0

        }
        obj.id = selectedObject.toObject().id
        obj.nombre = selectedObject.toObject().nombre
        obj.opacity = selectedObject.toObject().opacity
        obj.fill= selectedObject.toObject().fill

        //enviar selected
        this.comunicadorService.enviarSelected(obj)
        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();
        }

        this.comunicadorService.enviarCanvas(this.canvas)
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();

      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.setCanvasImage();
    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });
    //enviar el canvas
    this.comunicadorService.enviarCanvas(this.canvas);
  }


  setCanvasImage(): void {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(
        new fabric.Pattern({
          source: this.props.canvasImage,
          repeat: "repeat",
        }),
        () => {
          self.props.canvasFill = "";
          self.canvas.renderAll();
        }
      );
    }
    this.canvas.renderAll();
    this.canvas.setWidth(0);
    this.canvas.setWidth(1140);


    //Actualizar el canvas despues de cada cambio
    this.comunicadorService.enviarCanvas(this.canvas);  } // este metodo settea la imagen de fondo del lienzo



//getter y setter estilo canvas
  getActiveStyle(styleName, object): any {
    object = object || this.canvas.getActiveObject();
    if (!object) {
      return '';
    }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }


//getter y setter
  getId(): void {
    // console.log('SIZE DEL CANVAS :' + this.canvas.size());
    this.props.id = this.canvas.getActiveObject().toObject().id;
    this.props.nombre = this.canvas.getActiveObject().toObject().nombre;

    // console.log("GET ID ACTIVADO 2 -->" + this.props.id);
    // console.log("GET NOMBRE ACTIVADO 2 -->" + this.props.nombre);
  }

  getOpacity(): void {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  //limpia el lienzo entero, no los borra de la bd

  resetPanels(): void {
    this.figureEditor = false;
  }

  loadCanvasFromMocks(mock: ObjProps[], centro: CentroProps):void {
  this.CanvasFactory.loadCanvasFromMocks(mock, centro)
  }
}
