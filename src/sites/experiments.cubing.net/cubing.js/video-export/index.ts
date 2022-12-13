import { JSZip } from "../twizzle-diaries/intro/jszip-wrapper";
import { TwistyPlayer } from "../../../../cubing/twisty";
(async () => {
  
  const player = new TwistyPlayer({
    alg: "R U R' U'",
  });
  document.body.appendChild(player);
  
  const FPS = 30;
  
  // Step 1: Collect all of the frames.
  console.log("Collecting frames...")

  const frames: string[] = [];
  const { end } = await player.experimentalModel.timeRange.get();

  for (let t = 0; t < end; t += 1000 / FPS) {
    player.timestamp = t;
    frames.push(await player.experimentalScreenshot());
  }

  // Step 2: Create a zipfile from all the frames using JSZip.
  console.log("Creating zipfile...")

  const zip = new JSZip();
  for (let i = 0; i < frames.length; i++) {
    console.log("frame", i, "of", frames.length)

    const idx = frames[i].indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
    const content = frames[i].substring(idx);

    zip.file(`frame-${i}.png`, content, { base64: true });
  }

  // Step 3: Download the zipfile.
  console.log("Downloading zipfile...")
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = "twisty.zip";
  a.click();
})()