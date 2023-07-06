export function checkLogin(req, res, next) {
	if (req.session.email) {
		return next();
	} else {
		return res.status(401).render("error-page",{msg:"you must start session to continue"});
	}
}
export function checkAdmin(req, res, next) {
	if (req.session?.email && req.session?.rol == "admin") {
		return next();
	} else {
		return res.status(401).render("error-page",{msg:"please log in as admin"});
	}
}