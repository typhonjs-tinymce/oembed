/**
 * Please see `./LICENSE` for license details.
 */
import Nodes         from './Nodes.js';
import { sanitize }  from './sanitize.js';

const s_FULLSCREEN_ATTRIBUTES = [
   'allowfullscreen',
   'mozallowfullscreen',
   'webkitallowfullscreen'
];

const s_SPECIAL_ELEMENTS = [
   'audio',
   'iframe',
   'object',
   'video'
];

/**
 *
 */
export default class FilterContent
{
   /**
    * @param {import('tinymce').Editor}  editor -
    */
   static setup(editor)
   {
      editor.on('preInit', () =>
      {
         // Make sure that any messy HTML is retained inside these
         const specialElements = editor.schema.getSpecialElements();

         for (const name of s_SPECIAL_ELEMENTS)
         {
            specialElements[name] = new RegExp(`<\/${name}[^>]*>`, 'gi');
            // specialElements[name] = new RegExp(`</${name}[^>]*>`, 'gi');
         }

         // Set allowFullscreen attribs as boolean
         const boolAttrs = editor.schema.getBoolAttrs();
         for (const name of s_FULLSCREEN_ATTRIBUTES)
         {
            boolAttrs[name] = {};
         }

         // Converts iframe, video etc into placeholder images
         editor.parser.addNodeFilter('iframe,video,audio,object,embed', Nodes.placeHolderConverter(editor));

         // Replaces placeholder images with real elements for video, object, iframe etc
         editor.serializer.addAttributeFilter('data-mce-object', (nodes, name) =>
         {
            let i = nodes.length;
            let node;
            let realElm;
            let ai;
            let attribs;
            let innerHtml;
            let innerNode;
            let realElmName;
            let className;

            while (i--)
            {
               node = nodes[i];
               if (!node.parent) { continue; }

               realElmName = node.attr(name);
               realElm = new tinymce.html.Node(realElmName, 1);

               // Add width/height to everything but audio
               // if (realElmName !== 'audio' && realElmName !== 'script') {
               if (realElmName !== 'audio')
               {
                  className = node.attr('class');
                  if (className && className.indexOf('mce-preview-object') !== -1)
                  {
                     realElm.attr({
                        width: node.firstChild.attr('width'),
                        height: node.firstChild.attr('height')
                     });
                  }
                  else
                  {
                     realElm.attr({
                        width: node.attr('width'),
                        height: node.attr('height')
                     });
                  }
               }

               realElm.attr({
                  style: node.attr('style')
               });

               // Unprefix all placeholder attributes
               attribs = node.attributes;
               ai = attribs.length;
               while (ai--)
               {
                  const attrName = attribs[ai].name;

                  if (attrName.indexOf('data-oembed-p-') === 0)
                  {
                     realElm.attr(attrName.substr(14), attribs[ai].value);
                  }
               }

               // Inject innerhtml
               innerHtml = node.attr('data-mce-html');
               if (innerHtml)
               {
                  innerNode = new tinymce.html.Node('#text', 3);
                  innerNode.raw = true;
                  innerNode.value = sanitize(editor, unescape(innerHtml));
                  realElm.append(innerNode);
               }

               node.replace(realElm);
            }
         });
      });
   }
}
