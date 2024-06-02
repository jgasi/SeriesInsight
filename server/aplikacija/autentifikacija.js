const mail = require("./moduli/mail.js");
const kodovi = require("./moduli/kodovi.js");
let urls = "http://localhost:12012";
let url = "http://spider.foi.hr:12056";

class Autentifikacija {
	async dodajKorisnika(korisnik) {
		let tijelo = {
			korime: korisnik.korime,
			ime: korisnik.ime,
			prezime: korisnik.prezime,
			email: korisnik.email,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
			adresa: korisnik.adresa,
			drzava: korisnik.drzava,
			telefon: korisnik.telefon,
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(urls + "/baza/korisnici", parametri);

		if (odgovor.status == 201) {
			let mailPoruka =
				"Korisničko ime: " + korisnik.korime + ". Lozinka: " + korisnik.lozinka;

			let poruka = await mail.posaljiMail(
				"jgasi20@student.foi.hr",
				korisnik.email,
				"Korisnički podaci",
				mailPoruka
			);
			return true;
		} else {
			return false;
		}
	}

	async prijaviKorisnika(korime, lozinka) {
		lozinka = kodovi.kreirajSHA256(lozinka, "moja sol");
		let tijelo = {
			lozinka: lozinka,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			urls + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);

		if (odgovor.status == 201) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
