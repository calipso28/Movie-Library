'use strict';

// KONSTANTEN / VARIABLEN
const elements = {};
let filepath = 'movie-data/movies.json';
let data = "";
let genreset = new Set();
let movielistgenre;

// FUNKTIONEN
const domMapping = () => {
    elements.main = document.querySelector('main');
    elements.container = document.querySelector('.container');
    elements.movielist = document.querySelector('.movielist');
    elements.moviegenre = document.querySelector('.moviegenre');
    elements.btnaddMovie = document.querySelector('#btn-addmovie');
    elements.addmovietitle = document.querySelector('#addmovietitle');
    elements.addmovieimg = document.querySelector('#addmovieimg');
    elements.moviefilter = document.querySelector('.moviefilter');
    elements.addmoviegenre = document.querySelector('#addmoviegenre');
    elements.mehrfilme_maske = document.querySelector('.mehrfilme_maske');

    elements.popup_d = document.querySelector('.popup_d');
    elements.detailview = document.querySelector('.detailview');
    elements.detailtitle = document.querySelector('.detailtitle');
    elements.detailgenre = document.querySelector('.detailgenre');
    elements.detaildescription = document.querySelector('.detaildescription');
    elements.detailrating = document.querySelector('.detailrating');
    elements.detailaward = document.querySelector('.detailaward');
    elements.detailimg = document.querySelector('.detailimg');
}

//1. XHR Request, JSON anfordern
const loadJson = () => {
    //Check ob Localstorage leer ist 
    loadFile(filepath, processData);
}

// 2. Datei Laden
const loadFile = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.addEventListener('load', callback);
    xhr.send();
}

//3. Eventlistener wenn XHR empfangen, JSON aus Datei oder Localstorage, Daten in Array umwandeln
const processData = evt => {
    const xhr = evt.target;
    //Abrage ob LS vorhanden, Wenn Ja lade aus LS ansonsten File und neuen LS anlegen 
    if (localStorage.getItem("filme") == null) {
        localStorage.setItem("filme", xhr.responseText);
        data = JSON.parse(xhr.responseText);
        // console.log("Lesen der File");
    } else {
        data = localStorage.getItem("filme");
        data = JSON.parse(data);
        // console.log("Lesen des LS");
    }

    //Funktion muss aufgerufen werden damit die Funktion Zugriff auf "data" hat
    showMovies();
}


///DOM, Content

// 4. Moviecards erstellen und mit Content befüllen
const dommoviesPrint = () => {
    for (let i = 0; i < data.length; i++) {
        // Moviecard erstellen und in den Container pushen
        let moviecard = document.createElement('div');
        moviecard.classList.add("moviecard");
        elements.container.appendChild(moviecard);

        // Content in die Moviecard pushen 
        let contentimg = document.createElement('img');
        contentimg.setAttribute("src", data[i].img);
        contentimg.style.height = "300px";
        moviecard.appendChild(contentimg);

        // Id mitgeben (für Detailansicht)
        contentimg.setAttribute("data-id", data[i]._id);
    }
}

// 5. Filmliste erstellen und mit Content befüllen
const dommovielistPrint = () => {
    for (let i = 0; i < data.length; i++) {
        let movielisttitle = document.createElement('p');
        movielisttitle.innerHTML = data[i].title;
        movielisttitle.classList.add("movielisttitle");
        movielisttitle.setAttribute("data-id", data[i]._id);
        elements.movielist.appendChild(movielisttitle);

        // Minuszeichen
        let minus = document.createElement('p');
        minus.innerHTML = "−";
        movielisttitle.append(minus);
    }
}

// 6. Filmkategorien erstellen und mit Content befüllen
const dommoviegenresPrint = () => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].genre == undefined) {
            i++
        } else {
            //Genres in einen Set Array pushen (vermeidet Duplikate)
            genreset.add(data[i].genre[0]);
        }
    }

    for (let key of genreset) {
        movielistgenre = document.createElement('p');
        movielistgenre.classList.add("movielistgenre");
        movielistgenre.innerHTML = key;
        elements.moviegenre.appendChild(movielistgenre);
    }
}


///// ARRAY MANIPULATION
//Daten anzeigen

const showMovies = () => {
    dommoviesPrint();
    dommovielistPrint();
    dommoviegenresPrint();
}

// Daten löschen
const deleteMovies = event => {
    let target = event.target;
    let filmid = target.getAttribute("data-id");

    // Element in Data finden
    const index = data.findIndex(object => {
        return object._id === filmid;
    });
    // console.log(index);
    // Element aus Array entfernen
    data.splice(index, 1);

    //Film Container und Filmlisten Container leeren
    elements.movielist.innerHTML = "";
    elements.container.innerHTML = "";
    elements.moviegenre.innerHTML = "";

    // Inhalte mit neuem Array erstellen
    showMovies();
}

