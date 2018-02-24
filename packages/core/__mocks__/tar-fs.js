const tar = jest.genMockFromModule("tar-fs");

tar.pack = jest.fn(() => "PackVal");

export default tar;
