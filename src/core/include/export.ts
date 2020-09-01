// IMPORTS
import { hexDecode, hexEncode, binaryEncode, binaryDecode } from "../utils/convert"
import { Encryptor } from "../system/encrypt";

import { LoadFsys } from "../system/loadfsys"
import { DumpFsys } from "../system/dumpfsys"

import { fsys } from "../system/interfaces";

import * as fs from "fs"
import { GetPathCombinations } from "../utils/utils";


// INTERFACES
export enum Format{
    "HEX"="hexadecimal",
    "BIN"="binary",
    "PLAIN"="plain"
}

export interface configuration{
    encrypt?:boolean;
    format?:Format;
    debug?:boolean;
}


// DEFAULT CONFIGURATION
const DEFAULTCONFIG:configuration = {
    encrypt:true,
    format: Format.HEX,
    debug:false
}


export class FileSystem{

    private config:configuration;

    private encryptor:Encryptor;

    private DATA:fsys[];

    /**
     * File System
     * @param  {configuration} config  The configuration for the function 
     */
    constructor(_config:configuration = DEFAULTCONFIG){
        this.config = _config;
        this.encryptor = new Encryptor(_config['debug']);
    }

    /**
     * [File System] - SetEncryptorKey
     * @param  {string} key sets the encryptor key 
    */
    SetEncryptorKey(key){
        this.encryptor.setKey(key);
    }
    /**
     * [File System] - LoadEncryptorKey
     * @param  {string} filepath sets the encryptor key to the file data
     * @returns {string} returns the key 
    */
    LoadEncryptorKey(filepath){
        this.encryptor.setKey(fs.readFileSync(filepath));
        return this.encryptor.getKey();
    }
    /**
     * [File System] - GetEncryptorKey
     * @returns  {string} returns the key
    */
    GetEncryptorKey(){
        return this.encryptor.getKey()
    }
    /**
     * [File System] - DumpEncryptorKey
     * @param  {string} filepath dumps the key into filepath
    */
    DumpEncryptorKey(filepath:string){
        try{

            GetPathCombinations(filepath, process.cwd()).forEach(p => {
                if (!fs.existsSync(p)){
                    if(this.config['debug']){ console.log(`[INFO] Creating dir ${p}`) }
                    fs.mkdirSync(p);
                }
            });

            fs.writeFileSync(filepath + "/encryptor.key", this.GetEncryptorKey(), {flag: "w"});
        }catch{
            console.log(`[ERROR]  An unexpected error occured when writing file "${filepath + "encryptor.key"}"`)
        }
    }


    /**
     * [File System] - GetData
     * @returns  {fsys} returns the file system data (.fsys)
    */
    GetData(){
        return this.DATA;
    }

    /**
     * [File System] - SetData
     * @param  {fsys} data sets file system data (.fsys)
    */
    SetData(data:fsys[]){
        this.DATA = data;
    }   


    /**
     * [File System] - Create Snapshot - Stores all the data from the filepath
     * @param  {string} filepath  The path from which the snapshot will be taken 
     * @param {Array<string>} exclude Excludes these directories
     * @returns {fsys} returns the snapshot
     */
    CreateSnapshot(filepath:string, exclude:string[] = []){
        if(this.config['debug']){ console.log("[TASK] Load Snapshot") }
        this.DATA = LoadFsys(filepath, [], exclude,this.config['debug']);
        return this.DATA;
    }   

    /**
     * [File System] - Dump Snapshot - Recreates the snapshot in filepath
     * @param  {string} filepath  The path from which the snapshot will be dumped 
    */
    DumpSnapshot(filepath:string){
        if(this.config['debug']){ console.log("\n[TASK] Dump Snapshot") }
        DumpFsys(filepath, this.DATA, this.config['debug']);
    }

    /**
     * [File System] - Save Snapshot - Loads the snapshot file (.fsys)
     * @param  {string} filepath  The path of the file
     * @param  {configuration} config  The configuration (default)
     * @returns {fsys}  The file in an fsys[] format
    */
    LoadSnapshot(filepath, _config=this.config){
        if(this.config['debug']){ console.log("[TASK] Load File") }

        var data:any = fs.readFileSync(filepath, {encoding: "utf-8"}).toString();

        if(_config['format'] == Format.HEX){
            data = hexDecode( data, this.config.debug );
        }
        if(_config['format'] == Format.BIN){
            data = binaryDecode( data,  );
        }

        if(_config['encrypt'] == true){
            data = this.encryptor.decrypt( data, this.config.debug );
        }

        this.DATA = JSON.parse( data );

        return this.DATA;
    }

    /**
     * [File System] - Save Snapshot - Saves the snapshot file [.fsys]
     * @param  {string} filepath  The path of the file
     * @param  {configuration} config  The configuration (default)
    */
    SaveSnapshot(filepath, _config=this.config){
        if(this.config['debug']){ console.log("\n[TASK] Dump File") }

        var data:any = JSON.stringify( this.DATA );

        if(_config['encrypt'] == true){
            data = this.encryptor.encrypt(data).encryptedData;
        }
        if(_config['format'] == Format.HEX){
            data = hexEncode( data, this.config.debug );
        }
        if(_config['format'] == Format.BIN){
            data = binaryEncode( data, this.config.debug );
        }

        try{        

            GetPathCombinations(filepath, process.cwd()).forEach(p => {
                if (!fs.existsSync(p)){
                    if(this.config['debug']){ console.log(`\n[INFO] Creating dir ${p}`) }
                    fs.mkdirSync(p);
                }
            });

            fs.writeFileSync(filepath + "/snapshot.fsys", data, {flag: "w"});
        }catch{
            console.log(`[ERROR]  An unexpected error occured when writing file "${filepath + "snapshot.fsys"}"`)
        }
    }

    /**
     * [File System] - Terminate
    */
    Terminate(){
        if(this.config.debug){
            console.log("[COMPLETE]");
        }
    }
}