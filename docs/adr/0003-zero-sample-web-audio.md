# 0003 — Zero-sample Web Audio synthesis

- Status: Accepted
- Date: 2026-10-23

## Context

The instrument needs two sounds: a tanpura drone that can hold a room for a practice session, and a tabla theka that marks sam and khali without pretending to be a recording. The project constraints are unusual for a music app: no audio samples, no API keys, and no server-side audio rendering. The landing page promises "No samples. No keys. Just oscillators and a very old idea."

Samples would mean licensing or recording sessions, a payload of several megabytes, and a dependency on playback that is hard to test. They would also fix the tonic: a tanpura tuned to C would need repitching or a separate set for every Sa. The atlas lets the listener choose a Sa that fits their voice, so the drone has to be generated relative to that choice.

Browsers also block audible autoplay. Any design that starts a drone on page load will either be silently suspended or produce a console warning and a broken first impression.

## Decision

Synthesise both instruments in the browser with the Web Audio API, and treat audio as an explicit, gesture-gated choice.

For the tanpura, `pluckPartials` generates a slightly inharmonic plucked-string spectrum. Partial `n` has ratio `n * sqrt(1 + 0.00008 * n * n)`, gain `1 / n^1.15`, and decay `3.4 / n^0.55`. The function keeps partials below 12 kHz and normalises their gains. `tanpuraHz` returns the Pa, Sa, and upper Sa frequencies for a chosen tonic. `adsr` produces a shared envelope shape for the drone and pluck voices. The browser turns this data into oscillators and gain nodes; the maths stays pure and unit-testable.

For the tabla, `tablaSpec` maps each bol to a membrane description: fundamental pitch, pitch drop, glide time, noise amount, duration, and brightness. The browser uses those values to shape a short pitched body plus noise. The theka itself comes from `packages/core/src/taal.ts`, so the audio follows the same matras, vibhags, sam, and khali as the visual cycle.

Audio policy:
- No `AudioContext` is created on page load. The first context is created or resumed inside a user gesture.
- Sound is muted by default. The interface says so before the first click: "Sound stays off until you ask for it."
- Muting ramps the master gain to zero instead of tearing down the graph, so unmuting is immediate and does not restart the drone.
- Stopping suspends the context; a later gesture can resume it.
- `prefers-reduced-motion` stops the meter and mandala animation but does not silently change or disable audio. Audio remains an explicit choice.

## Consequences

### Positive

- The audio payload is code, not media. There are no sample files to license, host, cache, or version.
- The drone follows the listener's Sa. `tanpuraHz` and `noteToHz` make transposition a parameter rather than a new asset.
- The spectrum, tuning, and tabla-spec functions are pure and covered by `packages/core/tests/taal-audio.test.ts`, so tuning changes can be reviewed without listening to every build. The `adsr` helper follows the same pure-data shape.
- Autoplay policy is respected by construction. The first sound is always the result of a gesture.
- Mute-by-default is honest about the instrument's intrusion into a room, and it gives screen-reader and keyboard users a predictable starting state.

### Negative

- Synthetic plucks and membranes are recognisably synthetic. They can suggest a tanpura and a tabla, but they do not replace the timbre of a real instrument.
- Additive synthesis costs CPU, especially with several partials and a long drone. Low-end mobile devices may need a reduced partial count or a lower sample rate.
- Browser audio implementations differ in scheduling accuracy, gain ramps, and context suspension behaviour. Cross-browser testing is a real maintenance cost.
- The code cannot reproduce room sound, string-body resonance, or the sympathetic strings of a real tanpura without additional convolution or modelling.
- Mute-by-default means some first-time listeners may think the instrument is broken if they miss the prompt. The UI has to make the start control unmistakable.

## Alternatives considered

- **Recorded sample packs**: the most realistic result, but licensing, payload, tonic flexibility, and offline caching all become harder.
- **Tone.js with samples**: faster to build, but still sample-based and adds a large dependency over the small set of primitives the project actually needs.
- **Server-rendered or pre-rendered audio files**: solves browser synthesis differences, but creates storage, cache, and tuning variants, and breaks the no-server-audio constraint.
- **Web MIDI or external instrument**: good for practised musicians, but excludes the listener who arrives with only a browser and no hardware.
- **Start the drone on load with a visual mute button**: fewer clicks, but violates autoplay expectations and the project's mute-by-default rule.
