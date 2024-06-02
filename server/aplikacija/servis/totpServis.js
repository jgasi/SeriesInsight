const crypto = require("crypto");
const base32 = require("base32");

const restKorisnik = require("./restKorisnik.js");

const notp = require("notp");
const otplib = require("otplib");
const speakeasy = require("speakeasy");

function generateTOTP(sharedSecret) {
	const totpToken = speakeasy.totp({
		secret: sharedSecret,
		encoding: "base32",
		algorithm: "sha256",
		digits: 6,
		step: 30,
	});

	return totpToken;
}

function provjeriTOTP(req, res) {
	const { korisnickoIme, totp } = req.body;
	console.log("Korisnicko ime: " + korisnickoIme);
	console.log("Totp: " + totp);

	restKorisnik.getKorisnikZaTOTP(korisnickoIme, (error, korisnik) => {
		if (error) {
			return res.status(500).json({ message: "Internal Server Error." });
		}

		console.log("Korisnik korisnik: " + korisnik.ime);

		const totpKljuc = korisnik.TOTPkljuc;
		console.log("totpKljuc: : " + totpKljuc);

		const ispravanTOTP = provjeriIspravnostTOTP(totp, totpKljuc, 1);

		if (ispravanTOTP) {
			res.json({ message: "Ispravan TOTP!" });
		} else {
			res.status(401).json({ message: "Neispravan TOTP." });
		}
	});
}

function provjeriIspravnostTOTP(unos, kljucIzBaze) {
	const unosBezNebrojeva = unos.replace(/\D/g, "");

	console.log("Unos bez razmaka i samo brojevi: " + unosBezNebrojeva);

	const generiraniTOTP = generateTOTP(kljucIzBaze);

	console.log("Generirani TOTP: " + generiraniTOTP);

	const ispravan = generiraniTOTP === unosBezNebrojeva;
	return ispravan;
}

module.exports = {
	provjeriTOTP,
	generateTOTP,
	provjeriIspravnostTOTP,
};
