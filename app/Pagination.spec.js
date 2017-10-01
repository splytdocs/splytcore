const Pagination = require("./Pagination");
const buildPaginationResponse = Pagination.buildPaginationResponse;
const mutatePaginationResponseOnto = Pagination.mutatePaginationResponseOnto;
describe('buildPaginationResponse', () => {
  it('it should return {pagination:{numberOfPages:10, totalCount:200}}', () => {
    const results = buildPaginationResponse({numberOfPages: 10, totalCount: 200});
    expect(results).toEqual({
      pagination:{numberOfPages: 10, totalCount: 200}
    });
  });
});
describe('mutatePaginationResponseOnto', () => {
  it('it should mutate {pagination:{numberOfPages:10, totalCount:200}} onto a target object', () => {
    const target = {something:"abc"};
    const output = mutatePaginationResponseOnto(target, {numberOfPages: 10, totalCount: 200});
    expect(target).toEqual({
      something:"abc",
      pagination:{numberOfPages: 10, totalCount: 200}
    });
    expect(target).toBe(output);
  });
});