/*******************************************************************************
*     Calcul automatique de la perte moyenne de PV sur Sacro - by Dabihul      *
* Extension pour Mountyzilla - http://mountyzilla.tilk.info/ - 2013-11-16-v4.0 *
*******************************************************************************/

function refreshPertePV() {
	var soin;
	if(Optimiser)
		soin = listesac.value;
	else
		soin = input.value;
	if(!soin)
		soin = 0;
	
	soin = parseInt(soin);
	var nbD = Math.floor(soin/5)+1;
	
	zonecalc.innerHTML =
		'Points de Vie perdus : entre '+(soin+nbD)+' et '+(soin+3*nbD)+ ' (moyenne : '+(soin+2*nbD)+')';
	}

function switchOptimiser() {
	Optimiser = (!Optimiser);
	MZ_setValue('SacroOptimal',Optimiser);
	if(Optimiser) {
		optibutton.value = 'Mode Normal';
		var i = Math.floor((parseInt(input.value)-4)/5);
		listesac.selectedIndex = i ? Math.max(i,0) : 0;
		input.setAttribute('name','zip');
		listesac.setAttribute('name','ai_NbPV');
		input.parentNode.replaceChild(listesac,input);
		refreshPertePV();
		}
	else {
		optibutton.value = 'Optimiser!';
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
	insertBefore(inode,ligne);
	
	input = document.getElementsByTagName('input')[2];
	input.addEventListener('keyup',refreshPertePV,false);
	
	/* Préparation mode Optimiser */
	sacmax = document.evaluate("//div/i/text()[contains(.,'soin')]",
					document, null, 9, null).singleNodeValue.nodeValue.match(/\d+/);
	listesac = document.createElement('select');
	listesac.className = 'SelectboxV2';
	var sac = 4;
	while(sac<=sacmax) {
		appendOption(listesac,sac,sac);
		sac += 5;
		}
	if(!listesac.firstChild)
		appendOption(listesac,sacmax,sacmax);
	listesac.addEventListener('mousemove', refreshPertePV, false);
	
	/* Bouton changement de mode */
	optibutton = appendButton(inode.parentNode, 'Optimiser!', switchOptimiser);
	if(Optimiser) {
		Optimiser = false;
		switchOptimiser();
		}
	}

if( isPage('MH_Play/Actions/Sorts/Play_a_Sort17') ) {
	var Optimiser = MZ_getValue('SacroOptimal');
	var input, listesac, optibutton, zonecalc, sacmax;
	initCalculSacro();
	}
