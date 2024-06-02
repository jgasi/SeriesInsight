const Baza = require("./baza.js");
const KorisnikDAO = require("./korisnikDAO.js");
const SezoneDAO = require("./sezoneDAO.js");

class SerijeDAO {
	constructor() {
		this.baza = new Baza("../RWA2023jgasi20.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM serija;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	daj = async function (naziv) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM serija WHERE naziv=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [naziv]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dajFavoriteKorisnika = async function (korime) {
		this.baza.spojiSeNaBazu();
		let kdao = new KorisnikDAO();
		var korisnik = await kdao.daj(korime);
		var korisnikId = korisnik.id_korisnik;
		let sql = "SELECT * FROM favorit WHERE korisnik_id=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korisnikId]);

		let serije = [];
		for (let favorit of podaci) {
			let serijaSql = "SELECT * FROM serija WHERE TMDB_id_serije=?;";
			let serijaPodaci = await this.baza.izvrsiUpit(serijaSql, [
				favorit.serija_id,
			]);
			if (serijaPodaci.length > 0) {
				serije.push(serijaPodaci[0]);
			}
		}

		this.baza.zatvoriVezu();
		return serije;
	};

	dodajFavorita = async function (serija, korime) {
		let kdao = new KorisnikDAO();
		var korisnik = await kdao.daj(korime);

		if (!korisnik) {
			console.error("Korisnik nije pronađen.");
			return;
		}

		var korisnikId = korisnik.id_korisnik;

		let provjeraSql = `SELECT * FROM favorit WHERE korisnik_id = ? AND serija_id = ?`;
		let provjeraPodaci = [korisnikId, serija.TMDB_id_serije];

		let rezultatProvjere = await this.baza.izvrsiUpit(
			provjeraSql,
			provjeraPodaci
		);

		if (rezultatProvjere.length > 0) {
			return;
		}

		let sql = `INSERT INTO favorit (korisnik_id, serija_id) VALUES (?, ?)`;
		let podaci = [korisnikId, serija.TMDB_id_serije];

		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	};

	dodaj = async function (serija) {
		let sdao = new SerijeDAO();
		let serijaPostoji = await sdao.daj(serija.naziv);

		if (!serijaPostoji) {
			let sql = `INSERT INTO serija (naziv,opis,broj_sezona,broj_epizoda,popularnost,slika,poveznica,TMDB_id_serije) VALUES (?,?,?,?,?,?,?,?)`;
			let podaci = [
				serija.naziv,
				serija.opis,
				serija.broj_sezona,
				serija.broj_epizoda,
				serija.popularnost,
				serija.slika,
				serija.poveznica,
				serija.TMDB_id_serije,
			];
			await this.baza.izvrsiUpit(sql, podaci);
		}

		await this.dodajFavorita(serija, serija.korime);
		return true;
	};

	obrisi = async function (naziv) {
		let sql = "DELETE FROM serija WHERE naziv=?";
		await this.baza.izvrsiUpit(sql, [naziv]);
		return true;
	};
}

module.exports = SerijeDAO;
