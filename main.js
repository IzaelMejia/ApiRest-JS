
const api=axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
})
api.defaults.headers.common['X-API-KEY'] = "live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB";

//" & ":agrgar otro query param
const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=10&api_key=live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB"
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites?limit=100&api_key=live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB"
const API_URL_FAVORITES_DELETE =(id)=> `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB`
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload?limit=10&api_key=live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB"



const spanError = document.getElementById('error')

// Función mostrar img random de los michis 
async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM)// Usamos fetch para hacer peticiones a una API
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error:" + res.status;
    } else {
        const data = await res.json() //convierte en formato JSON 
        console.log(data);
        const img1 = document.getElementById('img1')
        const img2 = document.getElementById('img2')
        const img3 = document.getElementById('img3')
        const AddRandomMichis1 = document.getElementById("iconoAgregar")
        const AddRandomMichis2 = document.getElementById("iconoAgregar2")
        const AddRandomMichis3 = document.getElementById("iconoAgregar3")

        img1.src = data[0].url
        img2.src = data[1].url
        img3.src = data[2].url

        // cada boton debe tener onclick disinto
        AddRandomMichis1.onclick = () => saveFavoritesMichi(data[0].id)
        AddRandomMichis2.onclick = () => saveFavoritesMichi(data[1].id)
        AddRandomMichis3.onclick = () => saveFavoritesMichi(data[2].id)
    }

}

// Función guardar img random de los michis (GET)
async function loadFavoritesMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "x-api-key" : "live_tIRRwRusi79akNQlLJvLbnjFdiSfIW0070kpoEYKlevBIjd4J3gBlu5GnZVow2pB"
        },
    })// Usamos fetch para hacer peticiones a una API
    if (res.status !== 200) {
        spanError.innerText = "Hubo un error:" + res.status;
    } else {
        const div = document.getElementById('containerRandomMichis') //obtenemos del html
        div.innerHTML=""
        const data = await res.json() //convierte en formato JSON 
        console.log("loadFavoritesMichis", data); //data es un array 
        data.forEach(michi => {
            const section = document.getElementById('favoritesMichis') //obtenemos del html
            const article = document.createElement('article')  //creamos
            const img = document.createElement('img')       //creamos
            const button = document.createElement('button') //creamos
            const btnText = document.createTextNode('Quitar')   //creamos

            img.src = michi.image.url //a la img le pasamos el atributo src y la ruta de la img
            img.classList.add('imagenesGatos') //estilo
            button.appendChild(btnText) //unimos boton con texto 
            button.onclick = () => deleteFavoritesMichi(michi.id) //cuando hacemos click en el boton se ejecuta la funcion
            button.classList.add('buttonGeneral') //estilo
            article.appendChild(img)
            article.classList.add('containerFavorites') //estilo
            article.appendChild(button)
            div.appendChild(article)
            section.appendChild(div)
            // michi.image.url   //sacamos esta url que es la img de los michis que tiene que ser enviada al favoritos
        })
    }
}

// Función Agregar un michi a favoritos (POST) con AXIOS 
async function saveFavoritesMichi(id) {
    const {data , status} = await api.post("/favourites",{
        image_id: id
    })  
    if (status !== 200) {
        spanError.innerText = "Hubo un error:" + status + data.message;
    } else {
        console.log("Michi guardado en favoritos");
        loadFavoritesMichis()
    }
    // Sin Axios , solo fetch 
  // loadFavoritesMichis()
    // const res = await fetch(API_URL_FAVORITES, {
    //     // Enviar objeto, debe contener . headers y body
    //     method: 'POST',
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // })
    // // console.log("POST",res);


}

async function deleteFavoritesMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        // Enviar objeto, debe contener . headers y body
        method: 'DELETE',          
    })
    // console.log("POST",res);
    if (res.status !== 200) {
        spanError.innerText = "Hubo un error:" + res.status;
    } else {
        const data = await res.json() //convierte en formato JSON 
        console.log("Michi borrado");
        loadFavoritesMichis()
    }
}


async function uploadMichiPhoto() {
    // Obtén el formulario de subida de la foto de michi
    const form = document.getElementById('uploadingForm');
    // Crea un objeto FormData para recopilar datos del formulario
    const formData = new FormData(form); // Enviamos como argumento el formulario, agarra info de todos los inputs del form
    
    // Realiza una solicitud de subida de la foto al servidor
    const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        headers: {
            // puedes incluir un token de autenticación en "x-api-key"
        },
        body: formData // Adjunta los datos del formulario a la solicitud
    });

    // Verifica si la respuesta del servidor tiene un estado diferente a 201 (éxito)
    if (res.status !== 201) {
        // Si hay un error, muestra un mensaje de error en algún lugar del DOM (por ejemplo, un elemento con id "spanError")
        spanError.innerText = "Hubo un error:" + res.status;
    } else {
        // Si la subida fue exitosa (estado 201), muestra un mensaje de éxito en la consola
        console.log("Foto de michi subida con éxito");
        // Parsea la respuesta del servidor como JSON para obtener más información
        const data = await res.json();
        console.log({ data });
        console.log(data.url);
        // Llama a una función para guardar los favoritos de michi, pasando el ID de la foto
        saveFavoritesMichi(data.id);
    }
}

    


loadRandomMichis()
loadFavoritesMichis()
