"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const httpStausCodes_1 = require("../../constants/httpStausCodes");
class AdminController {
    constructor(adminUseCase, userUseCase, theaterUseCase, ticketUseCase) {
        this.adminUseCase = adminUseCase;
        this.userUseCase = userUseCase;
        this.theaterUseCase = theaterUseCase;
        this.ticketUseCase = ticketUseCase;
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const authData = yield this.adminUseCase.verifyLogin(email, password);
            res.status(authData.status).json(authData);
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const searchQuery = req.query.searchQuery;
            const apiRes = yield this.userUseCase.getAllUsers(page, limit, searchQuery);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAllTheaters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const searchQuery = req.query.searchQuery;
            const apiRes = yield this.theaterUseCase.getAllTheaters(page, limit, searchQuery);
            res.status(apiRes.status).json(apiRes);
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.params, 'req.params');
                yield this.userUseCase.blockUser(req.params.userId);
                res.status(httpStausCodes_1.STATUS_CODES.OK).json();
            }
            catch (error) {
                const err = error;
                res.status(httpStausCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    blockTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.params, 'req.params');
                yield this.theaterUseCase.blockTheater(req.params.theaterId);
                res.status(httpStausCodes_1.STATUS_CODES.OK).json();
            }
            catch (error) {
                const err = error;
                res.status(httpStausCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: err.message });
            }
        });
    }
    theaterApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const action = req.query.action;
            const apiRes = yield this.theaterUseCase.theaterApproval(theaterId, action);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getRevenueData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.ticketUseCase.getAdminRevenue();
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.AdminController = AdminController;
