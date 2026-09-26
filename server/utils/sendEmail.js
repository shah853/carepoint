const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

	if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
		throw new Error('SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS must be configured to send email');
	}

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: process.env.SMTP_SECURE === 'true',
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS,
		},
	});

	return transporter.sendMail({
		from: process.env.EMAIL_FROM || SMTP_USER,
		to,
		subject,
		html,
	});
};

module.exports = sendEmail;