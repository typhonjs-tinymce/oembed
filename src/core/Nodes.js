/**
 * Please see `./LICENSE` for license details.
 */
import Settings      from '../Settings.js';
import { sanitize }  from './sanitize.js';

/**
 * Defines a transparent image.
 *
 * @type {string}
 */
const s_TRANSPARENT_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Stores the poster image temporarily to potentially assign as a `data-oembed-poster`.
 *
 * @type {string}
 */
let s_OEMBED_POSTER;

/**
 *
 */
export default class Nodes
{
   /**
    * @param {import('tinymce').Editor}  editor -
    *
    * @returns {(function(import('tinymce').html.Node[]): void)} -
    */
   static placeHolderConverter(editor)
   {
      return (nodes) =>
      {
         let i = nodes.length;
         let node;

         while (i--)
         {
            node = nodes[i];

            if (!node.parent || node.parent.attr('data-mce-object')) { continue; }

            if (isLiveEmbedNode(node) && Settings.hasLiveEmbeds(editor))
            {
               if (!isWithinEmbedWrapper(node)) { node.replace(createPreviewNode(editor, node)); }
            }
            else
            {
               if (!isWithinEmbedWrapper(node)) { node.replace(createPlaceholderNode(editor, node)); }
            }
         }
      };
   }

   /**
    * @param {string}  poster -
    */
   static setPoster(poster)
   {
      s_OEMBED_POSTER = poster;
   }
}

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {string}  nodeName -
 *
 * @param {import('tinymce').html.Node} previewNode -
 *
 * @param {string}  html -
 */
const appendNodeContent = (editor, nodeName, previewNode, html) =>
{
   const newNode = tinymce.html.DomParser({ forced_root_block: false, validate: false },
    editor.schema).parse(html, { context: nodeName });

   while (newNode.firstChild) { previewNode.append(newNode.firstChild); }
};

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {import('tinymce').html.Node} node -
 *
 * @returns {import('tinymce').html.Node} -
 */
const createPreviewNode = (editor, node) =>
{
   const name = node.name;

   if (s_OEMBED_POSTER !== void 0) { node.attr('data-oembed-poster', s_OEMBED_POSTER); }

   const previewWrapper = new tinymce.html.Node('span', 1);
   previewWrapper.attr({
      contentEditable: 'false',
      style: node.attr('style'),
      'data-mce-object': name,
      class: `mce-preview-object mce-object-${name}`
   });

   retainAttributesAndInnerHtml(editor, node, previewWrapper);

   const styles = editor.dom.parseStyle(node.attr('style'));
   const previewNode = new tinymce.html.Node(name, 1);

   setDimensions(node, previewNode, styles);

   previewNode.attr({
      src: node.attr('src'),
      style: node.attr('style'),
      class: node.attr('class')
   });

   if (name === 'iframe')
   {
      previewNode.attr({
         allowfullscreen: node.attr('allowfullscreen'),
         frameborder: '0'
      });
   }
   else
   {
      // Exclude autoplay as we don't want video/audio to play by default
      const attrs = ['controls', 'crossorigin', 'currentTime', 'loop', 'muted', 'poster', 'preload'];

      for (const attrName of attrs) { previewNode.attr(attrName, node.attr(attrName)); }

      // Recreate the child nodes using the sanitized inner HTML
      const sanitizedHtml = previewWrapper.attr('data-mce-html');
      if (sanitizedHtml !== null && sanitizedHtml !== void 0)
      {
         appendNodeContent(editor, name, previewNode, sanitizedHtml);
      }
   }

   const shimNode = new tinymce.html.Node('span', 1);
   shimNode.attr('class', 'mce-shim');

   previewWrapper.append(previewNode);
   previewWrapper.append(shimNode);

   return previewWrapper;
};

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {import('tinymce').html.Node} node -
 *
 * @returns {import('tinymce').html.Node} -
 */
