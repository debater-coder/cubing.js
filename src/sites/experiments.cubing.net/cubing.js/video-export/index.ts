import { TwistyPlayer } from "../../../../cubing/twisty";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// import { JSZip } from "../twizzle-diaries/intro/jszip-wrapper";

const leftpad = (n: number, width: number, z = "0") => {
  const s = n + "";
  return s.length >= width ? s : new Array(width - s.length + 1).join(z) + s;
};

(async () => {
  const player = new TwistyPlayer({
    alg: "R U R' U'",
    experimentalInitialHintFaceletsAnimation: "none",
  });
  document.body.appendChild(player);

  const FPS = 30;

  // Step 1: Collect all of the frames.
  console.log("Collecting frames...");

  const frames: string[] = [];
  const { end } = await player.experimentalModel.timeRange.get();

  for (let t = 0; t < end; t += 1000 / FPS) {
    player.timestamp = t;
    frames.push(await player.experimentalScreenshot());
  }

  // // Step 2: Create a zipfile from all the frames using JSZip.
  // console.log("Creating zipfile...");

  // const zip = new JSZip();
  // for (let i = 0; i < frames.length; i++) {
  //   console.log("frame", i + 1, "of", frames.length);

  //   const idx = frames[i].indexOf("base64,") + "base64,".length; // or = 28 if you're sure about the prefix
  //   const content = frames[i].substring(idx);

  //   zip.file(`frame-${leftpad(i + 1, 3)}.png`, content, { base64: true });
  // }

  // // Step 3: Download the zipfile.
  // console.log("Downloading zipfile...");
  // const content = await zip.generateAsync({ type: "blob" });
  // const url = URL.createObjectURL(content);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "twisty.zip";
  // a.click();

  // Step 2: Create a video from all the frames using ffmpeg.wasm.
  console.log("Creating video...");

  const ffmpeg = createFFmpeg({ log: true });
  console.log("- Loading ffmpeg...");
  await ffmpeg.load();

  console.log("- Loading data...");
  for (let i = 0; i < frames.length; i++) {
    ffmpeg.FS(
      "writeFile",
      `frame-${leftpad(i + 1, 3)}.png`,
      await fetchFile(frames[i]),
    );
  }

  console.log("- Starting transcoding...");
  await ffmpeg.run(
    "-r",
    "30",
    "-f",
    "image2",
    "-s",
    "1920x1080",
    "-i",
    "frame-%03d.png",
    "-vcodec",
    "libx264",
    "-crf",
    "25",
    "-pix_fmt",
    "yuv420p",
    "-vframes",
    "120",
    "twisty.mp4",
  );
  
  // Step 3: Download the video.
  console.log("Downloading video...");
  const data = ffmpeg.FS('readFile', 'twisty.mp4');
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
  a.download = "twisty.mp4";
  a.click();
})();
