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
  describe('limit', () => {
    it('gets parsed as an integer when integer-compatible string', () => {
      expect(build({limit:"1234"}).limit).toEqual(1234);
    });
    it('gets ignored when not an integer or integer-compatible string', () => {
      expect(build({limit:"abcd"}).limit).toEqual(defaults.limit);
    });
    it('gets ignored when null', () => {
      expect(build({limit:null}).limit).toEqual(defaults.limit);
    });
    it('gets ignored when undefined', () => {
      expect(build().limit).toEqual(defaults.limit);
    });
  });
  describe('offset', () => {
    it('gets parsed as an integer when integer-compatible string', () => {
      expect(build({offset:"1234"}).offset).toEqual(1234);
    });
    it('gets ignored when not an integer or integer-compatible string', () => {
      expect(build({offset:"abcd"}).offset).toEqual(defaults.offset);
    });
    it('gets ignored when null', () => {
      expect(build({offset:null}).offset).toEqual(defaults.offset);
    });
    it('gets ignored when undefined', () => {
      expect(build().offset).toEqual(defaults.offset);
    });
  });
  describe('latitude', () => {
    it('gets parsed as a float when float-compatible string', () => {
      expect(build({latitude:"12.34"}).latitude).toEqual(12.34);
    });
    it('gets ignored when not a float or float-compatible string', () => {
      expect(build({latitude:"abcd"}).latitude).toEqual(defaults.latitude);
    });
    it('gets ignored when null', () => {
      expect(build({latitude:null}).latitude).toEqual(defaults.latitude);
    });
    it('gets ignored when undefined', () => {
      expect(build().latitude).toEqual(defaults.latitude);
    });
  });
  describe('longitude', () => {
    it('gets parsed as a float when float-compatible string', () => {
      expect(build({longitude:"12.34"}).longitude).toEqual(12.34);
    });
    it('gets ignored when not a float or float-compatible string', () => {
      expect(build({longitude:"abcd"}).longitude).toEqual(defaults.longitude);
    });
    it('gets ignored when null', () => {
      expect(build({longitude:null}).longitude).toEqual(defaults.longitude);
    });
    it('gets ignored when undefined', () => {
      expect(build().longitude).toEqual(defaults.longitude);
    });
  });
  describe('includeDeactivated', () => {
    it('gets parsed as true when "1" string', () => {
      expect(build({includeDeactivated:"1"}).includeDeactivated).toEqual(true);
    });
    it('gets parsed as false when "0" string', () => {
      expect(build({includeDeactivated:"0"}).includeDeactivated).toEqual(false);
    });
    it('gets parsed as true when "true" string', () => {
      const built = build({includeDeactivated:"true"});
      expect(built.includeDeactivated).toEqual(true);
    });
    it('gets ignored when null', () => {
      expect(build({includeDeactivated:null}).includeDeactivated).toEqual(defaults.includeDeactivated);
    });
    it('gets ignored when undefined', () => {
      expect(build().includeDeactivated).toEqual(defaults.includeDeactivated);
    });
  });
});