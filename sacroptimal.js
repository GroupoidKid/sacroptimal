/*********************************************************************************
*        Calcul automatique de la perte moyenne de PV sur Sacro - by Dab         *
*********************************************************************************/

function refreshPertePV() {
	if (Optimiser) {
		var soin = document.evaluate("//select[@name='ai_NbPV']",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;			
		}
	else {
		var soin = document.evaluate("//input[@name='ai_NbPV']",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;
		}
	if (soin)
		soin = parseInt(soin);
	else
		soin = 0;
	var nbD = Math.floor(soin/5)+1;
	document.getElementById('zonecalc').innerHTML = 'Points de Vie perdus : entre ' + (soin+nbD) + ' et ' + (soin+3*nbD)
									+ ' (moyenne : ' + (soin+2*nbD) + ')';
	}

function switchOptimiser() {
	Optimiser = (!Optimiser);
	if (Optimiser) {
		document.getElementById('optibutton').firstChild.textContent = '[Mode Normal]';
		var sacmax = document.evaluate("//div/i/text()[contains(.,'soin')]/..", document, null,
					XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.match(/\d+/);
		var input = document.evaluate("//input[@name='ai_NbPV']",
						document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		var sacopt = 0;
		if (input.value)
			sacopt = 5*Math.floor((parseInt(input.value)+1)/5)-1;
		//input.value = sacopt;
		
		var listesac = document.createElement('select');
		listesac.setAttribute('class','SelectboxV2');
		listesac.setAttribute('name','ai_NbPV');
		var sac = 4;
		while (sac<=sacmax) {
			appendOption(listesac, sac, sac);
			sac += 5;
			}
		if (!listesac.firstChild) {
			appendOption(listesac, sacmax, sacmax);
			sacopt = sacmax;
			}
		listesac.selectedIndex = Math.floor(sacopt/5);
		listesac.addEventListener('mousemove', refreshPertePV , false);
		input.parentNode.replaceChild(listesac,input);
		refreshPertePV();
		}
	else {
		// <INPUT NAME="ai_NbPV" TYPE="text" CLASS="TextareaboxV2" SIZE="10" MAXLENGTH="3">
		document.getElementById('optibutton').firstChild.textContent = '[OPTIMISER]';
		var listesac = document.evaluate("//select[@name='ai_NbPV']",
						document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		var soin = listesac.value;
		var input = document.createElement('input');
		input.setAttribute('maxlength','3');
		input.setAttribute('size','10');
		input.setAttribute('class','TextareaboxV2');
		input.setAttribute('type','text');
		input.setAttribute('name','ai_NbPV');
		input.addEventListener('keyup', refreshPertePV , false);
		input.value = listesac.value;
		listesac.parentNode.replaceChild(input,listesac);
		refreshPertePV();
		}
	}

function addCalculSacro() {
	var inode = document.evaluate("//div/i/text()[contains(.,'Chaque')]/..",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	/* Initialisation affichage PV perdus */
	var zonecalc = document.createElement('span');
	zonecalc.setAttribute('id','zonecalc');
	zonecalc.innerHTML = 'Points de Vie perdus : entre 1 et 3 (moyenne : 2)';
	
	inode.removeChild(inode.firstChild);
	var ligne = document.createElement('b');
	ligne.setAttribute('id','lignecalc');
	ligne.appendChild(zonecalc);
	inode.parentNode.insertBefore(ligne,inode);
	
	var kinput = document.getElementsByTagName('input')[2];
	kinput.addEventListener('keyup', refreshPertePV , false);
	
	/* Bouton changement de mode */
	var optibutton = document.createElement('a');
	optibutton.setAttribute('id','optibutton');
	optibutton.appendChild(document.createTextNode('[OPTIMISER]'));
	
	insertText(inode , ' - ' , false);
	inode.parentNode.insertBefore(optibutton,inode);
	
	optibutton.addEventListener('click', switchOptimiser , false);
	}

if ( isPage('MH_Play/Actions/Sorts/Play_a_Sort17') ) {
	var Optimiser = false;
	addCalculSacro();
	}
