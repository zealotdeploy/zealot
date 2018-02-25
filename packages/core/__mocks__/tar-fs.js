/* eslint-disable no-underscore-dangle */
const tar = jest.genMockFromModule("tar-fs");

export const __packReturnVal = "PackVal";

tar.pack = jest.fn(() => __packReturnVal);

export default tar;
