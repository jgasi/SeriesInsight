const portRest = 12012;
const portRests = 12056;
const url = "http://spider.foi.hr:" + portRests + "/baza";
const urls = "http://localhost:" + portRest + "/baza";

class PocetnaSerijePretrazivanje {
	async dohvatiSeriju(stranica, kljucnaRijec = "") {
		let putanja =
			urls + "/tmdb/serije?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		return serije;
	}

	async dohvatiSveSezonu() {
		let odgovor = await fetch(urls + "/tmdb/sezone");
		let podaci = await odgovor.text();
		let sezone = JSON.parse(podaci).seasons;
		return sezone;
	}

	async dohvatiSveEpizode() {
		let odgovor = await fetch(urls + "/tmdb/epizode");
		let podaci = await odgovor.text();
		let epizode = JSON.parse(podaci).episodes;
		return epizode;
	}
}

module.exports = PocetnaSerijePretrazivanje;
