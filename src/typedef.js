/**
 * Please see `./LICENSE` for license details.
 */

/**
 * @typedef {Array<{ name: string; value: string }> & { map: Record<string, string> }} AttrList
 */

/**
 * @typedef {object} DialogSubData
 *
 * @property {string} value -
 *
 * @property {Record<string, any>} [meta] -
 */

/**
 * @typedef {object} EmbedData
 *
 * @property {string} url -
 *
 * @property {string} html -
 *
 * @property {string} [poster] -
 */

/**
 * @typedef {object} MediaData
 *
 * @property {string} source -
 *
 * @property {string} [sourcemime] -
 *
 * @property {string} [width] -
 *
 * @property {string} [height] -
 *
 * @property {string} [embed] -
 *
 * @property {string} poster -
 *
 * @property {string} [type] - 'object' | 'iframe' | 'embed' | 'video' | 'audio'
 *
 * @property {string|boolean} [allowfullscreen] -
 *
 * @property {string} [src] -
 */

/**
 * @typedef {object} MediaDialogData
 *
 * @property {DialogSubData}  source -
 *
 * @property {DialogSubData}  poster -
 *
 * @property {string}         [embed] -
 *
 * @property {{width: string, height: string}}  [dimensions] -
 */

/**
 * @typedef {object} OEmbedService
 *
 * @property {string} name -
 *
 * @property {RegExp} regex -
 *
 * @property {Function} url -
 */