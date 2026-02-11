"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientUsersRouter = void 0;
const express_1 = require("express");
const client_users_controller_1 = require("../controllers/client-users.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.clientUsersRouter = (0, express_1.Router)();
exports.clientUsersRouter.use(auth_middleware_1.protect);
exports.clientUsersRouter.get("/", (0, auth_middleware_1.authorizePermission)("Client List", "view"), client_users_controller_1.getClientUsers);
