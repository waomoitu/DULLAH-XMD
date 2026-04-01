const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(__dirname, '../tmp', +new Date() + '.' + ext);
      let out = tmp + '.' + ext2;
      await fs.promises.writeFile(tmp, buffer);
      spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
        .on('error', reject)
        .on('close', async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code !== 0) return reject(code);
            resolve({
              data: await fs.promises.readFile(out),
              filename: out,
              delete() {
                return fs.promises.unlink(out);
              }
            });
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Converts Video to Audio (MP3)
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension 
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, ['-vn', '-c:a', 'libmp3lame', '-b:a', '192k'], ext, 'mp3');
}

/**
 * Converts Audio to Video (If Possible)
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-loop', '1',
    '-i', path.join(__dirname, '../Media/Images/Xploader5.jpg'), // Default image for audio-to-video
    '-i', '-',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ab', '192k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow',
    '-tune', 'stillimage',
    '-shortest'
  ], ext, 'mp4');
}

/**
 * Converts MP3 to WhatsApp-compatible Voice Note (PTT)
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'ogg');
}

function toMp4(buffer, ext) {
  return ffmpeg(buffer, [
    '-i', 'pipe:0', 
    '-filter_complex', 
    "[0:a]showspectrum=mode=separate:slide=1:scale=log:color=rainbow:legend=0:s=1280x720[v]",
    '-map', '[v]',  
    '-map', '0:a', 
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-pix_fmt', 'yuv420p',
    '-shortest'  
  ], ext, 'mp4');
}

module.exports = {
  toAudio,
  toVideo,
  toPTT,
  toMp4,
  ffmpeg
};
