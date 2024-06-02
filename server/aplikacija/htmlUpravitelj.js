const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js");
const Autentifikacija = require("./autentifikacija.js");
const auth = new Autentifikacija();

class HtmlUpravitelj {
	constructor(tajniKljucJWT) {
		this.tajniKljucJWT = tajniKljucJWT;
	}

	pocetna = async function (zahtjev, odgovor) {
		let pocetna = await ucitajStranicu("pocetna");
		odgovor.send(pocetna);
	};

	registracija = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await auth.dodajKorisnika(zahtjev.body);
			if (uspjeh) {
				//odgovor.redirect("/prijava");
				return;
			} else {
				greska = "Dodavanje nije uspjelo provjerite podatke!";
			}
		}

		let stranica = await ucitajStranicu("registracija", greska);
		odgovor.send(stranica);
	};

	odjava = async function (zahtjev, odgovor) {
		zahtjev.session.korisnik = null;
		odgovor.redirect("/");
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await auth.prijaviKorisnika(korime, lozinka);

			if (korisnik) {
				//zahtjev.session.jwt = jwt.kreirajToken(korisnik, this.tajniKljucJWT);
				korisnik = JSON.parse(korisnik);
				zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
				zahtjev.session.korime = korisnik.korime;

				odgovor.cookie("korimePrijave", korisnik.korime, {
					maxAge: 1000 * 60 * 60 * 3,
				});

				odgovor.redirect("/");
				return;
			} else {
				greska = "Netočni podaci!";
			}
		}

		let stranica = await ucitajStranicu("/prijava", greska);
		odgovor.send(stranica);
	};

	prijavaa = async function (zahtjev, odgovor) {
		let greska = "";
		var korime = zahtjev.params.korime;
		var lozinka = zahtjev.params.lozinka;
		var korisnik = await auth.prijaviKorisnika(korime, lozinka);

		if (korisnik) {
			//zahtjev.session.jwt = jwt.kreirajToken(korisnik, this.tajniKljucJWT);
			korisnik = JSON.parse(korisnik);
			zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
			zahtjev.session.korime = korisnik.korime;

			// odgovor.cookie("korimePrijave", korisnik.korime, {
			// 	maxAge: 1000 * 60 * 60 * 3,
			// 	domain: "localhost",
			// });

			return odgovor.status(200).send();
		} else {
			greska = "Netočni podaci!";
			return odgovor.status(401).send();
		}
	};

	provjeriSesiju = async function (zahtjev, odgovor) {
		if (!zahtjev.session) {
			odgovor.status(401);
			odgovor.send("Zabranjen pristup");
		} else {
			odgovor.status(201);
			odgovor.send();
		}
	};

	dokumentacija = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicuDokumentacija("/dokumentacija");
		odgovor.send(stranica);
	};

	korisnici = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/korisnici");
		odgovor.send(stranica);
	};

	profil = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/profil");
		odgovor.send(stranica);
	};

	favoriti = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/favoriti");
		odgovor.send(stranica);
	};

	dnevnik = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/dnevnik");
		odgovor.send(stranica);
	};

	serijaDetalji = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/serijaDetalji");
		odgovor.send(stranica);
	};

	favoritDetalji = async function (zahtjev, odgovor) {
		let stranica = await ucitajStranicu("/favoritDetalji");
		odgovor.send(stranica);
	};
}

module.exports = HtmlUpravitelj;

async function ucitajStranicu(nazivStranice, poruka = "") {
	let stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}

async function ucitajStranicuDokumentacija(nazivStranice, poruka = "") {
	let stranice = [
		ucitajHTMLDokumentacija(nazivStranice),
		ucitajHTML("navigacija"),
	];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTMLDokumentacija(htmlStranica) {
	return ds.readFile(
		__dirname + "/dokumentacija/" + htmlStranica + ".html",
		"UTF-8"
	);
}
