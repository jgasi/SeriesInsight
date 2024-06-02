const jwt = require("jsonwebtoken");

exports.kreirajToken = function (korisnik, tajniKljucJWT) {
	let token = jwt.sign({ korime: korisnik.korime }, tajniKljucJWT, {
		expiresIn: "15s",
	});
	return token;
};

exports.provjeriToken = function (zahtjev, tajniKljucJWT) {
	if (zahtjev.headers.authorization != null) {
		let token = zahtjev.headers.authorization;
		try {
			let podaci = jwt.verify(token, tajniKljucJWT);
			console.log("JWT podaci: " + podaci);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	return false;
};

exports.ispisiDijelove = function (token) {
	let dijelovi = token.split(".");
	let zaglavlje = dekodirajBase64(dijelovi[0]);
	let tijelo = dekodirajBase64(dijelovi[1]);
	let potpis = dekodirajBase64(dijelovi[2]);
};

exports.dajTijelo = function (token) {
	let dijelovi = token.split(".");
	return JSON.parse(dekodirajBase64(dijelovi[1]));
};

function dekodirajBase64(data) {
	let buff = new Buffer(data, "base64");
	return buff.toString("ascii");
}
