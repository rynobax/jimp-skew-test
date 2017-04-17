const Jimp = require('C:\\Users\\Ryan\\Documents\\Code\\jimp');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const path = require('path');
const pngFileStream = require('png-file-stream');

const dir = './img/'
const files = fs.readdirSync(dir);

for (const file of files) {
    fs.unlinkSync(path.join(dir, file));
}

Jimp.read('./square.jpg', function (err, orig) {
    if (err) throw err;
    const imgPromises = [];
    for(let i=0; i<90; i=i+10){
        const img = orig.clone();
        const name = dir+"out_"+i+".png";
        imgPromises.push(new Promise((resolve, reject) => {
            img.skew(i, 0).write(name, (err, obj) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        }));
    }

    Promise.all(imgPromises).then((imgs) => {
        const encoder = new GIFEncoder(1024, 1024);
        pngFileStream('img/*.png')
            .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 10 }))
            .pipe(fs.createWriteStream('out.gif'));
    });
});