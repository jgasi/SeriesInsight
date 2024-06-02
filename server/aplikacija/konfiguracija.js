const ds = require("fs/promises");
const path = require("path");

class Konfiguracija {
	constructor() {
		this.konf = {};
	}
	dajKonf() {
		return this.konf;
	}

	async ucitajKonfiguraciju() {
		const putanjaDoKonfiguracije = path.join(
			__dirname,
			"../rwa_jgasi20_conf.csv"
		);
		try {
			let podaci = await ds.readFile(putanjaDoKonfiguracije, "UTF-8");
			this.konf = pretvoriJSONkonfig(podaci);
		} catch (error) {
			console.error("Greška prilikom čitanja konfiguracijske datoteke:", error);
		}
	}
}

function provjeriPostojanjeKonfiguracijskeDatoteke(naziv) {
	if (
		naziv == "jwtValjanost" ||
		naziv == "jwtTajniKljuc" ||
		naziv == "tajniKljucSesija" ||
		naziv == "appStranicenje" ||
		naziv == "tmdb.apikey.v3" ||
		naziv == "tmdb.apikey.v4"
	) {
	} else {
		throw new Error("Konfiguracijska datoteka ne postoji.");
	}
}

function provjeriVrijednosti(naziv, vrijednost) {
	if (naziv == "jwtValjanost") {
		if (vrijednost < 15 || vrijednost > 3600) {
			throw new Error("jwtValjanost nije ispravna");
		}
	} else if (naziv == "jwtTajniKljuc") {
		if (vrijednost.length < 50 || vrijednost.length > 100) {
			throw new Error("jwtTajniKljuc nije ispravna");
		} else if (!/^[a-zA-Z0-9]+$/m.test(vrijednost)) {
			throw new Error(
				`${naziv} može sadržavati samo velika i mala slova te brojke`
			);
		}
	} else if (naziv == "tajniKljucSesija") {
		if (vrijednost < 15 || vrijednost > 3600) {
			throw new Error("tajniKljucSesija nije ispravna");
		}
	} else if (naziv == "appStranicenje") {
		if (vrijednost < 5 || vrijednost > 100) {
			throw new Error("appStranicenje nije ispravna");
		}
	}
}

function pretvoriJSONkonfig(podaci) {
	let konf = {};
	var nizPodataka = podaci.split("\n");
	for (let podatak of nizPodataka) {
		var podatakNiz = podatak.split(":");
		var naziv = podatakNiz[0];
		var vrijednost = podatakNiz[1];
		konf[naziv] = vrijednost;

		provjeriPostojanjeKonfiguracijskeDatoteke(naziv);
		provjeriVrijednosti(naziv, vrijednost);
	}
	return konf;
}

module.exports = Konfiguracija;
