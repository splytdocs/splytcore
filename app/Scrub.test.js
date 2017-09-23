const Scrub = require("./Scrub");
const deleteMongoFields = Scrub.deleteMongoFields;
const deleteSensitiveFields = Scrub.deleteSensitiveFields;

describe('deleteMongoFields', () => {
  it('should return reference to target', ()=>{
    const target = {"notamongofield":true};
    const output = deleteMongoFields(target);
    expect(output).toBe(target);
  });
  it('should remove _id from target', () => {
    const output = deleteMongoFields({_id:"whatever"});
    expect(output._id).not.toBeDefined();
  });
  
  it('should remove __v from target', () => {
    const output = deleteMongoFields({__v:"whatever"});
    expect(output.__v).not.toBeDefined();
  });
  
  it('should remove createdAt from target', () => {
    const output = deleteMongoFields({createdAt:"whatever"});
    expect(output.createdAt).not.toBeDefined();
  });
  it('should remove updatedAt from target', () => {
    const output = deleteMongoFields({updatedAt:"whatever"});
    expect(output.updatedAt).not.toBeDefined();
  });
});
describe('deleteSensitiveFields', () => {
  it('should return reference to target', ()=>{
    const target = {"notsensitive":true};
    const output = deleteSensitiveFields(target);
    expect(output).toBe(target);
  });
  it('should remove password field', () => {
    const target = {password:"abcd"}
    deleteSensitiveFields(target);
    expect(target.password).toBeUndefined();
  });
  it('should return null when given null param', () => {
    const output = deleteSensitiveFields(null);
    expect(output).toBe(null);
  });
  it('should return undefined when given undefined param', () => {
    const output = deleteSensitiveFields();
    expect(output).toBe(undefined);
  });
});