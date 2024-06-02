const SezoneDAO = require("./sezoneDAO.js");

exports.postSezone = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let podaci = zahtjev.body;
	let sezdao = new SezoneDAO();
	sezdao.dodaj(podaci).then((poruka) => {
		odgovor.send(JSON.stringify(poruka));
	});
};
