const axios = require("axios");
const qs = require("qs");

const verifyRecaptcha = async (token) => {
	const secretKey = "6Lf6JT8pAAAAAK1SF57EK91y_SbDBHuHZkc1LAKW";
	console.log(token);

	try {
		const response = await axios.post(
			"https://www.google.com/recaptcha/api/siteverify",
			qs.stringify({
				secret: secretKey,
				response: token,
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		console.log("ReCAPTCHA response:", response.data);

		const { success, score } = response.data;

		if (success && score >= 0.5) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.error("Greška prilikom ReCAPTCHA provjere:", error);
		throw error;
	}
};

module.exports = { verifyRecaptcha };
