import { Model } from 'mongoose';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RestaurantDto } from './dto/restaurant.dto';

import {
  dtoToRestaurant,
  restaurantsToCollectionDto,
} from './transformers/restaurant';
import { SearchRestaurantsQuery } from './dto/search.dto';
import { QueryService } from '../mongo-shared/query.service';
import { UsersService } from 'src/users/users.service';
import { SearchService } from 'src/elasticsearch/serach.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private queryService: QueryService,
    private userService: UsersService,
    private searchService: SearchService,
  ) {
    this.restaurantModel.ensureIndexes();
    this.queryService.setGeospatialAttributes(['location']);
  }

  async create(body: RestaurantDto) {
    const user = await this.findUserOrThrow(body.user);
    const restaurant = await this.restaurantModel.create(dtoToRestaurant(body));
    user.restaurants.push(restaurant);
    await user.save();

    /**
     ** indexing newly created restaurants into elasticsearch
     ** to be available for searching, however an a plugin or utility to sync
     ** documents from mongo to elastic search might be a better solution
     */
    await this.searchService.index<RestaurantDto>(body);
    return restaurant;
  }

  async find(id: string) {
    return await this.queryService.getByIdOrSlug(id, this.restaurantModel);
  }

  async all(query: SearchRestaurantsQuery) {
    query = this.queryService.buildQuery(query);
    return this.queryService.paginate(
      query,
      this.restaurantModel,
      restaurantsToCollectionDto,
    );
  }

  async fuzzySearch(text: string) {
    //* use search service to search in elastic search and specifying the fields
    //* that can be searched
    return this.searchService.search<Restaurant[]>(text, ['name', 'cuisine']);
  }

  //! this method throw a validation error in case user doesn't exist
  private async findUserOrThrow(id: string) {
    const user = await this.userService.find(id);
    if (!user) throw new UnprocessableEntityException(["user doesn't exist"]);
    return user;
  }
}
