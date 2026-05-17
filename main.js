const { core, event, utils, console } = iina;

const CANDIDATE_PATHS = [
  "/opt/homebrew/bin/nightlight",
  "/usr/local/bin/nightlight",
];

let cachedBinary = undefined;
let savedState = null;
let warnedMissing = false;

function resolveBinary() {
  if (cachedBinary !== undefined) return cachedBinary;
  for (const p of CANDIDATE_PATHS) {
    if (utils.fileInPath(p)) return (cachedBinary = p);
  }
  if (utils.fileInPath("nightlight")) return (cachedBinary = "nightlight");
  cachedBinary = null;
  if (!warnedMissing) {
    warnedMissing = true;
    const msg = "Night Shift FS: `nightlight` not found. Install with: brew install smudge/smudge/nightlight";
    console.error(msg);
    core.osd(msg);
  }
  return null;
}

async function run(args) {
  const bin = resolveBinary();
  if (!bin) return null;
  try {
    const { status, stdout, stderr } = await utils.exec(bin, args);
    if (status !== 0) {
      console.error(`nightlight ${args.join(" ")} failed (${status}): ${stderr}`);
      return null;
    }
    return stdout.trim();
  } catch (e) {
    console.error(`nightlight exec error: ${e}`);
    return null;
  }
}

event.on("iina.window-fs.changed", async (isFullscreen) => {
  if (isFullscreen) {
    const status = await run(["status"]);
    if (status === null) return;
    savedState = /on/i.test(status) ? "on" : "off";
    if (savedState === "on") {
      await run(["off"]);
      console.log("Night Shift disabled for fullscreen");
    }
  } else {
    if (savedState === "on") {
      await run(["on"]);
      console.log("Night Shift restored");
    }
    savedState = null;
  }
});
