const SerijeDAO = require("./serijeDAO.js");

exports.getSerije = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	sdao.dajSve().then((serije) => {
		odgovor.send(JSON.stringify(serije));
	});
};

exports.postSerije = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let podaci = zahtjev.body;
	let sdao = new SerijeDAO();
	sdao.dodaj(podaci).then((poruka) => {
		odgovor.status(201);
		odgovor.send(JSON.stringify(poruka));
	});
};

exports.deleteSerije = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putSerije = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getSeriju = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	let korime = zahtjev.params.korime;
	sdao.daj(korime).then((korisnik) => {
		odgovor.send(JSON.stringify(korisnik));
	});
};

exports.getSerijuPoId = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	let idSerije = zahtjev.params.idSerije;
	sdao.daj(idSerije).then((serija) => {
		odgovor.send(JSON.stringify(serija));
	});
};

exports.getSerijeFavoriteZaKorisnika = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	let korisnickoIme = zahtjev.query.korime;
	sdao.dajFavoriteKorisnika(korisnickoIme).then((serija) => {
		odgovor.status(200);
		odgovor.send(JSON.stringify(serija));
	});
};

exports.getSerijeFavoriteZaKorisnikaa = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let sdao = new SerijeDAO();
	let korisnickoIme = zahtjev.params.korime;
	sdao.dajFavoriteKorisnika(korisnickoIme).then((serija) => {
		odgovor.status(200);
		odgovor.send(JSON.stringify(serija));
	});
};

exports.postSeriju = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "metoda nije dopuštena" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteSeriju = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putSeriju = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let korime = zahtjev.params.korime;
	let podaci = zahtjev.body;
	let sdao = new SerijeDAO();
	sdao.azuriraj(korime, podaci).then((poruka) => {
		odgovor.send(JSON.stringify(poruka));
	});
};
