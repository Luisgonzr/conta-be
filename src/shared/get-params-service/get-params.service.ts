import { Injectable } from '@nestjs/common';

export enum orderType {
  DESC = 'desc',
  ASC = 'asc',
}

export interface GetParams {
  page?: number;
  perpage?: number;
  orderBy?: string;
  orderType?: orderType;
}

@Injectable()
export class GetParamsService {
  maxPerPage = 100;
  constructor() {}
  getStandardParams(query: GetParams, count: number, maxPerPage?: number) {
    let perPage = query.perpage || 5;
    if (typeof maxPerPage !== 'undefined') this.maxPerPage = maxPerPage;
    if (perPage > this.maxPerPage) perPage = this.maxPerPage;
    const currentPage = query.page || 1;
    const pages = Math.ceil((count / perPage) * 1);
    const skip = (currentPage - 1) * perPage;
    const take = perPage * 1;
    const order = this.buildOrderBy(query.orderBy, query.orderType);
    return {
      pages,
      skip,
      take,
      currentPage,
      order,
    };
  }

  private buildOrderBy(orderBy: string = null, orderTypeData: string = null) {
    const tobeOrderType = orderTypeData || 'desc';
    const tobeOrderBy = orderBy || 'createdAt';
    return {
      orderBy: tobeOrderBy,
      orderType: tobeOrderType.toLocaleLowerCase(),
    };
  }
}
