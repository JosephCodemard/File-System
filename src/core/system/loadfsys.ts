// Creates an fsys directory from a real directory

import * as fs from "fs"

import { fsys } from "./interfaces"
import { GetPathCombinations } from "../utils/utils";


export function LoadFsys(dir, dirs:fsys[] = [], exclude:string[], debug = false){

    var files = fs.readdirSync(dir);

    for (var f of files){
        if (f[0] != '.'){
            var filePath = `${dir}/${f}`;
            var stat = fs.statSync(filePath);

            if (stat.isDirectory()){
                LoadFsys(filePath, dirs, exclude, debug);
            }else{

                if(!filePath.split("/").some(r=> exclude.indexOf(r) >= 0)){

                    if(debug){ console.log(`    [INFO] Pushing file ${f}`) }
                    const content = fs.readFileSync(filePath, {encoding:'utf8', flag:'r'});

                    dirs.push({
                        name: f,
                        path: filePath,
                        type: "file",
                        content: content
                    });
                }
            }
        }
    }

    return dirs
}