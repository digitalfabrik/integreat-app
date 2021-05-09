import { FeaturedImageModel } from "api-client";
const ten = 10;

const roundToOneDecimal = number => Math.round(number * ten) / ten;

/**
 * This converts a FeaturedImageModel to a srcset.
 * It's necessary to have a defaultWidth in px of the displayed image tag to compute the ratios for the different
 * screen densities.
 * @param featuredImage
 * @param defaultWidth
 * @returns {string}
 */
const featuredImageToSrcSet = (featuredImage: FeaturedImageModel, defaultWidth: number) => [featuredImage.thumbnail, featuredImage.medium, featuredImage.large, featuredImage.full].map(({
  url,
  width
}) => `${encodeURI(url)} ${roundToOneDecimal(width / defaultWidth)}x`).join(', ');

export default featuredImageToSrcSet;