const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const TMP_DIR = path.join(__dirname, '../tmp');

async function ensureTmpDir() {
await fs.promises.mkdir(TMP_DIR, { recursive: true });
}

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
return new Promise(async (resolve, reject) => {
let tmp;
let out;
let settled = false;

    const cleanup = async () => {
        for (const file of [tmp, out]) {
            if (!file) continue;

            try {
                await fs.promises.unlink(file);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error('[FFMPEG CLEANUP ERROR]', error.message);
                }
            }
        }
    };

    const fail = async (error) => {
        if (settled) return;

        settled = true;
        await cleanup();
        reject(error);
    };

    try {
        if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
            throw new Error('FFmpeg received an empty or invalid buffer.');
        }

        if (!ffmpegPath) {
            throw new Error(
                'ffmpeg-static executable was not found. Check Heroku dependencies.'
            );
        }

        await ensureTmpDir();

        const id = `${Date.now()}-${process.pid}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

        // Input na output zinatumia majina tofauti.
        tmp = path.join(TMP_DIR, `input-${id}.${ext || 'bin'}`);
        out = path.join(TMP_DIR, `output-${id}.${ext2 || 'bin'}`);

        await fs.promises.writeFile(tmp, buffer);

        const ff = spawn(
            ffmpegPath,
            ['-y', '-i', tmp, ...args, out],
            {
                stdio: ['ignore', 'ignore', 'pipe']
            }
        );

        let stderr = '';

        ff.stderr.on('data', (chunk) => {
            stderr += chunk.toString();

            if (stderr.length > 12000) {
                stderr = stderr.slice(-12000);
            }
        });

        ff.on('error', async (error) => {
            await fail(
                new Error(`Unable to start FFmpeg: ${error.message}`)
            );
        });

        ff.on('close', async (code) => {
            if (settled) return;

            if (code !== 0) {
                await fail(
                    new Error(
                        `FFmpeg exited with code ${code}.\n${stderr.slice(-4000)}`
                    )
                );
                return;
            }

            try {
                const data = await fs.promises.readFile(out);

                if (!data.length) {
                    throw new Error('FFmpeg produced an empty output file.');
                }

                settled = true;

                resolve({
                    data,
                    filename: out,

                    async delete() {
                        try {
                            await fs.promises.unlink(out);
                        } catch (error) {
                            if (error.code !== 'ENOENT') {
                                throw error;
                            }
                        }
                    }
                });
            } catch (error) {
                await fail(error);
            }
        });
    } catch (error) {
        await fail(error);
    }
});

}

/**

* Converts audio to MP3.
  */
  function toAudio(buffer, ext) {
  return ffmpeg(
  buffer,
  [
  '-vn',
  '-c:a', 'libmp3lame',
  '-b:a', '192k'
  ],
  ext,
  'mp3'
  );
  }

/**

* Converts audio to video using a static image.
  */
  function toVideo(buffer, ext) {
  return ffmpeg(
  buffer,
  [
  '-loop', '1',
  '-i', path.join(__dirname, '../Media/Images/Xploader5.jpg'),
  '-c:v', 'libx264',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', '44100',
  '-crf', '32',
  '-preset', 'slow',
  '-tune', 'stillimage',
  '-shortest'
  ],
  ext,
  'mp4'
  );
  }

/**

* Converts audio to WhatsApp-compatible voice note.
  */
  function toPTT(buffer, ext) {
  return ffmpeg(
  buffer,
  [
  '-vn',
  '-c:a', 'libopus',
  '-b:a', '128k',
  '-vbr', 'on',
  '-compression_level', '10'
  ],
  ext,
  'ogg'
  );
  }

/**

* Creates a spectrum video from audio.
  */
  function toMp4(buffer, ext) {
  return ffmpeg(
  buffer,
  [
  '-filter_complex',
  '[0:a]showspectrum=mode=separate:slide=1:scale=log:color=rainbow:legend=0:s=1280x720[v]',
  '-map', '[v]',
  '-map', '0:a',
  '-c:v', 'libx264',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', '44100',
  '-pix_fmt', 'yuv420p',
  '-shortest'
  ],
  ext,
  'mp4'
  );
  }

module.exports = {
toAudio,
toVideo,
toPTT,
toMp4,
ffmpeg
};