[![CI](https://github.com/iamskok/use-font-face-observer/actions/workflows/ci.yml/badge.svg)](https://github.com/iamskok/use-font-face-observer/actions/workflows/ci.yml)

<h1 align="center">Font Face Observer React Hook 🪝</h1>

> [Font Face Observer](https://github.com/bramstein/fontfaceobserver) is a small
> `@font-face` loader and monitor compatible with any webfont service. It will
> monitor when a webfont is loaded and notify you. It does not limit you in any
> way in the where, when, or how you load your webfonts. Unlike the
> [Web Font Loader](https://github.com/typekit/webfontloader) Font Face Observer
> uses scroll events to detect font loads efficiently and with minimum overhead.

## Installation

```sh
yarn add use-font-face-observer
```

## Usage Examples

1. Detect when a single font face is loaded (condensed, italic, and bold
   Roboto):

```js
const isFontListLoaded = useFontFaceObserver([
  {
    font: `Roboto`,
    style: `italic`,
    weight: `bold`,
    stretch: `condensed`,
  },
]);
```

2. Detect when multiple font faces are loaded:

```js
const isFontListLoaded = useFontFaceObserver([
  { font: `Roboto` },
  { font: `Inter` },
]);
```

3. Extra options:

- Custom test string (When your font doesn't contain at least the Latin "BESbwy" characters you must
  pass a test string).
- Custom timeout (defaults to 3000ms)
- Show console errors (defaults to `false`)

```js
const isFontListLoaded = useFontFaceObserver(
  [{ font: `Roboto` }],
  {
    testString?: `ФЯЦ`
    timeout: 5000,
  },
  {
    showErrors: true,
  },
)
```
