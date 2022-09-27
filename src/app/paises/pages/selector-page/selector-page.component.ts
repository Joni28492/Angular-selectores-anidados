import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario:FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  //llenar selectores
  regiones: string[] =[]
  paises:PaisSmall [] = []
  // fronteras : string [] = []
  fronteras : PaisSmall [] = []
  //UI
  cargando:boolean = false;


  constructor(private fb:FormBuilder,
              private paisService:PaisesService,
    ) { }

  ngOnInit(): void {
    this.regiones = this.paisService.regiones;

    //cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region=>{
    //     console.log(region)

    //     this.paisService.getPaisesPorRegion(region)
    //     .subscribe( paises => {
    //       console.log(paises)
    //       this.paises = paises;
    //     })
    //   })

    //limpio
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(( _ ) => { 
          this.miFormulario.get('pais')?.reset('') 
          this.cargando=true;
       
        }),
        switchMap( region => this.paisService.getPaisesPorRegion(region)),
        
      )
      .subscribe( paises =>{ 
        this.paises = paises 
        this.cargando=false;
      })
      
    //cuando cambia el pais 
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap(()=>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('')
        this.cargando=true;
      }),
      switchMap( codigo => this.paisService.getPaisPorCodigo(codigo) ),
      switchMap( pais => this.paisService.getPaisesPorCodigos( pais?.borders! ))
    )
    .subscribe(paises=> {
        // this.fronteras = pais?.borders || []
        console.log(paises)
        this.fronteras=paises;
        this.cargando=false;
    })

  }

  guardar(){
    console.log(this.miFormulario.valid)
  }

}
