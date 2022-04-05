import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class SearchService {
  private _index = 'random';
  constructor(private readonly elasticsearchService: ElasticsearchService) {
    this._index = process.env.ELASTIC_SEARCH_INDEX;
    this.createIndex();
  }

  //* ensure index be created if not exists
  async createIndex() {
    const checkIndex = await this.elasticsearchService.indices.exists({
      index: this._index,
    });
    if (!checkIndex)
      await this.elasticsearchService.indices.create({
        index: this._index,
      });
  }

  async index<T>(doc: T) {
    return this.elasticsearchService.index<T>({
      index: this._index,
      body: doc,
    });
  }

  async search<R>(text: string, fields: string[]) {
    const result = await this.elasticsearchService.search<R>({
      index: this._index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields,
            fuzziness: 'AUTO',
          },
        },
      },
    });
    return result.hits.hits.map((item) => item._source);
  }
}
