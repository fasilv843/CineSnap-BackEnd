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
exports.ScreenController = void 0;
class ScreenController {
    constructor(screenUseCase) {
        this.screenUseCase = screenUseCase;
    }
    // To Save Screen data of theaters
    saveScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, rows, cols } = req.body;
            const theaterId = req.params.theaterId;
            const screen = { theaterId, name, rows, cols };
            const apiRes = yield this.screenUseCase.saveScreenDetails(screen);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // Finding screen data using id
    findScreenById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenId = req.params.screenId;
            const apiRes = yield this.screenUseCase.findScreenById(screenId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To find screens in a theater using theater id
    findScreensInTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const theaterId = req.params.theaterId;
            const apiRes = yield this.screenUseCase.findScreensInTheater(theaterId);
            // console.log(apiRes.data, 'screens that returned to client');
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To edit screen data of a theater
    updateScreenName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenName = req.body.screenName;
            const screenId = req.params.screenId;
            const apiRes = yield this.screenUseCase.updateScreenName(screenId, screenName);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To delete a screen from a theater
    deleteScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenId = req.params.screenId;
            const apiRes = yield this.screenUseCase.deleteScreen(screenId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    getAvailSeatsOnScreen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenId = req.params.screenId;
            const apiRes = yield this.screenUseCase.getAvailSeatsOnScreen(screenId);
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.ScreenController = ScreenController;
