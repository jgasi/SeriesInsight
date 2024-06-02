const Baza = require("./baza.js");

class SezoneDAO {
	constructor() {
		this.baza = new Baza("../RWA2023jgasi20.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM sezona;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	daj = async function (slika) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM sezona WHERE slika=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [slika]);
		this.baza.zatvoriVezu();
		if (podaci.length > 0) return podaci[0];
		else return null;
	};

	dodaj = async function (sezona) {
		let sezdao = new SezoneDAO();
		let sezonaPostoji = await sezdao.daj(sezona.slika);
		if (
			!sezonaPostoji ||
			(sezonaPostoji.naziv !== sezona.naziv &&
				sezonaPostoji.opis !== sezona.opis &&
				sezonaPostoji.broj_epizoda !== sezona.broj_epizoda &&
				sezonaPostoji.slika !== sezona.slika &&
				sezonaPostoji.serija_id !== sezona.serija_id)
		) {
			let sql = `INSERT INTO sezona (naziv,opis,broj_epizoda,slika,serija_id) VALUES (?,?,?,?,?)`;
			let podaci = [
				sezona.naziv,
				sezona.opis,
				sezona.broj_epizoda,
				sezona.slika,
				sezona.serija_id,
			];
			await this.baza.izvrsiUpit(sql, podaci);
			return true;
		} else {
			return true;
		}
	};

	obrisi = async function (naziv) {
		let sql = "DELETE FROM sezona WHERE naziv=?";
		await this.baza.izvrsiUpit(sql, [naziv]);
		return true;
	};
}

module.exports = SezoneDAO;
