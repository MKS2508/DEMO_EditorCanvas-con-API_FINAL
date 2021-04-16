import {
  ViewChild,
  ElementRef,
} from "@angular/core";
import {fabric} from "fabric";

import {ObjProps} from "./obj-props";

import {CanvasProps} from "./CanvasProps";
import {CanvasService} from "./canvas.service";
import {EditorLienzoComponent} from "./editor-lienzo/editor-lienzo.component";
import {ComunicadorService} from "./comunicador.service";
import {CentroProps} from "./centro-props";

export class CanvasFactory {



  public canvas: fabric.Canvas;
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;
  public size: any;
  public props: CanvasProps = {
    // obj canvas
    canvasFill: "#ffffff",
    canvasImage: "",
    id: 1,
    nombre: null,
    opacity: null,
    fill: null,
    idCTRCentro: "999"
  };

  seleccionado: String = "object:selected";

  public arrayProps: ObjProps[] = []
  public objetoBD: ObjProps = {
    //objBD
    id: 0,
    nombre: "a",
    lienzo: "",
    width: 0,
    height: 0,
    left_canvas: 0,
    top_canvas: 0,
    angle: 0,
    fill: "#ffffff",
    opacity: 0,
    scaleY: 1,
    scaleX: 1,
    idCTRCentro: '999'
  };

  private objetoEncontrado: ObjProps = {
    //objFind
    //objBD
    id: 0,
    nombre: "a",
    lienzo: "",
    width: 0,
    height: 0,
    left_canvas: 0,
    top_canvas: 0,
    angle: 0,
    fill: "#ffffff",
    opacity: 0,
    scaleY: 1,
    scaleX: 1,
    idCTRCentro: '999'
  };
  public selected: fabric.Object;
  private objeto2: ObjProps = { //objFind
    id: 0,
    nombre: 'a',
    lienzo: '',
    width: 0,
    height: 0,
    left_canvas: 0,
    top_canvas: 0,
    angle: 0,
    fill: '#ffffff',
    opacity: 0,
    idCTRCentro: '',
    scaleX: 1,
    scaleY: 1
  }
  private objCentro: CentroProps = {
    aulas: [], canvasImage: "", height: 1000, id: 0, idCTRSede: "888", width: 1000


  };
  private seleccionadoID: number;
  private centro: { idCTRSede: string; aulas: any[]; width: number; canvasImage: string; id: number; height: number };

  constructor(private lienzoService: CanvasService, private comunicadorService: ComunicadorService) {
    this.centro = {
      aulas: [], canvasImage: "", height: 1000, id: 0, idCTRSede: "", width: 100

    }
    this.seleccionadoID = 777
    this.size = {
      width: 1140,
      height: 800,
    };

    this.comunicadorService.recibirCentroObs.subscribe(data =>{
      this.seleccionadoID  = data
      // this.comunicadorService.enviarCentro(this.seleccionadoID)
      this.lienzoService.getCentro(data).subscribe(data2 =>{
        this.centro = data2
        this.seleccionadoID = data2.id

        this.canvas.setWidth(data2.width)
        this.canvas.setHeight(data2.height);
        this.comunicadorService.enviarCanvas(this.canvas)

      })
    })
    // this.comunicadorService.enviarCentro(this.seleccionadoID)
    this.comunicadorService.recibirSelectedObs.subscribe(data2 =>{
      this.props.id = data2.id
      this.props.nombre = data2.nombre
      this.props.fill = data2.fill
      this.props.opacity = data2.opacity
    });

    this.comunicadorService.recibirCanvasObs.subscribe(data => {
      this.canvas = data;
      this.selected = this.canvas.getActiveObject();

      this.arrayProps = [];
      for (var i = 0; i <= this.canvas.size() - 1; i++) {
        // this.objetoBD = null;

        this.objetoBD.id = data._objects[i].toObject().id;

        this.objetoBD.nombre = data._objects[i].toObject().nombre;
        this.objetoBD.width = data._objects[i].toObject().width;

        this.objetoBD.height = data._objects[i].toObject().height;
        this.objetoBD.scaleX = data._objects[i].toObject().scaleX;
        this.objetoBD.scaleY = data._objects[i].toObject().scaleY;
        this.objetoBD.idCTRCentro = data._objects[i].toObject().idCTRCentro;
        this.objetoBD.angle = data._objects[i].toObject().angle;
        this.objetoBD.fill = data._objects[i].toObject().fill;
        this.objetoBD.opacity = data._objects[i].toObject().opacity;
        this.objetoBD.left_canvas = data._objects[i].toObject().left;
        this.objetoBD.top_canvas = data._objects[i].toObject().top;
        let clone = {...this.objetoBD};

        this.arrayProps.push(clone)
        this.arrayProps.length



        // this.objetoBD.id = this.canvas.
      }
    });
  }


