import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { fabric } from "fabric";
import { CanvasProps } from "../app/CanvasProps";
import {ObjProps} from "./obj-props";

@Injectable({
  providedIn: 'root'
})
export class ComunicadorService {

  mostrar: boolean;


  constructor() { }


 //BLOQUE 1: mostrar/ocultar menu centros
  private mostrarEmitter = new EventEmitter<boolean>();
  recibirMostrarObs = this.mostrarEmitter.asObservable();

  private editorEmitter = new BehaviorSubject<boolean>(false);
  recibirEditorObs = this.editorEmitter.asObservable();

  private initialState: 0;
  private seleccionarCentroEmitter = new BehaviorSubject<number>(this.initialState);

  // private seleccionarCentroEmitter = new EventEmitter<number>();
  recibirCentroObs = this.seleccionarCentroEmitter.asObservable();

  enviarMostrar(mostrar: boolean){
    this.mostrarEmitter.next(mostrar);
  }

  enviarEditor(mostrar: boolean){
    this.editorEmitter.next(mostrar);
  }

  enviarCentro(centroID: number){
  this.seleccionarCentroEmitter.next(centroID);
  }
  // FIN 1

//BLOQUE 2: Canvas
  canvas: fabric.Canvas
  private canvasEmitter = new EventEmitter<fabric.Canvas>();
  recibirCanvasObs = this.canvasEmitter.asObservable();


  objProps: ObjProps
  private selectedEmitter = new EventEmitter<ObjProps>();
  recibirSelectedObs = this.selectedEmitter.asObservable()

  enviarSelected(obj: ObjProps){
    console.error(obj)
    this.selectedEmitter.next(obj)
  }

  enviarCanvas(canvas: fabric.Canvas){
    this.canvasEmitter.next(canvas
    )
  }
}
