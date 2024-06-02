const nodemailer = require("nodemailer");

let mailer = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: "",  //your mail
		pass: "",  //your app password - how to get the password -> https://support.google.com/accounts/answer/185833
	},
});

exports.posaljiMail = async function (salje, prima, predmet, poruka) {
	message = {
		from: salje,
		to: prima,
		subject: predmet,
		text: poruka,
	};

	let odgovor = await mailer.sendMail(message);
	return odgovor;
};