// Daten hinzufügen
const addMovies = () => {

    // Werte der Inputfelder holen
    let newmovietitle = elements.addmovietitle.value;
    let newmovieimg = elements.addmovieimg.value;
    let newmoviegenre = elements.addmoviegenre.value;
    let newmovieid = `m${data.length + 1}`;

    // Prüfen ob Inputfelder Inhalt haben
    if (newmovietitle.length <= 0) {
        console.log("Bitte einen Filmtitel eingeben");
        elements.addmovietitle.classList.add("invalid_input");
    } else if (newmovieimg.length <= 0 || !newmovieimg.includes("/")) {
        console.log("Bitte ein gültiges Bild auswählen (http-Link)");
        elements.addmovieimg.classList.add("invalid_input");
    }

    else {
        // Abfrage ob Genrefeld Inhalt hat
        if (newmoviegenre.length == 0) {
            newmoviegenre = "Neu";
        } else {
            newmoviegenre;
        }

        // Neues Objekt erstellen und in data-array pushen
        let newmovieobj = {
            _id: newmovieid,
            title: newmovietitle,
            img: newmovieimg,
            genre: [newmoviegenre]
        }
        data.push(newmovieobj);

        // Neues Objekt im Localstorage speichern (erst in String umwandeln damit ls es lesen kann)
        // let newdata = JSON.stringify(data);
        // localStorage.setItem('filme', newdata);

        //Aktive Klassen entfernen
        elements.addmovietitle.classList.remove("invalid_input");
        elements.addmovieimg.classList.remove("invalid_input");
    }

    //Film Container und Filmlisten Container leeren
    elements.movielist.innerHTML = "";
    elements.container.innerHTML = "";
    elements.moviegenre.innerHTML = "";

    // Inhalte mit neuem Array erstellen
    showMovies();
    // Optional: kleine Meldung/popup das der Film gespeichert wurde
}

// Zusatzeventlistener Funktion für aktiven Inputlisten
const addmovieinputReader = () => {
    // wenn input länge größer als 0, entferne die klasse
    // Werte der Inputfelder holen
    let newmovietitle = elements.addmovietitle.value;
    let newmovieimg = elements.addmovieimg.value;

    if (newmovietitle.length >= 0) {
        elements.addmovietitle.classList.remove("invalid_input");
    }
    if (newmovieimg.length >= 0) {
        elements.addmovieimg.classList.remove("invalid_input");
    }
}


// Daten nach Kategorie filtern (Tagfilter)
const filterMovies = () => {
    let target = event.target;
    let filmgenre = target.innerHTML;

    // Filme mit filmgenre in Data pushen
    let filterArray = [];
    for (let i = 1; i < data.length; i++) {
        if (data[i].genre.includes(filmgenre)) {
            filterArray.push(data[i]);
        } else {
            i++;
        }
    }

    // Original data-Array leeren, mit neuem GenreArray befüllen
    data = [];
    data = filterArray;
    // console.log(data);

    //Film Container und Filmlisten Container leeren
    elements.movielist.innerHTML = "";
    elements.container.innerHTML = "";
    elements.moviegenre.innerHTML = "";

    // Inhalte mit neuem Array erstellen
    showMovies();
    createcloseFilter();
}

const createcloseFilter = () => {
    let filterclosebtn = document.createElement("button");
    filterclosebtn.setAttribute("id", "filterclosebtn");
    filterclosebtn.innerHTML = "löschen x";
    elements.moviefilter.appendChild(filterclosebtn);
    document.querySelector("#filterclosebtn").addEventListener("click", clickcloseFilter);

    // Filter nur einmal Klickbar - Container sperren
    elements.moviegenre.style.pointerEvents = "none";
}

const clickcloseFilter = () => {
    //Film Container und Filmlisten Container leeren
    elements.movielist.innerHTML = "";
    elements.container.innerHTML = "";
    elements.moviegenre.innerHTML = "";

    // Inhalte mit Originalem Array erstellen
    data = localStorage.getItem("filme");
    data = JSON.parse(data);
    elements.moviefilter.removeChild(filterclosebtn);
    showMovies();
    //Filter - Container entsperren
    elements.moviegenre.style.pointerEvents = "initial";
}



//// DETAILANSICHT AUFRUFEN
const opendetailView = event => {
    let target = event.target;
    let filmid = target.getAttribute("data-id");

    // Element in Data finden
    const index = data.findIndex(object => {
        return object._id == filmid;
    });

    // Detailview mit Content befüllen
    elements.detailtitle.innerHTML = data[index].title;
    elements.detailgenre.innerHTML = data[index].genre;
    elements.detaildescription.innerHTML = data[index].description;
    elements.detailrating.innerHTML = `Rating: ${data[index].rating}/10`;
    if (data[index].awardwinning == true) {
        elements.detailaward.style.display = "initial";
        elements.detailaward.innerHTML = "★ Grammy Award";
    } else {
        elements.detailaward.style.display = "none";
        elements.detailaward.innerHTML = "";
    }
    elements.detailimg.src = data[index].img;


    // Popup aufrufen (Styling)
    elements.popup_d.style.display = "inherit";
    elements.main.style.filter = "blur(2px)";
}

//// DETAILANSICHT SCHLIESSEN
const closedetailView = event => {
    elements.popup_d.style.display = "none";
    elements.main.style.filter = "blur(0px)";
}


//EVENTLISTENER
const appendEventlisteners = () => {
    elements.movielist.addEventListener("click", deleteMovies);
    elements.moviegenre.addEventListener("click", filterMovies);
    elements.btnaddMovie.addEventListener("click", addMovies);
    elements.addmovietitle.addEventListener("keypress", addmovieinputReader);
    elements.addmovieimg.addEventListener("keypress", addmovieinputReader);
    elements.container.addEventListener("click", opendetailView);
    elements.popup_d.addEventListener("click", closedetailView);
}

// INIT
const init = () => {
    domMapping();
    loadJson();
    appendEventlisteners();
}

document.addEventListener("DOMContentLoaded", init);