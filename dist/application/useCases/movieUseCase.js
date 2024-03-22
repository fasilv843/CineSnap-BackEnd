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
exports.MovieUseCase = void 0;
const console_1 = require("console");
const httpStatusCodes_1 = require("../../infrastructure/constants/httpStatusCodes");
const response_1 = require("../../infrastructure/helperFunctions/response");
class MovieUseCase {
    constructor(_movieRepository) {
        this._movieRepository = _movieRepository;
    }
    saveMovie(movieData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (movieData === undefined) {
                    return {
                        status: httpStatusCodes_1.STATUS_CODES.BAD_REQUEST,
                        message: 'Movie data did\'t recieved',
                        data: null
                    };
                }
                const movie = yield this._movieRepository.saveMovieDetails(movieData);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: movie
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findMoviesLazily(page, genreFilters, langFilters, availability) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(availability, 'availability from usecase');
                if (availability === undefined)
                    availability = 'Available';
                const movies = yield this._movieRepository.findMoviesLazily(page, genreFilters, langFilters, availability);
                return (0, response_1.get200Response)(movies);
            }
            catch (error) {
                (0, console_1.log)(error);
                return (0, response_1.get500Response)(error);
            }
        });
    }
    searchMovie(title, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movies = yield this._movieRepository.findMovieByTitle(title, isAdmin);
                return (0, response_1.get200Response)(movies);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findMovieByGenre(genreId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._movieRepository.findMovieByGenre(genreId);
        });
    }
    findMoviesByLanguage(lang) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._movieRepository.findMovieByLanguage(lang);
        });
    }
    findMovieById(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movie = yield this._movieRepository.findMovieById(movieId);
                if (movie !== null)
                    return (0, response_1.get200Response)(movie);
                else
                    return (0, response_1.getErrorResponse)(httpStatusCodes_1.STATUS_CODES.BAD_REQUEST);
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    findUpcomingMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._movieRepository.findUpcomingMovies();
        });
    }
    deleteMovie(movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._movieRepository.deleteMovie(movieId);
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: null
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getBannerMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const movies = yield this._movieRepository.findBannerMovies();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: movies
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getMovieIds() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ids = yield this._movieRepository.fetchTmdbMovieIds();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    data: ids
                };
            }
            catch (error) {
                return (0, response_1.get500Response)(error);
            }
        });
    }
    getFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { languages, genres } = yield this._movieRepository.getFilters();
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    message: 'Success',
                    genres,
                    languages
                };
            }
            catch (error) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: error.message,
                    genres: [],
                    languages: []
                };
            }
        });
    }
}
exports.MovieUseCase = MovieUseCase;
