import { Component, OnInit } from '@angular/core';
import {ComunicadorService} from "../comunicador.service";
import {CentroProps} from "../centro-props";
import {FormControl, FormGroup} from "@angular/forms";
import {CanvasService} from "../canvas.service";
import { CanvasFactory } from '../canvas-factory';

@Component({
  selector: 'app-menu-centro',
  templateUrl: './menu-centro.component.html',
  styleUrls: ['./menu-centro.component.scss']
})
export class MenuCentroComponent implements OnInit {

  public centro: CentroProps
  public listaCentros: Array<CentroProps>;
  private CanvasFactory: CanvasFactory;

  constructor(private comunicadorService: ComunicadorService, private lienzoService: CanvasService) { }

 public props: CentroProps = {
    id:0,
    width:"1000",
    height:"2000",
    canvasImage:"",
    idCTRSede:"",
    aulas: []
  }
  // form nuevo centro
  centroForm = new FormGroup({
    id: new FormControl(''),
    width: new FormControl(''),
    height: new FormControl(''),
    canvasImage: new FormControl(''),
  });

  mostrarNew: boolean = false;




  ngOnInit(): void {
    this.listaCentros = [this.centro, this.centro, this.centro, this.centro];
    this.CanvasFactory = new CanvasFactory(this.lienzoService, this.comunicadorService);
    this.centro = {
      id:555,
      width:"1000",
      height:"2000",
      canvasImage:"3333",
      idCTRSede:"",
      aulas: []
    }

    // obtiene los centros
    this.lienzoService.getCentros().subscribe(data =>{
      this.listaCentros = []
      this.listaCentros = data

    });

  }

  // metodos control / edicion centros

  onSubmit(){
    this.props.id = this.centroForm.value.id;
    this.props.width = this.centroForm.value.width;
    this.props.height = this.centroForm.value.height;
    this.props.canvasImage = this.centroForm.value.canvasImage;
    this.insertOnBD();
  } // submit formulario

  mostrar(bol: boolean){
    this.mostrarNew = bol
    if(this.mostrarNew == false){
      // @ts-ignore

      this.mostrarNew

    } else {
      // @ts-ignore
      this.mostrarNew == false

    }
  }

  editar(idCentro: number){
    this.comunicadorService.enviarMostrar(true);

    this.comunicadorService.enviarCentro(idCentro);

  }

  eliminarCentro(id: number) {

  }

  visualizar(id: number) {

  }

  insertOnBD(){
    this.lienzoService.postCentro(this.props).subscribe(data => {console.log(data)})
  }

}
