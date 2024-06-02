const Baza = require("./baza.js");
const kodovi = require("../moduli/kodovi.js");

class KorisnikDAO {
	constructor() {
		this.baza = new Baza("../RWA2023jgasi20.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dodaj = async function (korisnik) {
		let sql = `INSERT INTO korisnik (korime,ime,prezime,email,lozinka,adresa,drzava,telefon,tip_korisnika_id, dvorazinskaAutentifikacija, prikazanKljuc) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
		let podaci = [
			korisnik.korime,
			korisnik.ime,
			korisnik.prezime,
			korisnik.email,
			korisnik.lozinka,
			korisnik.adresa,
			korisnik.drzava,
			korisnik.telefon,
			1,
			korisnik.dvorazinskaAutentifikacija || 0,
			0,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};

	obrisi = async function (korime) {
		let korisnik = await this.daj(korime);
		let korisnikId = korisnik.id_korisnik;
		this.baza.spojiSeNaBazu();
		let sql1 = "DELETE FROM favorit WHERE korisnik_id=?";
		let sql2 = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql1, [korisnikId]);
		await this.baza.izvrsiUpit(sql2, [korime]);
		this.baza.zatvoriVezu();
		return true;
	};

	azuriraj = async function (korime, korisnik) {
		let sql = `UPDATE korisnik SET ime=?, prezime=?, email=?, lozinka=?, adresa=?, drzava=?, telefon=?, dvorazinskaAutentifikacija=?, TOTPkljuc=?, prikazanKljuc=? WHERE korime=?`;
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.email,
			kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
			korisnik.adresa,
			korisnik.drzava,
			korisnik.telefon,
			korisnik.dvorazinskaAutentifikacija,
			korisnik.TOTPkljuc,
			korisnik.prikazanKljuc,
			korime,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};
}

module.exports = KorisnikDAO;
