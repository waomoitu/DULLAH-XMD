// file: lib/exif.js
const { tmpdir } = require('os');
const fs = require('fs');
const path = require('path');
const Crypto = require('crypto');
const webp = require('node-webpmux');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');

const ffmpeg = createFFmpeg({ log: true });

async function ensureFFmpegLoaded() {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();
}

async function imageToWebp(media) {
    await ensureFFmpegLoaded();
    const tmpName = 'input.jpg';
    ffmpeg.FS('writeFile', tmpName, await fetchFile(media));
    await ffmpeg.run(
        '-i', tmpName,
        '-vcodec', 'libwebp',
        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0',
        'output.webp'
    );
    const data = ffmpeg.FS('readFile', 'output.webp');
    return Buffer.from(data);
}

async function videoToWebp(media) {
    await ensureFFmpegLoaded();
    const tmpName = 'input.mp4';
    ffmpeg.FS('writeFile', tmpName, await fetchFile(media));
    await ffmpeg.run(
        '-i', tmpName,
        '-vcodec', 'libwebp',
        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white@0.0',
        '-loop', '0',
        '-t', '5',
        'output.webp'
    );
    const data = ffmpeg.FS('readFile', 'output.webp');
    return Buffer.from(data);
}

async function writeExifImg(media, metadata = {}) {
    const webpBuffer = await imageToWebp(media);
    const tmpFile = path.join(tmpdir(), `${Crypto.randomBytes(6).toString('hex')}.webp`);
    fs.writeFileSync(tmpFile, webpBuffer);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
            "sticker-pack-id": `https://github.com/mruniquehacker/Knightbot`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "emojis": metadata.categories || [""]
        };
        const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFile);
        fs.unlinkSync(tmpFile);
        img.exif = exif;
        await img.save(tmpFile);
    }

    return tmpFile;
}

async function writeExifVid(media, metadata = {}) {
    const webpBuffer = await videoToWebp(media);
    const tmpFile = path.join(tmpdir(), `${Crypto.randomBytes(6).toString('hex')}.webp`);
    fs.writeFileSync(tmpFile, webpBuffer);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
            "sticker-pack-id": `https://github.com/mruniquehacker/Knightbot`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "emojis": metadata.categories || [""]
        };
        const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFile);
        fs.unlinkSync(tmpFile);
        img.exif = exif;
        await img.save(tmpFile);
    }

    return tmpFile;
}

async function writeExif(media, metadata = {}) {
    let buffer;
    if (/webp/.test(media.mimetype)) buffer = media.data;
    else if (/image/.test(media.mimetype)) buffer = await imageToWebp(media.data);
    else if (/video/.test(media.mimetype)) buffer = await videoToWebp(media.data);
    else throw new Error('Unsupported media type');

    const tmpFile = path.join(tmpdir(), `${Crypto.randomBytes(6).toString('hex')}.webp`);
    fs.writeFileSync(tmpFile, buffer);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = {
            "sticker-pack-id": `https://github.com/mruniquehacker/Knightbot`,
            "sticker-pack-name": metadata.packname,
            "sticker-pack-publisher": metadata.author,
            "emojis": metadata.categories || [""]
        };
        const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);

        await img.load(tmpFile);
        fs.unlinkSync(tmpFile);
        img.exif = exif;
        await img.save(tmpFile);
    }

    return tmpFile;
}

module.exports = { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif };