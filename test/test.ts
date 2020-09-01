import { FileSystem, Format } from "../src/core/include/filesystem"

const fsys = new FileSystem({
    debug:true,
    encrypt:true,
    format: Format.HEX
});

fsys.LoadSnapshot("./src/core", ["include"]);

fsys.DumpFile("./test/snapshots");

var f = fsys.LoadFile("./test/snapshots/snapshot.fsys")

var out = [];
f.forEach(e => out.push({name: e.name, path: e.path, type:e.type, content: "..."}));
console.log(out);