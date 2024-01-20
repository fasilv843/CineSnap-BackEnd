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
exports.MovieController = void 0;
class MovieController {
    constructor(movieUseCase) {
        this.movieUseCase = movieUseCase;
    }
    getMovieDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            const apiRes = yield this.movieUseCase.findMovieById(movieId);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To get movies to show on user Home, focusing on latest released movies
    getBannerMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.movieUseCase.getBannerMovies();
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To get all non deleted movies from the database
    getMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = req.query.title;
            const page = req.query.page;
            const isAdmin = Boolean(req.query.isAdmin);
            const genreFilters = [];
            const langFilters = [];
            Object.keys(req.query).forEach((key) => {
                if (key.startsWith('g')) {
                    genreFilters.push(parseInt(req.query[key]));
                }
                else if (key.startsWith('l')) {
                    langFilters.push(req.query[key]);
                }
            });
            const availability = req.query.availability;
            let pageNum = 1;
            if (page)
                pageNum = parseInt(page);
            if (title) {
                const apiRes = yield this.movieUseCase.searchMovie(title, isAdmin);
                return res.status(apiRes.status).json(apiRes);
            }
            const apiRes = yield this.movieUseCase.findMoviesLazily(pageNum, genreFilters, langFilters, availability);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To add a movie to CineSnap from TMDB
    addMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = req.body.movie;
            console.log(movie, 'movie from controller');
            const apiRes = yield this.movieUseCase.saveMovie(movie);
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To delete/hide a movie from users and theaters
    deleteMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const movieId = req.params.movieId;
            const deleteRes = yield this.movieUseCase.deleteMovie(movieId);
            res.status(deleteRes.status).json();
        });
    }
    // to get tmdb ids of movies that stored in CineSnap - used only in admin side
    getCineSnapMovieIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.movieUseCase.getMovieIds();
            res.status(apiRes.status).json(apiRes);
        });
    }
    // To get the filter data, based on which data that we are filtering
    getFilters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiRes = yield this.movieUseCase.getFilters();
            res.status(apiRes.status).json(apiRes);
        });
    }
}
exports.MovieController = MovieController;
