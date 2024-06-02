import express from "express";
import sesija from "express-session";
import kolacici from "cookie-parser";
import sqlite3 from "./node_modules/sqlite3/lib/sqlite3.js";
import HtmlUpravitelj from "./htmlUpravitelj.js";
import FetchUpravitelj from "./fetchUpravitelj.js";
import Konfiguracija from "./konfiguracija.js";
import path from "path";
//import odjavaKorisnika from "./js/odjava.js";
import restKorisnik, {
	deleteKorisnici,
	getKorisnici,
	postKorisnici,
} from "./servis/restKorisnik.js";
import RestTMDB from "./servis/restTMDB.js";
import restSerije, {
	deleteSerije,
	getSerije,
	postSerije,
} from "./servis/restSerije.js";
import restSezone, { postSezone } from "./servis/restSezone.js";

import cors from "cors";
import { verifyRecaptcha } from "./servis/recaptchaServis.js";

import totpServis from "./servis/totpServis.js";

// import portovi from "/var/www/RWA/2023/portovi.js";
// const port = portovi.jgasi20;
const port = 12012;

const __dirname = path.resolve();
const angularDistPath = path.join(
	__dirname,
	"..",
	"angular",
	"dist",
	"rwa-zadaca",
	"browser"
);

import bodyParser from "body-parser";

const server = express();
server.use(cors());

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(kolacici());
server.use(
	sesija({
		secret: "sLu64jhQp3tRm7BfZyPv2eNcKwTqXrYxVbLlA9sHkE1oGzWuM4IjF8dC0n6O",
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60 * 3 },
		resave: false,
	})
);

const konf = new Konfiguracija();

konf
	.ucitajKonfiguraciju()
	.then(pokreniServer)
	.catch((greska) => {
		console.log(greska);
		if (process.argv.length == 2) {
			console.error("Molimo unesite naziv datoteke!");
		} else {
			console.error("Nije moguće otvoriti datoteku: " + greska.path);
		}
	});

function pokreniServer() {
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(kolacici());

	pripremiPutanjeAngular();
	server.use("/", express.static(angularDistPath));

	server.use("/css", express.static("css"));
	server.use("/dokumentacija", express.static("dokumentacija"));
	server.use("/slike", express.static("slike"));
	server.use("/js", express.static("js"));
	server.use("/html", express.static("html"));

	pripremiPutanjeUpravitelj();
	pripremiPutanjeKorisnik();
	pripremiPutanjeRest();

	server.use((zahtjev, odgovor) => {
		odgovor.status(404);
		odgovor.json({ opis: "nema resursa" });
	});

	server.listen(port, () => {
		console.log(`Server pokrenut na portu: ${port}`);
	});
}

function pripremiPutanjeKorisnik() {
	const htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);
	server.get("/baza/korisnici", restKorisnik.getKorisnici);
	server.post("/baza/korisnici", restKorisnik.postKorisnici);
	server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
	server.put("/baza/korisnici", restKorisnik.putKorisnici);

	server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
	server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
	server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
	server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);

	server.get("/baza/korisnici/:korime/prijava", htmlUpravitelj.provjeriSesiju);
	server.post(
		"/baza/korisnici/:korime/prijava",
		restKorisnik.getKorisnikPrijava
	);
}

function pripremiPutanjeRest() {
	let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);

	server.get("/baza/tmdb/serije", restTMDB.getSveSerije.bind(restTMDB));
	server.post("/pocetna", restTMDB.getSerije.bind(restTMDB));
	server.post("/serijaDetalji", restTMDB.getSerijeDetalji.bind(restTMDB));
	server.get("/detalji-serije/:id", restTMDB.getSerijeDetaljii.bind(restTMDB));

	server.get("/baza/favoriti/:id", restTMDB.getBazaFavoritiId.bind(restTMDB));
	server.post("/baza/favoriti/:id", restTMDB.postBazaFavoritiId.bind(restTMDB));
	server.put("/baza/favoriti/:id", restTMDB.putBazaFavoritiId.bind(restTMDB));
	server.delete(
		"/baza/favoriti/:id",
		restTMDB.deleteBazaFavoritiId.bind(restTMDB)
	);

	server.get("/sezoneDetalji", restTMDB.getSezone.bind(restTMDB));
	server.post("/sezoneDetalji", restTMDB.getSezone.bind(restTMDB));

	server.post("/spremiSezone", restSezone.postSezone);
	server.get("/baza/favoriti", restSerije.getSerijeFavoriteZaKorisnika);
	server.get(
		"/baza/favoritii/:korime",
		restSerije.getSerijeFavoriteZaKorisnikaa
	);
	server.post("/baza/favoriti", restSerije.postSerije);

	server.post("/provjeri-recaptcha", async (zahtjev, odgovor) => {
		const { recaptchaToken } = zahtjev.body;

		try {
			const rezultat = await verifyRecaptcha(recaptchaToken);
			if (rezultat) {
				odgovor
					.status(200)
					.json({ success: true, message: "ReCAPTCHA token je valjan." });
			} else {
				odgovor.status(400).json({
					success: false,
					message: "ReCAPTCHA token nije valjan ili ima nisku ocjenu.",
				});
			}
		} catch (error) {
			console.error("Greška prilikom provjere reCAPTCHA tokena:", error);
			odgovor.status(500).json({
				success: false,
				message: "Greška prilikom provjere reCAPTCHA tokena.",
			});
		}
	});

	server.post("/provjeri-totp", totpServis.provjeriTOTP);
}

function pripremiPutanjeAngular() {
	server.get("/", (zahtjev, odgovor) => {
		odgovor.sendFile(angularDistPath + "/index.html");
	});
}

function pripremiPutanjeUpravitelj() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc);

	server.get("/", htmlUpravitelj.pocetna);
	server.get("/pocetna", htmlUpravitelj.pocetna);
	server.get("/registracija", htmlUpravitelj.registracija);
	server.post("/registracija", htmlUpravitelj.registracija);
	server.get("/prijava", htmlUpravitelj.prijava);
	server.post("/prijava", htmlUpravitelj.prijava);
	server.post("/prijava/:korime/:lozinka", htmlUpravitelj.prijavaa);
	server.get("/dokumentacija", htmlUpravitelj.dokumentacija);
	server.get("/korisnici", htmlUpravitelj.korisnici);
	server.get("/profil", htmlUpravitelj.profil);
	server.get("/favoriti", htmlUpravitelj.favoriti);
	server.get("/dnevnik", htmlUpravitelj.dnevnik);
	server.get("/serijaDetalji", htmlUpravitelj.serijaDetalji);
	server.get("/favoritDetalji", htmlUpravitelj.favoritDetalji);
	//server.get("/odjava", odjavaKorisnika);
}
