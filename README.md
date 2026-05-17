# Night Shift FS

An [IINA](https://iina.io/) plugin that **disables macOS Night Shift while the player is in fullscreen** and restores it when you leave fullscreen — similar to IINA's built-in "Black out other monitors while in full screen", but for color temperature.

## Why

Night Shift warms colors at night for reading comfort, but it muddies video. This plugin auto-pauses it for the duration of fullscreen playback, no manual toggling.

## Requirements

- macOS (Night Shift is macOS-only)
- [IINA](https://iina.io/) 1.3 or later
- [`nightlight`](https://github.com/smudge/nightlight) CLI — macOS has no public API for Night Shift, so the plugin shells out to this tool:

  ```sh
  brew install smudge/smudge/nightlight
  ```

## Install

**From GitHub (recommended)** — in IINA Settings → Plugins → *Install from GitHub…*, paste:

```
leo-mathurin/iina-nightshift-fs
```

**Manual / dev mode** — clone the repo, then symlink it into the plugins folder with the `.iinaplugin-dev` suffix:

```sh
git clone https://github.com/leo-mathurin/iina-nightshift-fs.git
ln -s "$PWD/iina-nightshift-fs" \
  "$HOME/Library/Application Support/com.colliderli.iina/plugins/me.leo.nightshift-fs.iinaplugin-dev"
```

Quit IINA fully (`Cmd+Q`) and relaunch — the plugin is scanned only at startup.

## How it works

The plugin listens to IINA's `iina.window-fs.changed` event. On entry it reads the current Night Shift state via `nightlight status`; if it was on, it runs `nightlight off` and remembers the previous state. On exit it runs `nightlight on` only if it had turned it off.

## Caveats

- Night Shift is a global macOS setting. With multiple IINA windows in fullscreen on multiple displays, the restoration may be incorrect.
- Toggle is binary — no gradual ramp.
- If `nightlight` is missing, the plugin shows a single OSD message and stays inert.

## License

MIT — see [LICENSE](LICENSE).
