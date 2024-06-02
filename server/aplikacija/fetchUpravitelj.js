const jwt = require("./moduli/jwt.js");
const restTMDB = require("./servis/restTMDB.js");
const resttTMDB = new restTMDB();
const Autentifikacija = require("./autentifikacija.js");
const auth = new Autentifikacija();

class FetchUpravitelj {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
	}

	aktvacijaRacuna = async function (zahtjev, odgovor) {
		console.log(zahtjev.query);
		let korime = zahtjev.query.korime;
		let kod = zahtjev.query.kod;

		let poruka = await this.auth.aktivirajKorisnickiRacun(korime, kod);
		console.log(poruka);

		if (poruka.status == 200) {
			odgovor.send(await poruka.text());
		} else {
			odgovor.send(await poruka.text());
		}
	};

	getJWT = async function (zahtjev, odgovor) {
		odgovor.type("json");
		if (zahtjev.session.jwt != null) {
			let k = { korime: jwt.dajTijelo(zahtjev.session.jwt).korime };
			let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
			odgovor.send({ ok: noviToken });
			return;
		}
		odgovor.status(401);
		odgovor.send({ greska: "nemam token!" });
	};

	getSerijeDetalji = async function (zahtjev, odgovor) {
		var odgovor = await resttTMDB.getSerijeDetalji(zahtjev, odgovor);
		return odgovor;
	};
}
module.exports = FetchUpravitelj;
