import { FileSystem, Format } from "../src/core/include/filesystem"

const fsys = new FileSystem({
    debug:true,
    encrypt:true,
    format: Format.HEX
});

fsys.CreateSnapshot("./src/core", ["include"]);

fsys.SaveSnapshot("./test/snapshots");

var f = fsys.LoadSnapshot("./test/snapshots/snapshot.fsys");

var out = [];
f.forEach(e => out.push({name: e.name, path: e.path, type:e.type, content: "..."}));
console.log(out);