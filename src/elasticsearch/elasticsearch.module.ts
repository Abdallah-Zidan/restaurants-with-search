import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './serach.service';
import * as dotenv from 'dotenv';
dotenv.config();

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
        rejectUnauthorized: false,
      },
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class ElasticSearchModule {}
