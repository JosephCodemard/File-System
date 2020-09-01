export function hexEncode(str, debug=false){

    if(debug){ console.log(`[INFO] Encoding hexadecimal...`) }

    var hex, i;

    var result = "";
    for (i=0; i< str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

export function hexDecode(str, debug=false){

    if(debug){ console.log(`[INFO] Decoding hexadecimal...`) }

    var j;
    var hexes = str.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}


export function binaryEncode(str, debug = false) {
    if(debug){ console.log(`[INFO] Encoding binary...`) }
    return Buffer.from(str).toString('base64');
}


export function binaryDecode(str, debug = false) {
    if(debug){ console.log(`[INFO] Decoding binary...`) }
    return Buffer.from(str, 'base64').toString();
};
