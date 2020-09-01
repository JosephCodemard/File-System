import * as crypto from "crypto"


export class Encryptor{

    private algorithm;
    private key;
    private iv;
    private debug:boolean;

    constructor(debug=false, alog:string = 'aes-256-cbc', key = crypto.randomBytes(32), iv = crypto.randomBytes(16)){
        this.algorithm = alog;
        this.key = key;
        this.iv = iv;
        this.debug = debug
    }

    getKey(){
        return this.key;
    }
    getIv(){
        return this.iv;
    }

    setKey(key){
        this.key = key;
    }

    setIv(iv){
        this.iv = iv;
    }

    encrypt(text, debug=this.debug) {

        if(debug){ console.log(`    [INFO] Encrypting data...`) }

        let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    }

    decrypt(text, debug = this.debug) {

        if(debug){ console.log(`    [INFO] Decrypting data...`) }

        let iv = Buffer.from(this.iv, 'hex');
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

}