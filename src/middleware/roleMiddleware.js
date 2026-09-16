export const coachOrAdmin = ( req, res, next) => {

    if (req.user.role !== "COACH" && req.user.role !== "ADMIN"){
        return res.status(403).json({
            error: "Access denied. Only coaches and admins can perform this action.",
        });
    }

    next();
}

export const organiserOrAdmin = ( req, res, next ) => {

    if (req.user.role !== "ORGANISER" && req.user.role !== "ADMIN"){
        return res.status(403).json({
            error: "Access denied. Only organisers and admin can perform this action.",
        });
    }

    next();
};