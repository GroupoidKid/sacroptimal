/*********************************************************************************
*        Calcul automatique de la perte moyenne de PV sur Sacro - by Dab         *
*********************************************************************************/

function pertePV() {
	var soin = document.evaluate("//input[@name='ai_NbPV']",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value;
	if (soin)
		soin = parseInt(soin);
	else
		soin = 0;
	var nbD = Math.floor(soin/5)+1;
	document.getElementById('zonecalc').innerHTML = 'Points de Vie perdus : entre ' + (soin+nbD) + ' et ' + (soin+3*nbD)
									+ ' PV (moyenne : ' + (soin+2*nbD) + ')';
	}

function addCalculSacro() {
	var inode = document.evaluate("//div/i/text()[contains(.,'Chaque')]/..",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var zonecalc = document.createElement('span');
	zonecalc.setAttribute('id','zonecalc');
	zonecalc.innerHTML = 'Points de vie perdus : entre 1 et 3 (moyenne : 2)';
	var ligne = document.createElement('i');
	inode.removeChild(inode.firstChild);
	ligne.appendChild(zonecalc);
	inode.parentNode.insertBefore(ligne,inode);
	var kinput = document.getElementsByTagName('input')[2];
	kinput.addEventListener('keyup', pertePV , false);
	}

if ( isPage('MH_Play/Actions/Sorts/Play_a_Sort17') ) {
	addCalculSacro();
	}