  /**
   * Agrega una figura basica al canvas, sin parametros
   *
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.addFigure();
   * ```
   */
  public addFigure(): void {
    // agregar rectangulo nuevo
    let add: any;
    add = new fabric.Rect({
      width: 200,
      height: 100,
      left: 10,
      top: 10,
      angle: 0,
      fill: "#3f51b5",
    });
    let randomizedId: number = this.randomId();
    this.extend(add, randomizedId, "a" + randomizedId, this.props.canvasImage);
    this.canvas.add(add);
    // this.selectItemAfterAdded(add);

    //Actualizar el canvas despues de cada cambio
    this.comunicadorService.enviarCanvas(this.canvas);
  }

  loadCanvasFromMocks(mock: ObjProps[], centro: CentroProps): void {

    var longitudObjetos = mock.length;
    this.confirmClear();

    for (var i = 0; i <= longitudObjetos - 1; i++) {
      this.addFigureParam(
        mock[i]
      );
      this.canvas.renderAll();
      this.selectItemAfterAdded(this.canvas.item(0));

    }
    this.size.width = centro.width;
    this.size.height = centro.height;
    this.canvas.setWidth(centro.height);
    this.setCanvasImageParam(centro.canvasImage);
    this.objCentro = centro;


    this.comunicadorService.enviarCanvas(this.canvas)


  } // cargar desde bd


