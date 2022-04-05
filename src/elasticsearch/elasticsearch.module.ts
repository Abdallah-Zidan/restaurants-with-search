import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 ** this module abstracts common tasks with elasticsearch that
 ** can be used across the othe modules
 *! note: using envrironment variables directly for simplicity but configuration
 *! service is a better aproach to manage configurations
 */
@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTIC_SEARCH_NODE,
      maxRetries: 10,
      requestTimeout: 60000,
      pingTimeout: 60000,
      auth: {
        username: process.env.ELASTIC_SEARCH_USER,
        password: process.env.ELASTIC_SEARCH_PASS,
      },
      tls: {
        /**
         ** note: this is for simplicity running locally
         ** tls options should be carefully configured and meet
         ** the elasticsearch serverrequirements
         */
        rejectUnauthorized: false,
      },
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class ElasticSearchModule {}
