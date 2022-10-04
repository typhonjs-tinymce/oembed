/**
 * Please see `./LICENSE` for license details.
 */
import Settings from '../Settings.js';

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {string}  html -
 *
 * @returns {string} -
 */
export const sanitize = (editor, html) =>
{
   if (Settings.shouldFilterHtml(editor) === false)
   {
      return html;
   }

   const writer = tinymce.html.Writer();
   let blocked;

   tinymce.html.SaxParser({
      validate: false,
      allow_conditional_comments: false,

      comment: (text) =>
      {
         if (!blocked)
         {
            writer.comment(text);
         }
      },

      cdata: (text) =>
      {
         if (!blocked)
         {
            writer.cdata(text);
         }
      },

      text: (text, raw) =>
      {
         if (!blocked)
         {
            writer.text(text, raw);
         }
      },

      start: (name, attrs, empty) =>
      {
         blocked = true;

         if (name === 'script' || name === 'noscript' || name === 'svg')
         {
            return;
         }

         for (let i = attrs.length - 1; i >= 0; i--)
         {
            const attrName = attrs[i].name;

            if (attrName.indexOf('on') === 0)
            {
               delete attrs.map[attrName];
               attrs.splice(i, 1);
            }

            if (attrName === 'style')
            {
               attrs[i].value = editor.dom.serializeStyle(editor.dom.parseStyle(attrs[i].value), name);
            }
         }

         writer.start(name, attrs, empty);
         blocked = false;
      },

      end: (name) =>
      {
         if (blocked)
         {
            return;
         }

         writer.end(name);
      }
   }, tinymce.html.Schema({})).parse(html);

   return writer.getContent();
};
