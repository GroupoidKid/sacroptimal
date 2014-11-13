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
	document.getElementById('pvsac').innerHTML = soin;
	document.getElementById('nbD').innerHTML = Math.floor(1+soin/5);
	document.getElementById('pvperdus').innerHTML = (soin+2+2*Math.floor(soin/5));
	}

function addCalculSacro() {
	var pvsac = document.createElement('span');
	pvsac.setAttribute('id','pvsac'); pvsac.innerHTML = '0';
	var nbD = document.createElement('span');
	nbD.setAttribute('id','nbD'); nbD.innerHTML = '1';
	var pvperdus = document.createElement('span');
	pvperdus.setAttribute('id','pvperdus'); pvperdus.innerHTML = '2';
	var inode = document.evaluate("//div/i/text()[contains(.,'Chaque')]/..",
					document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	var ligne = document.createElement('b');
	inode.removeChild(inode.firstChild);
	ligne.appendChild(document.createTextNode('Points de Vie perdus : '));
	ligne.appendChild(pvsac);
	ligne.appendChild(document.createTextNode(' + '));
	ligne.appendChild(nbD);
	ligne.appendChild(document.createTextNode(' D3 PV (moyenne : '));
	ligne.appendChild(pvperdus);
	ligne.appendChild(document.createTextNode(')'));
	inode.parentNode.insertBefore(ligne,inode);
	var kinput = document.getElementsByTagName('input')[2];
	kinput.addEventListener('keyup', pertePV , false);
	}

if ( isPage('MH_Play/Actions/Sorts/Play_a_Sort17') ) {
	addCalculSacro();
	}
