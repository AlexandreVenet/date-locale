'use strict';

class Horloge{
	constructor(){
		// la date
		this.date = new Date();
		// des sauvegardes
		this.hhSave;
		this.mmSave;
		this.ssSave;
		// centre du <svg>
		this.centreX = this.definirCentre('x');
		this.centreY = this.definirCentre('y');
		// les angles d'arc
		this.angleHeures;
		this.angleMinutes;
		this.angleSecondes;
		// les éléments arcs
		this.arcHeures = document.getElementById('arcHeures');
		this.arcMinutes = document.getElementById('arcMinutes');
		this.arcSecondes = document.getElementById('arcSecondes');
		// les éléments aiguilles
		this.aiguilleHeures = document.getElementById('aiguilleHeures');
		this.aiguilleMinutes = document.getElementById('aiguilleMinutes');
		this.aiguilleSecondes = document.getElementById('aiguilleSecondes');
		// les rayons des arcs
		const cerclesFond = document.getElementsByClassName('cercleFond');
		this.arcRayonHeures = cerclesFond[0].getAttribute('r'); // 115
		this.arcRayonMinutes = cerclesFond[1].getAttribute('r'); // 135
		this.arcRayonSecondes = cerclesFond[2].getAttribute('r'); // 152
		// le cadran des chiffres
		this.cadran = document.getElementById('cadran');
		// les éléments texte de la date
		this.texteDate = document.getElementById('texteDate');
		this.texteDateRFC = document.getElementById('texteDateRFC');
		// le changement de cadran est en cours ou pas
		this.changerCadran = false;
		// le temps de l'intervalle général
		this.intervalleTemps = 1000;
		// paramètres des intervalles d'animation. On fait un objet avec constructeur...
		this.paramIntervalles = new function(){
			this.pas = 10;
			this.tempsTotal = 400;
			this.tempsPas = this.tempsTotal / this.pas; // ... pour accéder aux propriétés à partir de l'intérieur
		}
		// les intervalles d'animation
		this.ssIntervalle;
		this.mmIntervalle;
		this.hhIntervalle;
		// le nombre de fois que les intervalles ont tourné
		this.iterationSecondes = 1;
		this.iterationMinutes = 1;
		this.iterationHeures = 1;
		// tout est prêt, on lance
		// si l'heure est supérieure ou égale à 12, changer les nombres du cadran
		if(this.date.getHours() >= 13){
			this.definirCadranNombres(12);
		}
		// afficher les textes de la date
		this.ecrireDate();
		// renseigner les angles
		this.definirAngles();
		// afficher l'heure
		// this.afficherHeure();
		this.animerTemps(this.aiguilleSecondes,this.arcSecondes,this.arcRayonSecondes,0,this.angleSecondes,this.intervalleTemps);
		this.animerTemps(this.aiguilleMinutes,this.arcMinutes,this.arcRayonMinutes,0,this.angleMinutes,this.intervalleTemps);
		this.animerTemps(this.aiguilleHeures,this.arcHeures,this.arcRayonHeures,0,this.angleHeures,this.intervalleTemps);
		// lancer l'intervalle
		// this.lancerIntervalle();
		this.intervalle = setInterval(this.intervalleHorloge.bind(this),this.intervalleTemps);
		/*
		définir les attributs directement :
		this.arcHeures.setAttribute("d", this.decrireArc(this.centreX, this.centreY, this.arcRayonHeures, 0, this.angleHeures));
		this.arcMinutes.setAttribute("d", this.decrireArc(this.centreX, this.centreY, this.arcRayonMinutes, 0, this.angleMinutes));
		this.arcSecondes.setAttribute("d", this.decrireArc(this.centreX, this.centreY, this.arcRayonSecondes, 0, this.angleSecondes));
		this.aiguilleHeures.setAttribute("transform",this.decrireAiguille(this.centreX,this.centreY,this.angleHeures));
		this.aiguilleMinutes.setAttribute("transform",this.decrireAiguille(this.centreX,this.centreY,this.angleMinutes));
		this.aiguilleSecondes.setAttribute("transform",this.decrireAiguille(this.centreX,this.centreY,this.angleSecondes));
		*/
	}

