// ==UserScript==
// @name         [Mountyhall] SacrOptimal
// @namespace    Mountyhall
// @description  Assistant Sacrifice
// @author       Dabihul
// @version      6.0a.0.0
// @include      */mountyhall/MH_Play/Actions/Sorts/Play_a_SortYY.php*
// @grant        none
// ==/UserScript==

/******************************************************************************
 *           Calcul automatique de la perte moyenne de PV sur Sacro           *
 ******************************************************************************/

/*------------------------------- LocalStorage -------------------------------*/

function setValue(key, value) {
	window.localStorage.setItem(key, value);
}

function getValue(key) {
	return window.localStorage.getItem(key);
}

/*----------------------------------- DOM ------------------------------------*/

function appendOption(select, value, text) {
	var option = document.createElement("option");
	option.value = value;
	option.appendChild(document.createTextNode(text));
	select.appendChild(option);
	return option;
}

/*------------------------ Fonctions d'initialisation ------------------------*/

function gestionTitre4() {
	titre4.original = titre4.textContent.trim();
	titre4.innerHTML = titre4.original.slice(0,7) + "...";
	titre4.onmouseover = function() {
		titre4.innerHTML = titre4.original;
		pertePV.style.display = "none";
	};
	titre4.onmouseout = function() {
		titre4.innerHTML = titre4.original.slice(0,7) + "...";
		pertePV.style.display = "";
	};
}

function initCalculSacro() {
	nbValeurs = Math.max( Math.min(nbValeurs,50), 1);
	var opt;

	// Ajout du bouton changement de mode
	optiBouton = document.createElement("input");
	optiBouton.type = "button";
	optiBouton.className = "mh_form_submit";
	optiBouton.value = "Optimiser!";
	optiBouton.onmouseover = function() {
		this.style.cursor = "pointer";
	};
	optiBouton.onclick = switchOptimiser;
	divAction.appendChild(optiBouton);

	// Initialisation affichage PV perdus
	pertePV = document.createElement("span");
	pertePV.innerHTML = "---";
	divAction.appendChild(document.createElement("br"));
	divAction.appendChild(pertePV);
	inputPV.onkeyup = refreshPertePV;

	// Création de la liste des sacros optimisés (4 -> 249)
	listeSac = document.createElement("select");
	listeSac.className = "SelectboxV2";
	opt = appendOption(listeSac, NaN, "---");
	opt.onclick = function() {
		indexMin -= Math.max(1, nbValeurs-2);
		refreshDisplayListeSac();
	}
	for (var sac=4 ; sac<250 ; sac+=5) {
		appendOption(listeSac, sac, sac);
	}
	opt = appendOption(listeSac, NaN, "+++");
	opt.onclick = function() {
		indexMin += Math.max(1, nbValeurs-2);
		refreshDisplayListeSac();
	}
	listeSac.onchange = refreshPertePV;

	// Initialisation du mode Optimiser
	if (Optimiser) {
		Optimiser = 0;
		switchOptimiser();
	} else {
		refreshDisplayListeSac();
	}
}

/*--------------------------------- Handlers ---------------------------------*/

function switchOptimiser() {
	Optimiser = 1-Optimiser;
	setValue("SacrOptimal.Optimiser", Optimiser);

	if (Optimiser) {
		optiBouton.value = "Mode Normal";
		indexMin = Number(inputPV.value) ?
			Math.floor( (Number(inputPV.value)+1)/5 ) - Math.floor(nbValeurs/2) :
			indexMin;
		refreshDisplayListeSac();
		// Attention à bien laisser des setAttribute pour que
		// le formulaire php puisse accéder aux modifs
		inputPV.setAttribute("name", "dummy");
		listeSac.setAttribute("name", "ai_NbPV");
		inputPV.parentNode.replaceChild(listeSac, inputPV);
	} else {
		optiBouton.value = "Optimiser!";
		inputPV.value = listeSac.value;
		// Idem
		listeSac.setAttribute("name", "dummy");
		inputPV.setAttribute("name", "ai_NbPV");
		listeSac.parentNode.replaceChild(inputPV, listeSac);
	}

	refreshPertePV();
}

function refreshDisplayListeSac() {
	indexMin = Math.max( Math.min(indexMin,51-nbValeurs), 1);
	var indexMax = Math.min(indexMin+nbValeurs-1, 50);
	setValue("SacrOptimal.indexMin", indexMin);

	for (var i=1 ; i<51 ; ++i) {
		if (i>indexMax || i<indexMin) {
			listeSac.childNodes[i].style.display = "none";
		} else {
			listeSac.childNodes[i].style.display = "";
		}
	}
	listeSac.selectedIndex = indexMin + Math.floor(nbValeurs/2);
}

function refreshPertePV() {
	var soin = Number(Optimiser ? listeSac.value : inputPV.value);
	if (isNaN(soin)) {
		pertePV.innerHTML = "---";
	} else {
		var nbD = Math.floor(soin/5) + 1;
		pertePV.innerHTML =
			"Points de Vie perdus : entre " + (soin+nbD) +
			" et " + (soin+3*nbD) +
			" (moyenne : " + (soin+2*nbD) + ")";
	}
}

/*---------------------------------- Cervo -----------------------------------*/

// On vérifie que le sort lancé est bien Sacro :
var idSort = document.getElementsByName("ai_IdSort");
if (!idSort[0] || !idSort[0].value || idSort[0].value != 17) {
	return;
}

// On récupère les éléments du cadre fondamentaux pour le script :
var
	inputPV = document.getElementsByName("ai_NbPV")[0],
	titre4 = document.getElementsByClassName("titre4")[0],
	divAction = document.getElementsByClassName("Action")[0];
if (!inputPV || !titre4 || !divAction) {
	window.console.error("[SacrOptimal] Structure du cadre inconnue");
	return;
}

var
	// Bouton de mode (Normal <-> Optimisé) :
	optiBouton,
	// Liste des sacros optimaux :
	listeSac,
	// Span contenant le texte de perte de PV :
	pertePV,
	
	// On récupère les données mémorisées
	// - État Normal / Optimisé :
	Optimiser = getValue("SacrOptimal.Optimiser")==1 ? 1 : 0,
	// - Nombre de valeurs affichées dans la liste :
	nbValeurs = Number(getValue("SacrOptimal.nbValeurs")) || 11,
	// - Valeur minimale par défaut du sacrifice en mode optimisé :
	indexMin = Number(getValue("SacrOptimal.indexMin")) || 1;

gestionTitre4();
initCalculSacro();
