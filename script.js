let userName;
let contactName = "Todos";
let loading = false;
let visibility = "Publico";

function carregarPagina() {
    
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(messages => {
        
        const chat = document.querySelector('.chat');
        chat.innerHTML = "";
        messages = messages.data;
        
        for(let i = 0; i < messages.length; i++) {
            
            let message = "";
            
            switch(messages[i].type) {
                
                case 'private_message':
                    if(messages[i].to === userName ||  messages[i].from === userName)
                        message =   `<h1 class="container message private">
                                    <span class="time">(${messages[i].time})</span>
                                    <span class="target">${messages[i].from}</span>
                                    <span>reservadamente para</span>
                                    <span class="target">${messages[i].to}:</span>
                                    <span class="content">${messages[i].text}</span></h1>
                                    `
                    break;
                
                case 'status':
                    message = `<h1 class="container message room-activity">
                            <span class="time">(${messages[i].time})</span>
                            <span class="target">${messages[i].from}</span>
                            ${messages[i].text}</h1>
                            `
                    break;
                
                case 'message':
                    message = `<h1 class="container message">
                            <span class="time">(${messages[i].time})</span>
                            <span class="target">${messages[i].from}</span>
                            <span>para</span>
                            <span class="target">${messages[i].to}:</span>
                            <span class="content">${messages[i].text}</span></h1>
                            `
            
            }
            
            chat.innerHTML += message;

    }
            const aux = document.querySelectorAll('.message');
            console.log(aux);
            aux[aux.length - 1].scrollIntoView()

    })

}

function Online() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: userName});
}

function revelaPage() {

    const login_page = document.querySelector('section');
    login_page.classList.add('esconde');

    const main_page = document.querySelector('.page');
    main_page.classList.remove('esconde');


    window.scrollTo(0, document.body.scrollHeight);
    setInterval(Online, 5000);
    setInterval(carregarPagina, 5000);

}


function enviaMsg() {

    const message_form = document.querySelector('#message-type-box');
    const msg = {
        from: userName,     
        to: contactName,
        text: message_form.value,
        type: (visibility == "Publico" ? "message" : "private_message")
    }
    message_form.value = "";
    
    const aux = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", msg);
    aux.catch(function() {window.location.reload()});

}

function confirmar(resultado) {

    if(resultado.response.status == 400) 
        alert("Esse nick já está sendo utilizado!");
    else
    revelaPage();
} 

function login() {
    
    userName = document.querySelector('#user-name').value;
    const obj = {name: userName};

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", obj);
    promise.then(revelaPage).catch(confirmar);

}

function selecionarParticipantes(element) {

    if(loading) return;

    const previous = document.querySelectorAll('.selected');
    for(let i = 0; i < previous.length; i++) {
        previous[i].classList.add('esconde');
        previous[i].classList.remove('selected');
    }
    

    const checkmark = element.querySelector('.checkmark');
    checkmark.classList.remove('esconde');
    checkmark.classList.add('selected');

    contactName = element.querySelector('h3').innerHTML;
    console.log(contactName);

    const feedback = document.querySelector('.footer h3');
    feedback.innerHTML = `Enviando para ${contactName} (${visibility.toLowerCase()})`
}

function selectVisibility(element) {


    const previous = document.querySelector('.setted');
    previous.classList.add('esconde');
    previous.classList.remove('setted');
    

    const checkmark = element.querySelector('.checkmark');
    checkmark.classList.remove('esconde');
    checkmark.classList.add('setted');

    visibility = element.querySelector('h3').innerHTML;

    const feedback = document.querySelector('.footer h3');
    feedback.innerHTML = `Enviando para ${contactName} (${visibility.toLowerCase()})`

}

function pegarMembros() {
    
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    loading = true;

    promise.then(response => {
        contactsList = document.querySelector('#contacts')
        contactsList.innerHTML = `  
                            <div class="container contact" data-identifier="participant" onclick="selecionarParticipantes(this)">
                                <ion-icon name="people"></ion-icon></ion-icon>
                                <h3>Todos</h3>
                                <ion-icon class="selected checkmark" name="checkmark"></ion-icon>
                            </div>
                         `; 
        
        
        if(contactName !== "Todos") {
            const aux = document.querySelector('.selected');
            aux.classList.remove('.selected');
            aux.classList.add('esconde');
        }

        let chatMembers = response.data;
        for(let i = 0; i < chatMembers.length; i++) {
            let contactHTML = (contactName === chatMembers[i].name ? 
                        `
                            <div class="container contact" data-identifier="participant" onclick="selecionarParticipantes(this)">
                                <ion-icon name="md-contact"></ion-icon>
                                <h3>${chatMembers[i].name}</h3>
                                <ion-icon class="selected checkmark" name="checkmark"></ion-icon>
                            </div>
                        `
                        :
                        `
                            <div class="container contact" data-identifier="participant" onclick="selecionarParticipantes(this)">
                                <ion-icon name="md-contact"></ion-icon>
                                <h3>${chatMembers[i].name}</h3>
                                <ion-icon class="esconde checkmark" name="checkmark"></ion-icon>
                            </div>
                        `)
            contactsList.innerHTML += contactHTML;
        }
        loading = false;
    })

}

function revelaNavbar() {

    const navbar = document.querySelector('navbar');
    navbar.classList.remove('esconde');

    const ocultarDiv = document.querySelector('#ocultar-chat');
    ocultarDiv.classList.remove('esconde');

}

function escondeNavbar() {

    const navbar = document.querySelector('navbar');
    navbar.classList.add('esconde');

    const ocultarDiv = document.querySelector('#ocultar-chat');
    ocultarDiv.classList.add('esconde');
}

function addEnterEvent() {
    const input = document.querySelectorAll("input");
    input[0].addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            login();
        }
    });
    input[1].addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            enviaMsg();
        }
    });
}

addEnterEvent();
pegarMembros();
carregarPagina();
setInterval(pegarMembros, 10000);
