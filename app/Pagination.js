module.exports.buildPaginationResponse = ({numberOfPages, totalCount})=>{
  return {
    pagination:{ numberOfPages, totalCount }
  }
};
module.exports.mutatePaginationResponseOnto = (target, {numberOfPages, totalCount})=>{
  target.pagination = this.buildPaginationResponse({numberOfPages, totalCount}).pagination;
  return target;
};