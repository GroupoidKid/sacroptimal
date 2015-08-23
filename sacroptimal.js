/*******************************************************************************
*     Calcul automatique de la perte moyenne de PV sur Sacro - by Dabihul      *
* Extension pour Mountyzilla - http://mountyzilla.tilk.info/ - 2015-08-23-v5.0 *
*******************************************************************************/


/*------------------------ Fonctions d'initialisation ------------------------*/

function gestionTitre4() {
	titre4.original = trim(titre4.textContent);
	titre4.innerHTML = titre4.original.slice(0,7)+"...";
	titre4.onmouseover = function() {
		titre4.innerHTML = titre4.original;
		pertePV.style.display = "none";
	};
	titre4.onmouseout = function() {
		titre4.innerHTML = titre4.original.slice(0,7)+"...";
		pertePV.style.display = "";
	};
}

function initCalculSacro() {
	nbValeurs = Math.max(Math.min(nbValeurs,50),1);
	var opt;

	// Ajout du bouton changement de mode
	optiBouton = appendButton(divAction,"Optimiser!",switchOptimiser);

	// Initialisation affichage PV perdus
	pertePV = document.createElement("span");
	pertePV.innerHTML = "---";
	appendBr(divAction);
	divAction.appendChild(pertePV);
	inputPV.onkeyup = refreshPertePV;
	
	// Cr�ation de la liste des sacros optimis�s (4 -> 249)
	listeSac = document.createElement("select");
	listeSac.className = "SelectboxV2";
	opt = appendOption(listeSac,NaN,"---");
	opt.style.fontSize = "bold";
	opt.onclick = function() {
		indexMin -= Math.max(1,nbValeurs-2);
		refreshDisplayListeSac();
	}
	for(var sac=4 ; sac<250 ; sac+=5) {
		appendOption(listeSac,sac,sac);
	}
	opt = appendOption(listeSac,NaN,"+++");
	opt.style.fontWeight = "bold";
	opt.onclick = function() {
		indexMin += Math.max(1,nbValeurs-2);
		refreshDisplayListeSac();
	}
	listeSac.onmousemove = refreshPertePV;
	
	// Initialisation du mode Optimiser
	if(Optimiser) {
		Optimiser = false;
		switchOptimiser();
	} else {
		refreshDisplayListeSac();
	}
}


/*--------------------------------- Handlers ---------------------------------*/

function switchOptimiser() {
	Optimiser = (!Optimiser);
	MZ_setValue("SacroOptimal",Optimiser);
	
	if(Optimiser) {
		optiBouton.value = "Mode Normal";
		indexMin = isNaN(inputPV.value) ? indexMin :
			Math.floor((Number(inputPV.value)+1)/5)-Math.floor(nbValeurs/2);
		refreshDisplayListeSac();
		// Attention a bien laisser des setAttribute pour que
		// le formulaire php puisse acc�der aux modifs
		inputPV.setAttribute("name","dummy");
		listeSac.setAttribute("name","ai_NbPV");
		divAction.replaceChild(listeSac,inputPV);	
	} else {
		optiBouton.value = "Optimiser!";
		inputPV.value = listeSac.value;
		// Idem
		listeSac.setAttribute("name","dummy");
		inputPV.setAttribute("name","ai_NbPV");
		divAction.replaceChild(inputPV,listeSac);
	}
	
	refreshPertePV();
}

function refreshDisplayListeSac() {
	indexMin = Math.max(Math.min(indexMin,51-nbValeurs),1);
	var indexMax = Math.min(indexMin+nbValeurs-1,50);
	MZ_setValue("SacroOptimal.indexMin",indexMin);
	
	for(var i=1 ; i<51 ; ++i) {
		if(i>indexMax || i<indexMin) {
			listeSac.childNodes[i].style.display = "none";
		} else {
			listeSac.childNodes[i].style.display = "";
		}
	}
	listeSac.selectedIndex = indexMin+Math.floor(nbValeurs/2);
}

function refreshPertePV() {
	var soin = Number(Optimiser ? listeSac.value : inputPV.value);
	if(isNaN(soin)) {
		pertePV.innerHTML = "---";
	} else {
		var nbD = Math.floor(soin/5)+1;
		pertePV.innerHTML = "Points de Vie perdus : entre "+
			(soin+nbD)+" et "+(soin+3*nbD)+" (moyenne : "+(soin+2*nbD)+")";
	}
}


/*---------------------------------- Cervo -----------------------------------*/

// On v�rifie que le sort lanc� est bien Sacro :
if(!isPage("MH_Play/Actions/Sorts/Play_a_SortYY")) { return; }
var idSort = document.getElementsByName("ai_IdSort");
if(!idSort[0] || !idSort[0].value || idSort[0].value!=17) { return; }

// On r�cup�re les �l�ments du cadre fondamentaux pour le script :
var
	inputPV = document.getElementsByName("ai_NbPV")[0],
	titre4 = document.getElementsByClassName("titre4")[0],
	divAction = document.getElementsByClassName("Action")[0];
if(!inputPV || !titre4 || !divAction) {
	window.console.error("[sacroptimal] Structure du cadre inconnue");
	return;
}

var
	// Bouton de mode (Normal <-> Optimis�) :
	optiBouton,
	// Liste des sacros optimaux :
	listeSac,
	// Span contenant le texte de perte de PV :
	pertePV;
	
var
	// On r�cup�re les donn�es m�moris�es
	// - �tat Normal / Optimis� :
	Optimiser = MZ_getValue("SacroOptimal"),
	// - Nombre de valeurs affich�es dans la liste :
	nbValeurs = isNaN(MZ_getValue("SacroOptimal.nbValeurs")) ?
		11 : Number(MZ_getValue("SacroOptimal.nbValeurs")),
	// - Valeur minimale par d�faut du sacrifice en mode optimis� :
	indexMin = isNaN(MZ_getValue("SacroOptimal.indexMin")) ?
		1 : Number(MZ_getValue("SacroOptimal.indexMin"));

gestionTitre4();
initCalculSacro();

