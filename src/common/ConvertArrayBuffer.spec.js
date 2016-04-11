describe('ConvertArrayBuffer', () => {
  var expectArrayBuffer = [123 ,34 ,109 ,97 ,116 ,99 ,104 ,34 ,58 ,34 ,116 ,111 ,111 ,34 ,125];
  var expectJson = { match:'too' };

  it('array buffer to json', ()=> {
    var convertAry = json2ab(expectJson);
    expectArrayBuffer.forEach((v, i) => expect(convertAry[i]).toBe(v));
  });
  it('json to array buffer', ()=> {
    var expectAry = new Uint16Array(expectArrayBuffer.length);
    expectArrayBuffer.forEach((v, i) => expectAry[i] = v);

    expect(ab2json(expectAry)).toEqual(expectJson);
  });
});
