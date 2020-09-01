export function RemoveOverlapingPaths(path1, path2){
    var big_arr = path2;  
    var newpath = ""
    if(path1 > path2){
        big_arr = path1;
    }

    for (let i = 0; i < big_arr.length; i++) {
        if(path1[i] !== path2[i]){
            newpath += big_arr[i];
        }
    }

    return newpath;
}

export function GetPathCombinations(path, basepath){
    const pathsarr = path.split("\\");
    var paths = [];

    basepath = basepath.replace(/\\/g, "/")

    for (let i = 0; i < pathsarr.length + 1; i++) {
        var _str = ""
        pathsarr.slice(0,i).forEach(p => { _str += (p + "/") });
        if(!basepath.includes(_str)){
            paths.push(_str);
        }
    }
    return paths;
}