const createPlaceholderNode = (editor, node) =>
{
   const name = node.name;

   if (s_OEMBED_POSTER !== void 0) { node.attr('data-oembed-poster', s_OEMBED_POSTER); }

   const placeHolder = new tinymce.html.Node('img', 1);
   placeHolder.shortEnded = true;

   retainAttributesAndInnerHtml(editor, node, placeHolder);

   const poster = node.attr('data-oembed-poster');

   setDimensions(node, placeHolder, {});
   placeHolder.attr({
      style: node.attr('style'),
      src: poster ? poster : s_TRANSPARENT_SRC,
      'data-mce-object': name,
      class: `mce-object mce-object-${name}`
   });

   return placeHolder;
};

/**
 * @param {import('tinymce').html.Node} node -
 *
 * @param {Record<string, string>} styles -
 *
 * @param {string} dimension -
 *
 * @param {string|null} defaultValue -
 *
 * @returns {string|null} -
 */
const getDimension = (node, styles, dimension, defaultValue = null) =>
{
   const value = node.attr(dimension);

   if (value !== null && value !== void 0)
   {
      return value;
   }
   else if (!Object.hasOwnProperty.call(styles, dimension))
   {
      return defaultValue;
   }
   else
   {
      return null;
   }
};

/**
 * @param {import('tinymce').html.Node} node -
 *
 * @returns {boolean} -
 */
const isLiveEmbedNode = (node) =>
{
   const name = node.name;
   return name === 'iframe' || name === 'video' || name === 'audio';
};

/**
 * @param {import('tinymce').html.Node} node -
 *
 * @returns {boolean} -
 */
const isPageEmbedWrapper = (node) =>
{
   const nodeClass = node.attr('class');
   return nodeClass && (/\btiny-pageembed\b/).test(nodeClass);
};

/**
 * @param {import('tinymce').html.Node} node -
 *
 * @returns {boolean} -
 */
const isWithinEmbedWrapper = (node) =>
{
   while ((node = node.parent))
   {
      if (isPageEmbedWrapper(node)) { return true; }
   }

   return false;
};

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {import('tinymce').html.Node} sourceNode -
 *
 * @param {import('tinymce').html.Node} targetNode -
 */
const retainAttributesAndInnerHtml = (editor, sourceNode, targetNode) =>
{
   // Prefix all attributes except width, height and style since we will add these to the placeholder.
   const attribs = sourceNode.attributes;
   let ai = attribs.length;
   while (ai--)
   {
      const attrName = attribs[ai].name;
      let attrValue = attribs[ai].value;

      if (attrName !== 'width' && attrName !== 'height' && attrName !== 'style')
      {
         if (attrName === 'data' || attrName === 'src')
         {
            attrValue = editor.convertURL(attrValue, attrName);
         }

         targetNode.attr(`data-oembed-p-${attrName}`, attrValue);
      }
   }

   // Place the inner HTML contents inside an escaped attribute.
   // This enables us to copy/paste the fake object.
   const innerHtml = sourceNode.firstChild && sourceNode.firstChild.value;
   if (innerHtml)
   {
      targetNode.attr('data-mce-html', escape(sanitize(editor, innerHtml)));
      targetNode.firstChild = null;
   }
};

/**
 * @param {import('tinymce').html.Node} node -
 *
 * @param {import('tinymce').html.Node} previewNode -
 *
 * @param {Record<string, string>} styles -
 */
const setDimensions = (node, previewNode, styles) =>
{
   // Apply dimensions for video elements to maintain legacy behaviour.
   const useDefaults = previewNode.name === 'img' || node.name === 'video';

   // Determine the defaults.
   const defaultWidth = useDefaults ? '300' : null;
   const fallbackHeight = node.name === 'audio' ? '30' : '150';
   const defaultHeight = useDefaults ? fallbackHeight : null;

   previewNode.attr({
      width: getDimension(node, styles, 'width', defaultWidth),
      height: getDimension(node, styles, 'height', defaultHeight)
   });
};
