# Contentful Images API implementation in TypeScript

[Read the article](https://jussinevavuori.com/blogs)

Access Contentful images with an easier API provided by this package, which'
supports all [features of the Contentful Images API](https://www.contentful.com/developers/docs/references/images-api/).

## Table of contents

1. [Features](#features)
1. [Installation](#installation)
1. [Usage](#usage)
   1. [Providing an image source](#providing-an-image-source)
   1. [Example usage](#example-usage)
1. [All supported options](#all-supported-options)
   1. [Image Format](#imageformat)
   1. [Size](#size)
   1. [Quality](#quality)
   1. [Border Radius](#border-radius)
   1. [Resizing behaviour](#resizing-behaviour)
   1. [Focus area](#focus-area)
   1. [Background color](#background-color)

## Features

- Full TypeScript support (written in TS) ✅s
- All features of the Contentful Images API ✅
  - All image formats
    - `jpg`
    - `progressive jpg`
    - `webp`
    - `png`
    - `8-bit png`
    - `gif`
    - `avif`
  - Resizing to width and height
  - Custom resizing behaviours
  - Custom resizing focus areas
  - Custom background colors
  - Custom border radius
  - Adjustable image quality
- Easy-to-use and fully documented API ✅

## Installation

Install the package with

```shell
npm i contentful-image
```

or with yarn

```shell
yarn add contentful-image
```

## Usage

### Importing

Import the `contentfulImage` function with

```typescript
import contentfulImage from "contentful-image";
```

### Example usage

```typescript
import contentfulImage from "contentful-image";

// Entry with image in the myImage field
const entry = await contentfulClient.getEntry(/* ... */);

// Get image URL for image with specified options
const imageUrl = contentfulImage(entry.myImage, {
  // Optimize image with lower quality, next-gen image format,
  // correct width and height
  quality: 60,
  format: "webp",
  width: 400,
  height: 400,

  // Image resizing behaviour, custom background color, border radius
  // and more
  radius: "max",
  fit: "crop",
  focusArea: "face",
  backgroundColor: "#ffffff",
});

// Apply image URL
document.querySelector("img").src = imageUrl;
```

### Providing an image source

The first input for the function is the image source. You can either provide
a URL string or the image field (or any of its subfields containing the URL)
directly.

```typescript
const entry = await contentfulClient.getEntry(/* ... */);

// All these are identical and ok.
const url1 = contentfulImage(entry.myImage);
const url2 = contentfulImage(entry.myImage.fields);
const url3 = contentfulImage(entry.myImage.fields.file);
const url4 = contentfulImage(entry.myImage.fields.file.url);

// You could do this but you probably shouldn't
const dontDoThisUrl = contentfulImage("https://your.image.url/here");
```

Note: Contentful does not provide the `"https:"` prefix for the URL. The
`contentfulImage` will automatically prepend it.

Note: The `contentfulImage` function will automatically remove any query strings passed to it in the source argument.

## All supported options

All supported are fully typed and any good editor should hint you all available options, along with their documentation from the comments. More info on the supported options can be found from [the Contentful Images API documentation](https://www.contentful.com/developers/docs/references/images-api/).

By default, most options will use the original dimensions, quality, format and
more from the uploaded image in Contentful.

### Image format

Provide the image format you want to use to the `format` property. All available values are:

- `jpg`
- `jpg/progressive`
- `webp`
- `png`
- `png/png8`
- `gif`
- `avif`

Defaults to the original uploaded image format.

#### Example format

```typescript
const imageUrl = contentfulImage(src, {
  format: "webp",
});
```

### Size

Specify the width and the height to retrieve as numbers with the
`width` and `height` properties. Provide only one or both.

Defaults to the original uploaded image dimensions.

#### Example resizing

```typescript
const imageUrl = contentfulImage(src, {
  width: 600,
});
```

### Quality

Specify the quality as a percentage between 1 (min) and 100 (max) with the `quality` parameter. The provided
value will be clamped and rounded. Does not affect 8-bit pngs.

#### Example quality

```typescript
const imageUrl = contentfulImage(src, {
  quality: 60,
});
```

### Border radius

If you want rounded images, specify the border radius in pixels or use
`max` to automatically round the image into a circle or an ellipse with the `radius` parameter.

Defaults to `0`.

#### Example radius

```typescript
const imageUrl = contentfulImage(src, {
  radius: "max",
});
```

### Resizing behaviour

By default, images are resized to fit into the specified dimensions. You
can request a different behaviour using the `fit` parameter. Available values:

- `pad` to resize and add padding if needed (change color with `backgroundColor`)
- `fill` to resize and crop the image if needed
- `scale` to resize and change the original aspect ratio if needed
- `crop` to crop a part of the original image to fit the dimensions
- `thumb` to create a thumbnail from the image

#### Example resizing with custom behaviour

```typescript
const imageUrl = contentfulImage(src, {
  width: 200,
  height: 400,
  fit: "fill",
});
```

### Focus area

When the specified resizing behaviour in `fit` is any but `scale`, the resizing
will use the specified focus area to use when resizing. Specify the focus area using the `focusArea` parameter. Possible values are:

- `center`, `top`, `right`, `left`, `bottom`
- `top_right`, `top_left`, `bottom_right`, `bottom_left`
- `face` to focus the largest detected faces
- `faces` to focus all detected faces

Defaults to `center`.

#### Example resizing with custom behaviour and focus area

```typescript
const imageUrl = contentfulImage(src, {
  width: 200,
  height: 400,
  fit: "crop",
  focusArea: "face",
});
```

### Background color

When padding or using border radius, the background will automatically be filled
with the specified background color. Specify the color using the `backgroundColor` property as an RGB color as a RGB string (such as `#abc123`). The `contentfulImage` function will automatically omit the `"#"` character and prepend the required `rgb:` prefix as specified in the API documentation.

Defaults to white for JPEGs and transparent for PNGs and WEBPs.

#### Example background color

```typescript
const imageUrl = contentfulImage(src, {
  radius: "max",
  backgroundColor: "#ffff22",
});
```
