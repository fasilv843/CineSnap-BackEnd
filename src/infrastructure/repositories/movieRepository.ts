import { movieModel } from "../../entities/models/movieModel";
import { IMovieRepo } from "../../interfaces/repos/movieRepo";
import { IMovie } from "../../interfaces/schema/movieSchema";




export class MovieRepository implements IMovieRepo {

    async saveMovieDetails(movie: IMovie): Promise<IMovie> {
        try {
            console.log(movie.original_title);
            
            return await new movieModel(movie).save()
        } catch (error) {
            console.log('Error while saving movie details');
            console.log(error); 
            throw new Error('Failed to save movie details');
        }
    }

    async findAllMovies(): Promise<IMovie[]> {
        return await movieModel.find({isDeleted: false})
    }

    async findMovieByTmdbId(id: number): Promise<IMovie | null> {
        return await movieModel.findOne({tmdbId: id})
    }

    async findMovieByLanguage(lang: string): Promise<IMovie[]> {
        return await movieModel.find({language: lang}).hint({ language: 1 });
    }

    async findMovieByGenre(genreId: number): Promise<IMovie[]> {
        return await movieModel.find({ genre_ids: { $in: [genreId] } }).hint({ genre_ids: 1 });
    }

    async findMovieByTitle(title: string): Promise<IMovie[]> {
        return await movieModel.find({ $text: { $search: title } });
    }

    async findMovieById(id: string): Promise<IMovie | null> {
        return await movieModel.findById({_id: id})
    }
    
    async findUpcomingMovies(): Promise<IMovie[]> {
        return await movieModel.find({ release_date: { $gt: new Date()}})
    }

    async deleteMovie(id: string): Promise<void | null> {
        return await movieModel.findByIdAndUpdate({_id: id},{ isDeleted: true })
    }

}