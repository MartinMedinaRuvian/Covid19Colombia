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
        recuperadosHospitalCiudad : 0

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

    for (let item of this.ciudades) console.log(item);

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
}



},

})
