const ListingSearchParameters = require("./ListingSearchParameters");
const build = ListingSearchParameters.build;
const defaults = ListingSearchParameters.defaults;
describe('defaults', () => {
  it('should equal expectations', () => {
    expect(defaults).toEqual({
      latitude:null,
      longitude:null,
      includeDeactivated: false,
      limit:20,
      offset:0
    });
  });
});
describe('build', () => {
  it('returns defaults when passed empty object', () => {
    expect(build({})).toEqual(defaults);
  });
  it('returns defaults when passed null object', () => {
    expect(build(null)).toEqual(defaults);
  });
  it('returns defaults when passed nothing', () => {
    expect(build()).toEqual(defaults);
  });
  it('overrides specified parameters', () => {
    const inputs = {
      limit:1234,
      includeDeactivated:true,
      latitude:98.76234874
    }
    const expected = Object.assign({}, defaults, inputs);
    const built = build(inputs);
    expect(built).toEqual(expected);
    // paranoia checks
    expect(built.limit).toEqual(1234);
    expect(built.longitude).toBeNull();
    expect(built.includeDeactivated).toEqual(true);
  });
});