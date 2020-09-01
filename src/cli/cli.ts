//IMPORTS
import { program } from "commander"
import { readFileSync, existsSync, writeFileSync } from "fs"
import { load } from "js-yaml"
import { performance } from "perf_hooks"
import { round } from "lodash"

import { FileSystem, Format } from "../../src/core/include/filesystem"

/* 
options:
    create snapshot
    include
    dump snapshot
    log

    debug
    format
    encryption
*/


program.version('1.0.0');

program
	.option('-d, --debug', 'show debuging')
    .option('-f, --format <string>', 'the type of format "hexadecimal", "binary", "plain"')
    .option('-e, --encrypt', 'encrypt the data')
    
    .option('-l, --log', 'log the output')
    
    .option('--exclude <array>', 'files that are excluded')
    .option('-p, --project <filename>', 'config file (.json|.yaml)')
    
	.option('-c, --createSnapshot <filename>', 'create a snapshot from a directory')
    .option('-l, --loadSnapshot <filename>', 'loads a snapshot (.fsys)')
    .option('-s, --saveSnapshot <filename>', 'saves a snapshot (.fsys)')
    .option('-d, --dumpSnapshot <filename>', 'dumps a snapshot at a directory');


const START_TIME = performance.now()
program.parse(process.argv);

var obj = {}


if(program.project !== undefined)
{
	obj = UseConfigFile(program.project);
}

else
{
	obj['debug'] = program.debug;			
	obj['format'] = program.format;		
    obj['encrypt'] = program.encrypt;	
    		
    obj['log'] = program.log;	
    	
	obj['exclude'] = program.exclude;
	obj['create_snap'] = program.createSnapshot;
	obj['load_snap'] = program.loadSnapshot;
	obj['save_snap'] = program.saveSnapshot;
    obj['dump_snap'] = program.dumpSnapshot;
}
console.log("\n		> FILE SYSTEM [CLI] <		\n");
runcli(obj);

function output(out){
	if(obj['debug']){
		console.log("			", out);
	}
}

function runcli(obj:any){
	
	const fsys = new FileSystem({
        debug:      obj['debug'] || false,
        encrypt:    obj['encrypt'] || false,
        format:     obj['format'] || Format.HEX
    });

    if(!obj['exclude']){ obj['exclude'] = [] }

    if(obj['create_snap']){
        fsys.CreateSnapshot(obj['create_snap'], obj['exclude']);
    }
    if(obj['load_snap']){
        fsys.LoadSnapshot(obj['load_snap']);
    }


    if(obj['dump_snap']){
        fsys.DumpSnapshot(obj['dump_snap']);
    }
    if(obj['save_snap']){
        fsys.SaveSnapshot(obj['save_snap']);
    }

    fsys.Terminate();
    
	const END_TIME = performance.now();
	output(`\n		>       COMPLETE       <		( ${round(END_TIME - START_TIME, 3)}secs )\n`);
}


function UseConfigFile(filename:string){
    if(existsSync(filename)){
		console.log(`[INFO] using ${filename} as a config file`);
		
        if(filename.split(".")[filename.split(".").length - 1] === "json"){
			output("- Using '.json' extention");
			return JSON.parse(readFileSync(filename, {encoding: 'utf-8'}));
		}

		else if (filename.split(".")[filename.split(".").length - 1] === "yaml" || filename.split(".")[-1] === "yml"){
			output("- Using '.yaml' extention");
			return load(readFileSync(filename, {encoding: 'utf-8'}));
		}
		else{
			console.log(`[ERROR]  ".${filename.split(".")[filename.split(".").length - 1]}"is an incompatable file extention`);
		}
		
    }else{
      	console.log(`[ERROR] ${filename} does not exist`);
    }
}
