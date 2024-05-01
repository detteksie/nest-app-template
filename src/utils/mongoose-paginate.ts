import {
  IPaginationLinks,
  IPaginationMeta,
  IPaginationOptions,
  IPaginationOptionsRoutingLabels,
  ObjectLiteral,
  Pagination,
  TypeORMCacheType,
} from '@app/typeorm-paginate';
import mongoose from 'mongoose';

export async function mongoosePaginate<T, U>(
  query: mongoose.Query<T[], U>,
  options: IPaginationOptions,
) {
  const [page, limit, route, countQueries, cacheOption] = resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    query
      .clone()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec(),
    undefined,
  ];
  if (countQueries) {
    promises[1] = query.clone().countDocuments();
  }

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
    route,
    metaTransformer: options.metaTransformer,
    routingLabels: options.routingLabels,
  });
}

function resolveOptions(
  options: IPaginationOptions,
): [number, number, string, boolean, TypeORMCacheType] {
  const page = resolveNumericOption(options, 'page', 1);
  const limit = resolveNumericOption(options, 'limit', 10);
  const route = options.route;
  const countQueries = typeof options.countQueries !== 'undefined' ? options.countQueries : true;
  const cacheQueries = options.cacheQueries || false;

  return [page, limit, route, countQueries, cacheQueries];
}

function resolveNumericOption(
  options: IPaginationOptions,
  key: 'page' | 'limit',
  defaultValue: number,
): number {
  const value = options[key];
  const resolvedValue = Number(value);

  if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;

  console.warn(
    `Query parameter "${key}" with value "${value}" was resolved as "${resolvedValue}", please validate your query input! Falling back to default "${defaultValue}".`,
  );
  return defaultValue;
}

export function createPaginationObject<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>({
  items,
  totalItems,
  currentPage,
  limit,
  route,
  metaTransformer,
  routingLabels,
}: {
  items: T[];
  totalItems?: number;
  currentPage: number;
  limit: number;
  route?: string;
  metaTransformer?: (meta: IPaginationMeta) => CustomMetaType;
  routingLabels?: IPaginationOptionsRoutingLabels;
}): Pagination<T, CustomMetaType> {
  const totalPages = totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined;

  const hasFirstPage = route;
  const hasPreviousPage = route && currentPage > 1;
  const hasNextPage = route && totalItems !== undefined && currentPage < totalPages;
  const hasLastPage = route && totalItems !== undefined && totalPages > 0;

  const symbol = route && new RegExp(/\?/).test(route) ? '&' : '?';

  const limitLabel = routingLabels && routingLabels.limitLabel ? routingLabels.limitLabel : 'limit';

  const pageLabel = routingLabels && routingLabels.pageLabel ? routingLabels.pageLabel : 'page';

  const routes: IPaginationLinks =
    totalItems !== undefined
      ? {
          first: hasFirstPage ? `${route}${symbol}${limitLabel}=${limit}` : '',
          previous: hasPreviousPage
            ? `${route}${symbol}${pageLabel}=${currentPage - 1}&${limitLabel}=${limit}`
            : '',
          next: hasNextPage
            ? `${route}${symbol}${pageLabel}=${currentPage + 1}&${limitLabel}=${limit}`
            : '',
          last: hasLastPage
            ? `${route}${symbol}${pageLabel}=${totalPages}&${limitLabel}=${limit}`
            : '',
        }
      : undefined;

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage: currentPage,
  };

  const links = route ? routes : undefined;

  if (metaTransformer)
    return new Pagination<T, CustomMetaType>(items, metaTransformer(meta), links);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Pagination<T, CustomMetaType>(items, meta, links);
}