	definirCentre(axeDemande){
		const svgZone = document.getElementById('svgZone');
		const viewBox = svgZone.attributes.viewBox.value; // "0 0 600 600"
		const viewBoxArray = viewBox.split(' '); // array de strings
		const viewBoxArrayNumbers = viewBoxArray.map(Number); // distribuer en number
		// calculer le centre
		viewBoxArrayNumbers[2] /= 2;
		viewBoxArrayNumbers[3] /= 2;
		// retourner une valeur x ou y
		let valeurRetournee;
		if(axeDemande === 'x'){
			valeurRetournee = viewBoxArrayNumbers[2];
		}else if(axeDemande === 'y'){
			valeurRetournee = viewBoxArrayNumbers[3];
		}
		return valeurRetournee;
	}

	polarToCartesian(centerX, centerY, radius, angleDegres) {
		var angleRadians = (angleDegres-90) * Math.PI / 180.0;
		return {
			x: centerX + (radius * Math.cos(angleRadians)),
			y: centerY + (radius * Math.sin(angleRadians))
		};
	}

	decrireArc(x, y, radius, angleDebut, angleFin){
		let debut = this.polarToCartesian(x, y, radius, angleFin);
		let fin = this.polarToCartesian(x, y, radius, angleDebut);
		let largeArcFlag = (angleFin - angleDebut <= 180) ? "0" : "1";
		let d = [
		  "M", debut.x, debut.y,
		  "A", radius, radius, 0, largeArcFlag, 0, fin.x, fin.y
		].join(" ");
		return d;
	}

	decrireAiguille(centreX,centreY,angle){
		let transform = `rotate(${angle} ${centreX} ${centreY})`;
		return transform;
	}

	definirAttributArc(element,rayon,angle){
		element.setAttribute('d',this.decrireArc(this.centreX, this.centreY, rayon, 0, angle));
	}

	definirAttributAiguille(element,angle){
		element.setAttribute('transform',this.decrireAiguille(this.centreX,this.centreY,angle));
	}

	afficherHeure(){
		// positionner les éléments  arcs
		this.definirAttributArc(this.arcHeures,this.arcRayonHeures,this.angleHeures);
		this.definirAttributArc(this.arcMinutes,this.arcRayonMinutes,this.angleMinutes);
		this.definirAttributArc(this.arcSecondes,this.arcRayonSecondes,this.angleSecondes);
		// positionner les éléments aiguilles
		this.definirAttributAiguille(this.aiguilleHeures,this.angleHeures);
		this.definirAttributAiguille(this.aiguilleMinutes,this.angleMinutes);
		this.definirAttributAiguille(this.aiguilleSecondes,this.angleSecondes);
	}

	definirAngles(){
		// récupérer hh, mm, ss et les convertir en angles
		let hh = Number(this.date.getHours());
		(hh >= 12) ? hh -=12 : null; // ramener à une horloge de 12h
		const mm = Number(this.date.getMinutes());
		const ss = Number(this.date.getSeconds());
		this.angleHeures = 30 * hh; // 360° / 12heures = 30°
		this.angleMinutes = 6 * mm; // 360° / 60 minutes = 6
		this.angleSecondes = 6 * ss;
	}

