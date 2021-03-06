new Vue({
  el: "#app",

  created() {
  this.verFechaActual();
  this.getDatos();
  this.llenarEdades();
  },

  data: {
    url_api: 'https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json',
    datos : [],
    titulo: "COVID19 EN COLOMBIA",
    tiempo: 0,
    totalCasos: 0,
    numeroCasos: 0,
    ciudades: [],    
    ciudad: '',
    numeroRecuperados: 0,
    numeroCasa: 0,
    numeroHospitales: 0,
    numeroHospitalesU: 0,
    numeroFallecidos: 0,
    numeroRecuperadosCiudad: 0,
    numeroCasaCiudad: 0,
    numeroHospitalesCiudad: 0,
    numeroHospitalesU_ciudad: 0,
    numeroFallecidosCiudad: 0,
    fechaActual: "02/20/2020",
    hombres: 0,
    mujeres: 0,
    totalHombresCiudad: 0,
    totalMujeresCiudad: 0,
    recuperadosHospital: 0,
    recuperadosHospitalCiudad: 0,
    edades: [],
    edad: 23,
    totalEdad: 0,
    edadRecuperados: 0,
    edadRecuperadosHospital: 0,
    edadCasa: 0,
    edadHospitales: 0,
    edadHospitalesU: 0,
    edadFallecidos: 0,
    edadHombres: 0,
    edadMujeres: 0,
    tiposContagio: [],
    tipoContagio:'Importado',
    totalTipoContagio:0,
    tipoContagioRecuperados:0,
    tipoContagioRecuperadosHospitales:0,
    tipoContagioCasa:0,
    tipoContagioHospitales:0,
    tipoContagioHospitalesU:0,
    tipoContagioFallecidos:0,
    tipoContagioHombres:0,
    tipoContagioMujeres:0

  },

  methods: {
    
      async getDatos() {
      const respuesta = await fetch(this.url_api);
      const datos = await respuesta.json(); 
      this.datos = await datos.data;

      this.totalCasos = this.datos.length;
      this.getTotalCasosCiudad();
      this.getCiudades();
      this.getTotalEdad();
      this.getTotalAtencion(false);
      this.totalCasosGenero(false);
      this.getTiposdeContagio();
      this.totalTipoContagioCiudad();
      //this.getTest();
    },

   async getTest(){
      for(let dato of this.datos){
        console.log(dato);
      }
    },

     getTotalCasosCiudad() {
      let total = 0;
      for (let dato of this.datos) {
        if (dato[11] === this.ciudad) {
          total++;
        }
      }
      this.numeroCasos = total;
      this.getTotalAtencion(true);
      this.totalCasosGenero(true);
      this.totalTipoContagioCiudad();

    },
    verFechaActual() {
      let date = new Date();
      this.fechaActual =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    },

     getCiudades() {
      let ciudades = [];
      for (let dato of this.datos) {     
        ciudades.push(dato[11]);     
      }
      this.ciudades = new Set(ciudades);
      this.ciudades = Array.from(this.ciudades);
      this.ciudades.sort();
      this.ciudad =this.ciudades[0];
    },

   getTotalAtencion(conCiudad){
 if(!conCiudad){
    this.numeroRecuperados =  this.getAtencion("Recuperado", conCiudad);
    this.numeroCasa =  this.getAtencion("Casa", conCiudad);
    this.numeroHospitales =   this.getAtencion("Hospital", conCiudad);
    this.numeroHospitalesU =  this.getAtencion("Hospital UCI", conCiudad);
    this.numeroFallecidos =  this.getAtencion("Fallecido", conCiudad);
    this.recuperadosHospital =  this.getAtencion("Recuperado (Hospital)", conCiudad);
 }else{
    this.numeroRecuperadosCiudad =  this.getAtencion("Recuperado", conCiudad);
    this.numeroCasaCiudad =  this.getAtencion("Casa", conCiudad);
    this.numeroHospitalesCiudad =   this.getAtencion("Hospital", conCiudad);
    this.numeroHospitalesU_ciudad =  this.getAtencion("Hospital UCI", conCiudad);
    this.numeroFallecidosCiudad =  this.getAtencion("Fallecido", conCiudad);
    this.recuperadosHospitalCiudad =  this.getAtencion("Recuperado (Hospital)", conCiudad);
 }
    },

    getAtencion(atencion, conCiudad) {
      let numeroCasoss = 0;
      for(let dato of this.datos){
          if(conCiudad){
              if(dato[13] === atencion && dato[11] === this.ciudad){
                  numeroCasoss ++;
              }
          }else{
              if(dato[13] === atencion){
                  numeroCasoss ++;
              }
          }
      }
      return numeroCasoss;
    },
     totalCasosGenero(conCiudad){
     if(!conCiudad){
         this.hombres = this.getCasosGenero(conCiudad, 'M');
         this.mujeres = this.getCasosGenero(conCiudad, 'F');
     }else{
        this.totalHombresCiudad = this.getCasosGenero(conCiudad, 'M');
        this.totalMujeresCiudad = this.getCasosGenero(conCiudad, 'F');
     }
    },
    getCasosGenero(conCiudad, genero) {
      let total = 0;

      for(let dato of this.datos){
          if(conCiudad){
              if(dato[11] === this.ciudad && dato[15] === genero){
               total ++;
              }
          }else{
            if(dato[15] === genero){
                total++;
            }  
          }
      }
      return total;
    },

    llenarEdades() {
      for (let i = 1; i < 100; i++) {
        this.edades.push(i);
      }
    },

    getTotalEdad() {
      let total = 0;

      for(let dato of this.datos){
          if(dato[14] == this.edad){
              total ++;
          }
      }
      this.totalEdad = total;     
      this.getTotalEdadyAtencion();
    },

   getTotalEdadyAtencion() {
     this.edadRecuperados =  this.getEdadyAtencion("Recuperado");
     this.edadCasa =  this.getEdadyAtencion("Casa");
     this.edadHospitales =  this.getEdadyAtencion("Hospital");
     this.edadHospitalesU =  this.getEdadyAtencion("Hospital UCI");
     this.edadFallecidos =  this.getEdadyAtencion("Fallecido");
     this.edadRecuperadosHospital =  this.getEdadyAtencion("Recuperado (Hospital)");
     this.edadHombres =  this.getGeneroEdad('M');
     this.edadMujeres =  this.getGeneroEdad('F');
    },

    getEdadyAtencion(atencion) {
      let total = 0;
      for(let dato of this.datos){
          if(dato[13] === atencion && dato[14] == this.edad){
              total ++;
          }
      }
      return total;
    },

    getGeneroEdad(genero) {
       let total = 0;

       for(let dato of this.datos){
           if(dato[14] == this.edad && dato[15] === genero){
            total ++;
           }
       }
    return total;
    },
     getTiposdeContagio() {
        let contagios = [];
        for(let dato of this.datos){
            contagios.push(dato[16]);
        }
        this.tiposContagio = new Set(contagios);
        this.tiposContagio = Array.from(this.tiposContagio);
        this.tiposContagio.sort();   
      },
   
       totalTipoContagioCiudad(){
          let total = 0;
          for(let dato of this.datos){
              if(dato[16] == this.tipoContagio && dato[11]=== this.ciudad){
                  total++;
              }
          }
          this.totalTipoContagio = total;
          this.contagioCiudad();
      },

    contagioCiudad(){
    this.tipoContagioRecuperados =  this.getDatosContagioCiudad('Recuperado');
    this.tipoContagioRecuperadosHospitales =  this.getDatosContagioCiudad('Recuperado (Hospital)');
    this.tipoContagioCasa =  this.getDatosContagioCiudad('Casa');
    this.tipoContagioFallecidos =  this.getDatosContagioCiudad('Fallecido');
    this.tipoContagioHospitales =  this.getDatosContagioCiudad('Hospital');
    this.tipoContagioHospitalesU =  this.getDatosContagioCiudad('Hospital UCI');
     this.totalContagioCiudadGenero();
   }, 

    totalContagioCiudadGenero(){
    this.tipoContagioHombres = this.getDatosContagioCiudadGenero('M');
    this.tipoContagioMujeres = this.getDatosContagioCiudadGenero('F');
   },
  
   getDatosContagioCiudad(atencion) {
       let total = 0;
       for(let dato of this.datos){
            if(dato[16] == this.tipoContagio && dato[11]=== this.ciudad && dato[13] === atencion){
                total ++;
            }       
       }
       return total;
      },
       getDatosContagioCiudadGenero(genero){
          let total = 0;
          for(let dato of this.datos){
            if( dato[16] == this.tipoContagio && dato[11]=== this.ciudad && dato[15] === genero){
                total ++;
            }
          }
          return total;
      }
    
   
  },
});
