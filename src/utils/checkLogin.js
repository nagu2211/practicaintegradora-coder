export default function checkLogin(req, res, next) {
	if (req.session.userName) {
		return next();
	} else {
		return res.status(201).send("you must start session to continue");
	}
}