/**
 * Defines all types that can be provided to the contentfulImage function as
 * source objects. The URL from this object is extracted in the function.
 *
 * You can provide the source as
 * - direct URL string
 * - any object containing a string property `"url"`(usually from the
 * contentful image field with `imageField.fields.file`)
 * - any object that has a string url in the `"file.url"` property (usually from
 * the contentful image field with `imageField.fields`)
 * - any object that has a string url in the `"fields.file.url"` property
 * (usually from the contentful image field directly).
 */
export type ContentfulImageSource =
  | string
  | { url: string }
  | { file: { url: string } }
  | { fields: { file: { url: string } } };

/**
 * Defines the image format. Defaults to the original image format.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsFormat =
  | "jpg"
  | "png"
  | "webp"
  | "gif"
  | "avif"
  | "jpg/progressive"
  | "png/png8";

/**
 * Defines the resizing behaviour. Defaults to `fit`.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsFit =
  | "pad"
  | "fill"
  | "scale"
  | "crop"
  | "thumb";

/**
 * Defines the focus area when resizing with the `pad`, `fill`, `crop` or
 * `thumb` option to either a position in the image or automatically detected
 * faces. Defaults to `center`.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsFocusArea =
  | "center"
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "top_right"
  | "bottom_right"
  | "top_left"
  | "bottom_left"
  | "face"
  | "faces";

/**
 * Round the corners by a given pixel amount or to a circle or ellipse with
 * `max`. Padding color is defined by the background color property. Defaults
 * to `0`.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsRadius = number | "max";

/**
 * Resize an image to the desired height. Max value is `4000`. Defaults to the
 * original image height.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsHeight = number;

/**
 * Resize an image to the desired width. Max value is `4000`. Defaults to the
 * original image height.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsWidth = number;

/**
 * Define the quality as an integer between `1` and `100`.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsQuality = number;

/**
 * Define the background color for the image when padding is required, for
 * example when using border radius or resizing with specific resizing
 * behaviours.
 *
 * Unlike in the documentation, provide a RGB string (the "#" will be ignored
 * if provided). The contentfulImage function will automatically apply the
 * `rgb:` prefix to the color.
 *
 * Refer to [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export type ContentfulImageOptionsBackgroundColor = string;

/**
 * All image options that can be specified when retrieving an image from the
 * Contentful images API.
 */
export type ContentfulImageOptions = {
  format?: ContentfulImageOptionsFormat;
  width?: ContentfulImageOptionsWidth;
  height?: ContentfulImageOptionsHeight;
  fit?: ContentfulImageOptionsFit;
  focusArea?: ContentfulImageOptionsFocusArea;
  radius?: ContentfulImageOptionsRadius;
  quality?: ContentfulImageOptionsQuality;
  backgroundColor?: ContentfulImageOptionsBackgroundColor;
};

/**
 * For each specifiable option in the `ContentfulImageOptions` object, define
 * a list of all query parameters that should or could be provided.
 *
 * Some properties may be defined by multiple query parameters such as the
 * image format (for example 8-bit pngs require two query parameters: fm=png and
 * fl=png8 to work).
 */
const optionQueryKeys: Record<keyof ContentfulImageOptions, string[]> = {
  backgroundColor: ["bg"],
  quality: ["q"],
  radius: ["r"],
  focusArea: ["f"],
  fit: ["fit"],
  height: ["h"],
  width: ["w"],
  format: ["fm", "fl"],
};

/**
 * Each option can be provided an option trasformer that takes as input the
 * stringified value for the given option and returns the transformed value
 * before being applied to the query string.
 */
const transformers: Partial<
  Record<keyof ContentfulImageOptions, (value: string) => string>
> = {
  // For background color, prepend the "rgb:" string and omit the "#" character
  backgroundColor: (value) => "rgb:" + value.replace("#", ""),

  // Clamp and round quality to int between 1 and 100,
  quality: (value) =>
    Math.round(
      Math.min(100, Math.max(1, Number.parseInt(value, 10)))
    ).toString(),
};

/**
 * Takes as input `ContentfulImageSource` and returns the base URL for the image.
 * Removes any query if defined and prepends "https:" if necessary.
 */
export function getContentfulImageSrcUrl(src: ContentfulImageSource) {
  // Get provided raw URL string
  let url =
    typeof src === "string"
      ? src
      : "fields" in src
      ? src.fields.file.url
      : "file" in src
      ? src.file.url
      : src.url;

  // Prepend https: if necessary
  if (url.startsWith("//")) url = "https:" + url;

  // Remove query
  if (url.includes("?")) url = url.split("?")[0];

  return url;
}

/**
 * Construct query from arguments.
 *
 * Some options may be split into multiple parameters in the query. For
 * example, image format for progressive jpeg. We receive the value
 * "jpg/progressive" (which is split into an array ["jpg", "progressive"])
 * and read the query parameters corresponding to the option "format"
 * which are ["fm", "fl"]. We then match by index and get the resulting query
 * "fm=jpg&fl=progressive". We do not always use all query parameters, thus
 * if either the query parameter name or value is undefined or an empty string
 * it is not included in the final query.
 */
export function getContentfulImageQuery(options: ContentfulImageOptions) {
  return Object.entries(options)
    .map(([key, value]) => {
      // Get list of all parameter names for current option
      const queryKeys = optionQueryKeys[key as keyof ContentfulImageOptions];

      // Get transformer for preprocessing before applying to query if exists.
      const transformer = transformers[key as keyof ContentfulImageOptions];

      // Convert value to string, apply transformer if exists and split
      // into list of values at "/".
      const values = (
        transformer ? transformer(value.toString()) : value.toString()
      ).split("/");

      // By index, match each parameter name and value to a "{name}={value}"
      // pair. If either the name or value for a pair is falsy, omit it.
      return queryKeys
        .map((name, i) => {
          if (!name || !values[i]) return "";
          return name + "=" + values[i];
        })
        .filter((_) => !!_);
    })
    .flat()
    .join("&");
}

/**
 * Given an image source from a Contentful image and a list of options, returns
 * a URL that can be used to fetch the specified image with the specified
 * options from the Contentful Images API.
 *
 * Read more about [the contentful images api documentation](
 * https://www.contentful.com/developers/docs/references/images-api/#/reference/image-manipulation)
 * for more info.
 */
export default function contentfulImage(
  src: ContentfulImageSource,
  options: ContentfulImageOptions = {}
) {
  // Get URL from src and query from options.
  const url = getContentfulImageSrcUrl(src);
  const query = getContentfulImageQuery(options);

  // Append query if one constructed
  return url + (query ? `?${query}` : "");
}
