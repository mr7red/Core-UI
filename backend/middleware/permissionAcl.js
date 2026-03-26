// module.exports = (permissionName) => {
//     return (req, res, next) => {

//         try {

//             const user = req.user;

//             if (!user) {
//                 return res.status(401).json({ message: "Unauthorized" });
//             }

//             if (user.role === "admin" || user.role?.name === "Superadmin") {
//                 return next();
//             }

//             if (!user.role || !user.role.permissions) {
//                 return res.status(403).json({ message: "Permission Denied" });
//             }

//             if (user.role.permissions?.[permissionName] !== true) {
//                 return res.status(403).json({ message: "No Permission" });
//             }

//             next();

//         } catch (err) {
//             return res.status(500).json({ message: "Server Error" });
//         }

//     };
// };


module.exports = (permissionName) => {
    return (req, res, next) => {

        if (req.roleName === "Admin") {
            return next();
        }

        const role = req.role

        if (!role || !role.permissions) {
            return res.status(403).json({ message: "No permissions" })
        }

        if (role.permissions[permissionName]) {
            return next()
        }

        return res.status(403).json({ message: "Permission denied" })
    }
}