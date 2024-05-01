import { IPaginationLinks, IPaginationMeta, ObjectLiteral } from './interfaces';

export class Pagination<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
  /**
   * associated links
   */
  public readonly links?: IPaginationLinks;

  /**
   * associated meta information (e.g., counts)
   */
  public readonly meta: T;

  /**
   * a list of items to be returned
   */
  public readonly items: PaginationObject[];

  constructor(items: PaginationObject[], meta: T, links?: IPaginationLinks) {
    this.links = links;
    this.meta = meta;
    this.items = items;
  }
}
