# imagemin-optipng ![GitHub Actions Status](https://github.com/imagemin/imagemin-optipng/workflows/test/badge.svg?branch=main)

> Imagemin plugin for OptiPNG

## Install

```
$ npm install imagemin-optipng
```

## Usage

```js
import imagemin from 'imagemin';
import imageminOptipng from 'imagemin-optipng';

(async () => {
	await imagemin(['images/*.png'], {
		destination: 'build/images',
		plugins: [
			imageminOptipng()
		]
	});

	console.log('Images optimized!');
})();
```

## API

### imageminOptipng(options?)(buffer)

Returns a `Promise<Buffer>`.

#### options

Type: `object`

##### optimizationLevel

Type: `number`\
Default: `3`

Select an optimization level between `0` and `7`.

> The optimization level 0 enables a set of optimization operations that require minimal effort. There will be no changes to image attributes like bit depth or color type, and no recompression of existing IDAT datastreams. The optimization level 1 enables a single IDAT compression trial. The trial chosen is what. OptiPNG thinks it’s probably the most effective. The optimization levels 2 and higher enable multiple IDAT compression trials; the higher the level, the more trials.

Level and trials:

1. 1 trial
2. 8 trials
3. 16 trials
4. 24 trials
5. 48 trials
6. 120 trials
7. 240 trials

##### bitDepthReduction

Type: `boolean`\
Default: `true`

Apply bit depth reduction.

##### colorTypeReduction

Type: `boolean`\
Default: `true`

Apply color type reduction.

##### paletteReduction

Type: `boolean`\
Default: `true`

Apply palette reduction.

##### interlaced

Type: `boolean | undefined | null`\
Default: `false`

Enable [Adam7](https://en.wikipedia.org/wiki/Adam7_algorithm) PNG interlacing on any images that are processed. Interlaced images look better when they're loaded partially, but usually interlace makes compression less efficient. Set to `undefined` or `null` to keep the same interlacing as the input image.

##### errorRecovery

Type: `boolean`\
Default: `true`

A reasonable amount of effort will be spent to try to recover as much data as possible of a broken image, but the success cannot generally be guaranteed.

#### buffer

Type: `Buffer`

Buffer to optimize.
