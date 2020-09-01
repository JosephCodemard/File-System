// Creates a real directory from the fsys
import { fsys } from "./interfaces"
import { RemoveOverlapingPaths, GetPathCombinations } from "../utils/utils"

import * as fs from "fs"
import * as path from "path"



function CreateFile(basedir, commonpath, file:fsys, debug=false){

    basedir = path.join(process.cwd(),basedir);

    const relativefilepath = RemoveOverlapingPaths(commonpath, file.path);

    const _filepath = path.join(".\\", basedir, relativefilepath);

    const fullpath = _filepath.substring(0, _filepath.lastIndexOf("\\"));

    if(!file.content) { file.content = "" }

    GetPathCombinations(fullpath, process.cwd()).forEach(p => {
        if (!fs.existsSync(p)){
            if(debug){ console.log(`    [INFO] Creating dir ${p}`) }
            fs.mkdirSync(p);
        }
    });
    
    if(debug){ console.log(`    [INFO] Creating file ${file.name}`) }
    fs.writeFileSync(_filepath, file.content);
}


export function DumpFsys(path, obj:fsys[], debug=false){

    var paths:string[] = []

    obj.forEach(o => {
        paths.push(o.path);
    })

    const commonpath = CommonPath(paths);

    obj.forEach(file => {
        CreateFile(path, commonpath, file, debug);
    });
}


/*GET COMMON PATH*/
const splitStrings = (a, sep = '/') => a.map(i => i.split(sep));
const elAt = i => a => a[i];
const rotate = a => a[0].map((e, i) => a.map(elAt(i)));
const allElementsEqual = arr => arr.every(e => e === arr[0]);
const CommonPath = (input, sep = '/') => 
    rotate(splitStrings(input, sep))
        .filter(allElementsEqual)
        .map(elAt(0))
        .join(sep); 