  /**
   * Extiende el objeto del canvas con los parametros extra (ID, name...)
   *
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.extend(obj:any, id:number, nombre: string, cnvIMG:string)
   * ```
   */
  extend(obj: any, id: number, nombre: string, idCTRCentro: string): void {
    obj.toObject = (function (toObject): any {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id,
          nombre: nombre,
          idCTRCentro: idCTRCentro
        });
      };
    })(obj.toObject);
    obj.id = id;
    obj.nombre = nombre;
    idCTRCentro = this.props.idCTRCentro;


  } // este metodo extiende el objeto del canvas con los parametros extra (ID, name...)

  /**
   * Se utiliza despues de pintar un objeto, selecciona el objeto recien pintado
   *
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.selectItemAfterAdded(obj)
   * ```
   */
  selectItemAfterAdded(obj): void {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  /**
   * Genera un Identificador aleatorio para un objeto
   *
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.randomId();
   * ```
   */
  randomId(): number {
    return Math.floor(Math.random() * 999999) + 1;
  } // genera id aleatorio

  /**
   *  Agrega una figura basica al canvas, con parametros.
   *  Se utiliza para pintar los objetos recuperados de la BD
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.addFigureParam(objeto)
   * ```
   */
  addFigureParam(Objeto: ObjProps): void {
    let add: any;

    // agregar figura guardada
    let idParam: number = Objeto.id;
    let nombreParam: string = Objeto.nombre;
    let widthParam: number = Objeto.width;
    let heightParam: number = Objeto.height;
    let leftParam: number = Objeto.left_canvas;
    let topParam: number = Objeto.top_canvas;
    let angleParam: number = Objeto.angle;
    let fillParam: string = Objeto.fill;
    let opacityParam: number = Objeto.opacity;
    let scaleXparam: number = Objeto.scaleX;
    let scaleYparam: number = Objeto.scaleY;
    let idCTRCentroparam: string = Objeto.idCTRCentro

    let rect = new fabric.Rect({
      width: widthParam,
      height: heightParam,
      left: leftParam,
      top: topParam,
      angle: angleParam,
      fill: fillParam,
      opacity: opacityParam,
      scaleY: scaleYparam,
      scaleX: scaleXparam
    });

    this.extend(rect, idParam, nombreParam, idCTRCentroparam);

    this.canvas.add(rect);
    this.canvas.renderAll();
    this.selectItemAfterAdded(rect);


    //Actualizar el canvas despues de cada cambio
  }

  /**
   *  Settea la imagen de fondo del lienzo, sin parametros
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.setCanvasImage()
   * ```
   */


  /**
   *  Settea la imagen de fondo del lienzo, con parametros
   *  Se utiliza para pintar los objetos recuperados de la BD
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.setCanvasImageParam(cnvImg: string)
   * ```
   */
  setCanvasImageParam(cnvImg: string): void {
    const self = this;

    this.canvas.setBackgroundColor(
      new fabric.Pattern({source: cnvImg, repeat: "repeat"}),
      () => {
        self.props.canvasFill = "";
        self.canvas.renderAll();
      }
    );
    this.props.canvasImage = cnvImg;
    this.canvas.renderAll();
    // this.canvas.setWidth(0);
    // this.canvas.setWidth(1140);


    //Actualizar el canvas despues de cada cambio
    this.comunicadorService.enviarCanvas(this.canvas);
  }

  //getter y setter estilo canvas



  /**
   *  Busca el objeto con el id pasado como parametro en la BD, si no existe, devuelve false,
   * si existe, devuelve true
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.existe(id: string)
   * ```
   */
  existe(id: string): boolean {
    this.lienzoService
      .findLienzo(id)
      .subscribe((data) => (this.objetoEncontrado = data));

    if (this.objetoEncontrado.id != 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Si el objeto existe, lo elimina de la BD
   * ```typescript
   * Se llama desde CanvasFactory, se llama desde removeSelected
   * this.CanvasFactory.deleteCanvasFromDB(id: string)
   * ```
   */
  deleteCanvasFromDB(id: number): void {
    if (this.existe) {
      this.lienzoService
        .deleteLienzo(id)
        .subscribe((data) =>
          console.log(
            "OBJETO CON ID: " + id + "ELIMINADO DE LA BD ----- " + data
          )
        );
    }

    //Actualizar el canvas despues de cada cambio
    this.comunicadorService.enviarCanvas(this.canvas);

  }

  /**
   * Si el objeto existe, lo actualiza
   * ```typescript
   * // Se llama desde CanvasFactory
   * this.CanvasFactory.updateCanvasFromDB(Object:ObjProps)
   * ```
   */
  updateCanvasFromDB(Object: ObjProps): void {
    this.lienzoService
      .updateLienzo(Object)
      .subscribe((data) =>
        console.log(
          "OBJETO CON ID: " + Object.id + "ACTUALIZADO DE LA BD ----- " + data
        )
      );

    //Actualizar el canvas despues de cada cambio
    this.comunicadorService.enviarCanvas(this.canvas);
  } // update

  confirmClear(): void {

      this.canvas.clear();
      this.canvas.clear();
// si no se ejecuta 2 veces no se ve bien la imagen de fondo

    this.comunicadorService.enviarCanvas(this.canvas)
  }

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
    this.comunicadorService.enviarCanvas(this.canvas)

  }

  findByID(id) {
    this.lienzoService.findLienzo(id).subscribe(data => this.objeto2 = data);
    if (this.objeto2.id != 0) {
      return true;
    } else {
      return false;
    }
  } // encontrar por id, comprobar si existe


  saveCanvasToBD(id:number) {
    // this.centro.width = this.canvas.getWidth()
    // this.centro.height = this.canvas.getHeight();
    this.centro.aulas = this.arrayProps


    // this.lienzoService.updateCentro(this.centro)
    var sizeCanvas = this.arrayProps.length

    let arrayProps = [];

    // this.canvas.clear();
    for (var i = 0; i <= sizeCanvas - 1;
         i++
    ) {
      var item = this.arrayProps[i];
      if (this.findByID(item.id) === true) {//si el canvas existe, actualiza, si se cambia el id, borra y pinta
        this.lienzoService.postLienzo(item).subscribe(data => console.log(data));
      } else {
        this.lienzoService.postLienzo(item).subscribe(data => console.log(data));

      }
      this.lienzoService.addToCentro(id, item.id).subscribe(data => console.log(data))
      this.comunicadorService.enviarCanvas(this.canvas)
    }

  }


  removeSelected() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();
    const activeId = this.canvas.getActiveObject().toDatalessObject(["id", "nombre", "CNVIMG"]).id;
    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      const self = this;
      activeGroup.forEach((object) => {
        self.canvas.remove(object);
      });
    }
    this.deleteCanvasFromDB(activeId);
    this.comunicadorService.enviarCanvas(this.canvas)

  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      this.canvas.sendToBack(activeObject);
      activeObject.sendToBack();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.sendToBack();
      });
      this.comunicadorService.enviarCanvas(this.canvas)

    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      activeObject.bringToFront();
      activeObject.opacity = 1;
    } else if (activeGroup) {
      this.canvas.discardActiveObject();
      activeGroup.forEach((object) => {
        object.bringToFront();
      });
      this.comunicadorService.enviarCanvas(this.canvas)

    }
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({left: 10, top: 10});
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
      this.comunicadorService.enviarCanvas(this.canvas)
    }

  }

  setId() {
    const valID: number = this.props.id;
    const valNombre: string = this.props.nombre;
    const complete = this.canvas.getActiveObject().toObject(["id", "nombre"]);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = valID;
      complete.nombre = valNombre;
      return complete;
    };

  this.comunicadorService.enviarCanvas(this.canvas);
  }
}
