import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosSlugGenerator from 'mongoose-slug-generator';

import { MongoSharedModule } from 'src/mongo-shared/mongo-shared.module';
import { ElasticSearchModule } from 'src/elasticsearch/elasticsearch.module';
import { UsersModule } from 'src/users/users.module';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';

@Module({
  imports: [
    //* registering mongoose module for restaurants module
    //* use of forFeatureAsync gives the opportunity to register plugins
    MongooseModule.forFeatureAsync([
      {
        name: Restaurant.name,
        useFactory: () => {
          const schema = RestaurantSchema;
          schema.plugin(mongoosSlugGenerator);
          return schema;
        },
      },
    ]),
    //* QueriesModule has common funcionality for filtering and querying models
    MongoSharedModule,
    UsersModule,
    ElasticSearchModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
