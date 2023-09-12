export function checkLogin(req, res, next) {
	if (req.session?.user?.email) {
		return next();
	} else {
		return res.status(401).render("error-page",{msg:"you must start session to continue"});
	}
}
export function checkAdmin(req, res, next) {
	if (req.session?.user?.email && req.session?.user?.role == "admin") {
		return next();
	} else {
		return res.status(401).render("error-page",{msg:"please login as admin"});
	}
}
export function checkPremium(req, res, next) {
	if (req.session?.user?.role == "premium" || req.session?.user?.role == "admin") {
		return next();
	} else {
		return res.status(401).render("error-page",{msg:"please login as premium"});
	}
}