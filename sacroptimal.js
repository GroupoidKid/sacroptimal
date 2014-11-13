/*********************************************************************************
*      Calcul automatique de la perte moyenne de PV sur Sacro - by Dabihul       *
* Extension pour Mountyzilla - http://mountyzilla.tilk.info/ - 2012-08-14-v3.2   *
*********************************************************************************/

function refreshPertePV() {
	var soin;
	if (Optimiser)
		soin = listesac.value;
	else
		soin = input.value;
	if (!soin)
		soin = 0;
	
	soin = parseInt(soin);
	var nbD = Math.floor(soin/5)+1;
	
	zonecalc.innerHTML =
		'Points de Vie perdus : entre '+(soin+nbD)+' et '+(soin+3*nbD)+ ' (moyenne : '+(soin+2*nbD)+')';
	}

function switchOptimiser() {
	Optimiser = (!Optimiser);
	if (Optimiser) {
		optibutton.firstChild.nodeValue = '[Mode Normal]';
		var sacopt = sacmax;
		if (input.value)
			sacopt = 5*Math.floor((parseInt(input.value)+1)/5)-1;
		listesac.selectedIndex = Math.floor(sacopt/5);
		input.setAttribute('name','zip');
		listesac.setAttribute('name','ai_NbPV');
		input.parentNode.replaceChild(listesac,input);
		refreshPertePV();
		}
	else {
		optibutton.firstChild.nodeValue = '[OPTIMISER]';
		input.value = parseInt(listesac.value);
		listesac.setAttribute('name','none');
		input.setAttribute('name','ai_NbPV');
		listesac.parentNode.replaceChild(input,listesac);
		refreshPertePV();
		}
	}

function initCalculSacro() {
	/* Initialisation affichage PV perdus */
	var inode = document.evaluate("//div/i/text()[contains(.,'Chaque')]/..",
						document, null, 9, null).singleNodeValue;
	zonecalc = document.createElement('span');
	zonecalc.innerHTML = 'Points de Vie perdus : entre 1 et 3 (moyenne : 2)';
	var ligne = document.createElement('b');
	ligne.appendChild(zonecalc);
	inode.removeChild(inode.firstChild);
	inode.parentNode.insertBefore(ligne,inode);
	
	input = document.getElementsByTagName('input')[2];
	input.addEventListener('keyup',refreshPertePV,false);
	
	/* Préparation nouveau mode */
	sacmax = document.evaluate("//div/i/text()[contains(.,'soin')]",
				document, null, 9, null).singleNodeValue.nodeValue.match(/\d+/);
	listesac = document.createElement('select');
	listesac.setAttribute('class','SelectboxV2');
	var sac = 4;
	while (sac<=sacmax) {
		appendOption(listesac,sac,sac);
		sac += 5;
		}
	if (!listesac.firstChild)
		appendOption(listesac,sacmax,sacmax);
	listesac.addEventListener('mousemove',refreshPertePV,false);
	
	/* Bouton changement de mode */
	optibutton = document.createElement('a');
	optibutton.setAttribute('id','optibutton');
	optibutton.appendChild(document.createTextNode('[OPTIMISER]'));
	insertText(inode,' - ');
	inode.parentNode.insertBefore(optibutton,inode);
	optibutton.addEventListener('click',switchOptimiser,false);
	}

if ( isPage('MH_Play/Actions/Sorts/Play_a_Sort17') ) {
	var Optimiser = false;
	var input, listesac, optibutton, zonecalc, sacmax;
	initCalculSacro();
	}
