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
exports.ShowController = void 0;
class ShowController {
    constructor(_showUseCase) {
        this._showUseCase = _showUseCase;
    }
    // To find all the shows on a theater on a specific day
    findShowsOnTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const date = req.query.date;
            const apiRes = yield this._showUseCase.findShowsOnTheater(theaterId, date, 'Theater');
            res.status(apiRes.status).json(apiRes);
        });
    }
    findShowsOnTheaterByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const date = req.query.date;
            const apiRes = yield this._showUseCase.findShowsOnTheater(theaterId, date, 'User');
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To add a new show
    addShow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showReqs = req.body;
            const apiRes = yield this._showUseCase.addShow(showReqs);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getShowDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const showId = req.params.showId;
            const apiRes = yield this._showUseCase.getShowDetails(showId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.ShowController = ShowController;
