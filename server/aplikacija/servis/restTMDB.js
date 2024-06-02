const TMDBklijent = require("./klijentTMDB.js");
const SerijeDAO = require("./serijeDAO.js");

class RestTMDB {
	constructor(api_kljuc) {
		this.tmdbKlijent = new TMDBklijent(api_kljuc);

		this.tmdbKlijent
			.dohvatiSeriju(500)
			.then(() => console.log(""))
			.catch(() => console.log("restTMDB catch"));
	}

	getEpizode(zahtjev, odgovor) {
		this.tmdbKlijent
			.dohvatiEpizode()
			.then((epizode) => {
				odgovor.type("application/json");
				odgovor.send(epizode);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	getSezone(zahtjev, odgovor) {
		let idSerije = zahtjev.query.id;

		this.tmdbKlijent
			.dohvatiSeriju(idSerije)
			.then((sezone) => {
				odgovor.type("application/json");
				odgovor.send(sezone);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	getSerije(zahtjev, odgovor) {
		odgovor.type("application/json");
		let stranica = zahtjev.query.stranica;
		let trazi = zahtjev.query.trazi;

		if (stranica == undefined || trazi == undefined) {
			return;
		}

		this.tmdbKlijent
			.pretraziSerijuPoNazivu(trazi, stranica)
			.then((serije) => {
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	getSveSerije(zahtjev, odgovor) {
		odgovor.type("application/json");

		this.tmdbKlijent
			.pretraziSveSerije("", 25)
			.then((serije) => {
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.status(500).json(greska);
			});
	}

	getBazaFavoritiId(zahtjev, odgovor) {
		odgovor.type("application/json");
		let idSerije = zahtjev.params.id;

		this.tmdbKlijent
			.dohvatiSeriju(idSerije)
			.then((serije) => {
				odgovor.status(200);
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	postBazaFavoritiId(zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		odgovor.send("Zabranjeno");
	}

	putBazaFavoritiId(zahtjev, odgovor) {
		odgovor.type("application/json");
		odgovor.status(405);
		odgovor.send("Zabranjeno");
	}

	deleteBazaFavoritiId(zahtjev, odgovor) {
		odgovor.type("application/json");
		let idSerije = zahtjev.params.id;

		this.tmdbKlijent
			.dohvatiSeriju(idSerije)
			.then((serije) => {
				let sdao = new SerijeDAO();
				sdao.obrisi(serije.naziv);
				odgovor.status(201);
				odgovor.send();
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	getSerijeDetalji(zahtjev, odgovor) {
		odgovor.type("application/json");
		let idSerije = zahtjev.query.id;

		this.tmdbKlijent
			.dohvatiSeriju(idSerije)
			.then((serije) => {
				odgovor.status(200);
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}

	getSerijeDetaljii(zahtjev, odgovor) {
		odgovor.type("application/json");
		let idSerije = zahtjev.params.id;

		this.tmdbKlijent
			.dohvatiSeriju(idSerije)
			.then((serije) => {
				odgovor.status(200);
				odgovor.send(serije);
			})
			.catch((greska) => {
				odgovor.json(greska);
			});
	}
}

module.exports = RestTMDB;
