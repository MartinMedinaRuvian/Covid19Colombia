const app = new Vue({
    el:'#app',

    created() {
        this.getTotalCasos();
        this.getDatos();
        this.getCiudades();
        this.getTotalAtencion();
        this.getCiudadVisitante();
        this.getGenero(false);
        this.getGenero(true);
        this.llenarEdades();
        this.getTotalEdad();
        this.getTiposdeContagio();
        //this.getDatosContagio();
    },

    data:{
        titulo:'COVID19 EN COLOMBIA',
        tiempo:0,
        valor_dolar: null,
        fecha : new Date().toISOString().substr(0,10),
        fecha_maxima : new Date().toISOString().substr(0,10),
        ciudad:'Cúcuta',
        ip:0,
        totalCasos:0,
        numeroCasos:0,
        ciudades:[],
        numeroRecuperados:0,
        numeroCasa:0,
        numeroHospitales:0,
        numeroHospitalesU:0,
        numeroFallecidos:0,
        numeroRecuperadosCiudad:0,
        numeroCasaCiudad:0,
        numeroHospitalesCiudad:0,
        numeroHospitalesU_ciudad:0,
        numeroFallecidosCiudad:0,
        fechaActual:"02/20/2020",
        hombres:0,
        mujeres:0,
        totalHombresCiudad:0,
        totalMujeresCiudad:0,
        recuperadosHospital : 0,
        recuperadosHospitalCiudad : 0,
        edades:[],
        edad:23,
        totalEdad: 0,
        edadRecuperados:0,       
        edadRecuperadosHospital:0,       
        edadCasa:0,
        edadHospitales:0,
        edadHospitalesU:0,
        edadFallecidos:0,
        edadHombres:0,
        edadMujeres:0,
        //Version 1.3
        tiposContagio:[],
        tcontagio:"Importado",
        totalCu:0,
        canMConta:0,canEnHospitala:0,canHConta:0,canRhospital:0,canRcasa:0,canFa:0,cantR:0,canUCI:0
    },



    methods: {

        getDatos(){

            let ciudad = this.ciudad;
            let total =0;
           
        const url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;
            try {
                this.$http.get(url_api).then((response)=>{
                    for (var i = 0; i < response.data.data.length; i++) {
                       if(response.data.data[i][10] === ciudad){
                           total++;
                       }
                   } 
                    this.numeroCasos = total;            
                });
            } catch (error) {
               console.log(err)
           }
           this.getTotalAtencion();
           this.getGenero(true); 
           
       },


       getTotalCasos(){
        var f = new Date();
        this.fechaActual=f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

        const url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;
        try {
         this.$http.get(url_api).then((response)=>{
          this.totalCasos = response.data.data.length;            
      });
     } catch (error) {
        console.log(err)
    }
},

getCiudades(){
    let ciudades = []; 
    let url="https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json";
    try{
        this.$http.get(url).then((response)=>{
           
            for (var i = 0; i < response.data.data.length; i++) {
                ciudades[i] = response.data.data[i][10];
           }  
           this.ciudades = new Set(ciudades);
           this.ciudades = Array.from(this.ciudades);
           this.ciudades.sort();
       });
    }catch(error){
        console.log(error)
    }
},

getDatosContagio(){
let url="https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json";
    try{
        this.$http.get(url).then((response)=>{
           let totalCout=0;let canEnHospital=0;let canMConta1=0;var canHConta1=0;var canRhospital1=0;var canRcasa1=0;var canFa1=0;var cantR1=0;var canUCI1=0;
            for (var i = 0; i < response.data.data.length; i++) {
                if(response.data.data[i][15]==this.tcontagio){
                    if(response.data.data[i][15]==this.tcontagio && response.data.data[i][10]===this.ciudad)totalCout++;
                    if(response.data.data[i][12]==="Recuperado" && response.data.data[i][10]===this.ciudad) cantR1++;
                    if(response.data.data[i][12]==="Casa" && response.data.data[i][10]===this.ciudad) canRcasa1++;
                    if(response.data.data[i][12]==="Hospital" && response.data.data[i][10]===this.ciudad)canEnHospital++;
                    if(response.data.data[i][12]==="Hospital UCI" && response.data.data[i][10]===this.ciudad)canUCI1++;
                    if(response.data.data[i][12]==="Fallecido" && response.data.data[i][10]===this.ciudad)canFa1++;
                    if(response.data.data[i][12]==="Recuperado (Hospital)" && response.data.data[i][10]===this.ciudad)canRhospital1++;
                    if(response.data.data[i][14] === "M" && response.data.data[i][10]===this.ciudad) canHConta1++;
                    if(response.data.data[i][14] === "F" && response.data.data[i][10]===this.ciudad) canMConta1++;
                }
           }  
           this.canEnHospitala=canEnHospital;
           this.totalCu=totalCout;
           this.canMConta=canMConta1;
           this.canHConta=canHConta1;
           this.canRhospital=canRhospital1;
           this.canRcasa=canRcasa1;
           this.canFa=canFa1;
           this.cantR=cantR1;
           this.canUCI=canUCI1;
       });
    }catch(error){
        console.log(error)
    }
},

getCiudadVisitante(){
    let urlip = 'https://api.ipify.org/?format=json'; //Obtener IP
    try{
        this.$http.get(urlip).then((response)=>{
           let url_apiIP='http://geoplugin.net/json.gp?ip='+response.data.ip;
           this.$http.get(url_apiIP).then((responsee)=>{
            this.ciudad=responsee.data.geoplugin_city;
           });
        });
    }catch(error){
        console.log(error);
    }
},

getTotalAtencion(){
    this.getAtencion('Recuperado', false);
    this.getAtencion('Casa', false);
    this.getAtencion('Hospital', false);
    this.getAtencion('Hospital UCI', false);
    this.getAtencion('Fallecido', false);
    this.getAtencion('Recuperado (Hospital)', false);

    this.getAtencion('Recuperado', true);
    this.getAtencion('Casa', true);
    this.getAtencion('Hospital', true);
    this.getAtencion('Hospital UCI', true);
    this.getAtencion('Fallecido', true);
    this.getAtencion('Recuperado (Hospital)', true);
},

getAtencion(atencion, conCiudad){
    let url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;

    let numeroCasoss=0;
    let ciudad = this.ciudad;

    try {
        this.$http.get(url_api).then((response)=>{

            for(let i=0; i< response.data.data.length; i++){


                if(response.data.data[i][12] === atencion && conCiudad){
                    if(response.data.data[i][10] === ciudad){
                        numeroCasoss ++;  
                    }                               
                }else{

                    if(response.data.data[i][12] === atencion && !conCiudad){
                            numeroCasoss ++;                                                      
                    }

                }

            }    
            if(atencion==="Recuperado" && !conCiudad) this.numeroRecuperados=numeroCasoss;
            if(atencion==="Casa" && !conCiudad) this.numeroCasa=numeroCasoss;
            if(atencion==="Hospital" && !conCiudad) this.numeroHospitales=numeroCasoss;
            if(atencion==="Hospital UCI" && !conCiudad) this.numeroHospitalesU=numeroCasoss;
            if(atencion==="Fallecido" && !conCiudad) this.numeroFallecidos=numeroCasoss;
            if(atencion==="Recuperado (Hospital)" && !conCiudad) this.recuperadosHospital=numeroCasoss;

            if(atencion==="Recuperado" && conCiudad) this.numeroRecuperadosCiudad=numeroCasoss;
            if(atencion==="Casa" && conCiudad) this.numeroCasaCiudad=numeroCasoss;
            if(atencion==="Hospital" && conCiudad) this.numeroHospitalesCiudad=numeroCasoss;
            if(atencion==="Hospital UCI" && conCiudad) this.numeroHospitalesU_ciudad=numeroCasoss;
            if(atencion==="Fallecido" && conCiudad) this.numeroFallecidosCiudad=numeroCasoss;
            if(atencion==="Recuperado (Hospital)" && conCiudad) this.recuperadosHospitalCiudad=numeroCasoss;


        });
    } catch (error) {
       console.log(err)
   }
},

getTiposdeContagio(){
let contagios = []; 
    let url="https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json";
    try{
        this.$http.get(url).then((response)=>{
            for (var i = 0; i < response.data.data.length; i++) {
                contagios[i] = response.data.data[i][15];
           }  
           this.tiposContagio = new Set(contagios);
           this.tiposContagio= Array.from(this.tiposContagio);
           this.tiposContagio.sort();
       });
    }catch(error){
        console.log(error)
    }
},
getGenero(conCiudad){

    let url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;

    let hombres = 0;
    let mujeres = 0;

    let ciudad = this.ciudad;

    try {
        this.$http.get(url_api).then((response)=>{

            for(let i=0; i< response.data.data.length; i++){
                let genero = response.data.data[i][14];
                let ciudadApi = response.data.data[i][10];


              if(conCiudad){
                if(genero === 'F' && ciudadApi === ciudad){
                    mujeres ++;
                    }else if(genero === 'M' && ciudadApi === ciudad){
                        hombres ++;
                    }
              }else{
                if(genero === 'F'){
                    mujeres ++;
                    }else if(genero === 'M'){
                        hombres ++;
                  }
              }
            }
          if(conCiudad){
            this.totalHombresCiudad = hombres;
            this.totalMujeresCiudad = mujeres;
          }else{
            this.hombres = hombres;
            this.mujeres = mujeres;
          }
              
        });
        
      
    } catch (error) {
       console.log(err)
   }
},

llenarEdades(){
    for(let i= 1; i < 100; i++){
        this.edades.push(i);
    }
},

getTotalEdad(){

    let url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;
    let total = 0;

    let edad = this.edad;

    try {
        this.$http.get(url_api).then((response)=>{

            for(let i=0; i< response.data.data.length; i++){
            let edadApi = response.data.data[i][13];
                if(edadApi == edad){
                    total ++;
                }
            }
           this.totalEdad = total;
        })

    } catch (error) {
        console.log(error);
    }

    this.getTotalEdadyAtencion();
},

getTotalEdadyAtencion(){
    this.getEdadyAtencion('Recuperado');
    this.getEdadyAtencion('Casa');
    this.getEdadyAtencion('Hospital');
    this.getEdadyAtencion('Hospital UCI');
    this.getEdadyAtencion('Fallecido');
    this.getEdadyAtencion('Recuperado (Hospital)');
    this.getGeneroEdad();
},


getEdadyAtencion(atencion){
  
    let url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;
    let numeroCasoss = 0;
 


    let edad = this.edad;

    try {
        this.$http.get(url_api).then((response)=>{

            for(let i=0; i< response.data.data.length; i++){
            let edadApi = response.data.data[i][13];
            let atencionApi = response.data.data[i][12];
            if(atencionApi===atencion && edadApi == edad){
                numeroCasoss ++
            } 
            }

            if(atencion==="Recuperado") this.edadRecuperados=numeroCasoss;
            if(atencion==="Casa") this.edadCasa=numeroCasoss;
            if(atencion==="Hospital") this.edadHospitales=numeroCasoss;
            if(atencion==="Hospital UCI") this.edadHospitalesU=numeroCasoss;
            if(atencion==="Fallecido") this.edadFallecidos=numeroCasoss;
            if(atencion==="Recuperado (Hospital)") this.edadRecuperadosHospital=numeroCasoss;
          
        })

    } catch (error) {
        console.log(error);
    }
},

getGeneroEdad(){

    let url_api = `https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json`;

    let hombres = 0;
    let mujeres = 0;

    let edad = this.edad;

    try {
        this.$http.get(url_api).then((response)=>{

            for(let i=0; i< response.data.data.length; i++){
                let genero = response.data.data[i][14];
                let edadApi = response.data.data[i][13];
                
                if(genero === 'F' && edadApi == edad){
                    mujeres ++;
                    }else if(genero === 'M' && edadApi == edad){
                        hombres ++;
                    }
              
            }
    
            this.edadHombres = hombres;
            this.edadMujeres = mujeres;

              
        });
        
      
    } catch (error) {
       console.log(err)
   }
}


},

})