	ecrireDate(){
		// date traduite
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		// récupérer la chaine avec première lettre en majuscule
		let dateLisible = this.date.toLocaleDateString(undefined,options);
		dateLisible = dateLisible[0].toUpperCase() + dateLisible.substring(1);
		// undefined pour récupérer la langue du navigateur :
		this.texteDate.innerHTML = dateLisible;
		// date format RFC822
		const dateString = this.date.toString(); // ex : Thu Oct 01 2020 10:24:03 GMT+0200 (heure d’été d’Europe centrale)
		const tableauDate = dateString.split(' ');
		// ajouter virgule après le jour
		tableauDate[0] += ',';
		// le numéro du jour n'a qu'un chiffre
		tableauDate[2] = Number(tableauDate[2]).toString();
		// enlever "GMT"
		tableauDate[5] = tableauDate[5].replace('GMT','');
		// placer le mois après le jour
		const mois = tableauDate[1];
		tableauDate.splice(1,1); // supprimer le mois
		tableauDate.splice(2,0,mois) // ajouter le mois
		// un nouveau tableau qui ne garde que les 6 premiers index
		const tableauOk = tableauDate.slice(0,6);
		// écrire en string ^^
		this.texteDateRFC.innerHTML = tableauOk.join(' ');
	}

	definirCadranNombres(valeur = 0){
		if(!this.changerCadran){
			for (let i = 1, longueur = this.cadran.children.length+1; i < longueur; i++) {
				this.cadran.children[i-1].innerHTML = i + valeur;
			}
			this.changerCadran = true;
			setTimeout(function(){
				this.changerCadran = false;
			},1000);
		}
	}

	intervalleHorloge(){
		// une nouvelle date
		this.date = new Date();
		// écrire la nouvelle date
		this.ecrireDate();
		// calculer les angles
		this.definirAngles();
		// afficher l'heure
		// this.afficherHeure();
		// animer après un certain temps pour faire correspondre la fin de l'anim avec le changement de chiffre dans le texte
		setTimeout(function(){
			this.animerTemps(this.aiguilleSecondes,this.arcSecondes,this.arcRayonSecondes,this.angleSecondes,this.angleSecondes+6,this.paramIntervalles.tempsTotal);
			if(this.date.getSeconds() === 59){
				this.animerTemps(this.aiguilleMinutes,this.arcMinutes,this.arcRayonMinutes,this.angleMinutes,this.angleMinutes+6,this.paramIntervalles.tempsTotal);
			}
			if(this.date.getSeconds() === 59 && this.date.getMinutes() === 59){
				this.animerTemps(this.aiguilleHeures,this.arcHeures,this.arcRayonHeures,this.angleHeures,this.angleHeures+30,this.paramIntervalles.tempsTotal);
			}
		}.bind(this),this.intervalleTemps - this.paramIntervalles.tempsTotal); // calcul du temps restant à partir duquel lancer l'anim (ici  : 1000 - 400 = 600)
		// s'il est midi ou minuit, changer les nombres du cadran
		switch (this.date.toLocaleTimeString()) {
			case '13:00:00':
				this.definirCadranNombres(12);
				break;
			case '01:00:00':
				this.definirCadranNombres(0);
				break;
		}
	}

	animerTemps(aiguille, arc,rayon,startAngle, endAngle, animationDuration){
	   let startTime = performance.now();
	   function doAnimationStep() {
			// obtenir la progression de l'animation entre 0 et 1
			let progress = Math.min((performance.now() - startTime) / animationDuration, 1.0);
			// l'angle de fin pour cette étape d'animation
			let angle = startAngle + progress * (endAngle - startAngle);
			// Calculate the sector shape
			// var arc = describeArc(x, y, radius, startAngle, angle);
			// Update the path
			// document.getElementById("arc1").setAttribute("d", arc);
			this.definirAttributAiguille(aiguille,angle);
			this.definirAttributArc(arc,rayon,angle);
			// If animation is not finished, then ask browser for another animation frame.
			if (progress < 1.0){
				requestAnimationFrame(doAnimationStep.bind(this));
			}
		}
	   requestAnimationFrame(doAnimationStep.bind(this));
	}
}

document.addEventListener('DOMContentLoaded',()=>{
	new Horloge();
});
