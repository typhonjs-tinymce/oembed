/**
 * Please see `./LICENSE` for license details.
 */

/**
 * @param {AttrList}            attrs -
 *
 * @param {Record<string, any>} updatedAttrs -
 */
const setAttributes = (attrs, updatedAttrs) =>
{
   const props = Object.keys(updatedAttrs);
   for (let k = 0, len = props.length; k < len; k++)
   {
      const name = props[k];
      const val = updatedAttrs[name];

      const value = `${val}`;

      if (attrs.map[name])
      {
         let i = attrs.length;
         while (i--)
         {
            const attr = attrs[i];

            if (attr.name === name)
            {
               if (value)
               {
                  attrs.map[name] = value;
                  attr.value = value;
               }
               else
               {
                  delete attrs.map[name];
                  attrs.splice(i, 1);
               }
            }
         }
      }
      else if (value)
      {
         attrs.push({
            name,
            value
         });

         attrs.map[name] = value;
      }
   }
};

const sources = ['source'];

/**
 * @param {string}              html -
 *
 * @param {Partial<MediaData>}  data -
 *
 * @param {boolean}             [updateAll] -
 *
 * @returns {string} -
 */
export const updateHtml = (html, data, updateAll) =>
{
   const writer = tinymce.html.Writer();
   let sourceCount = 0;
   let hasImage;

   tinymce.html.SaxParser({
      validate: false,
      allow_conditional_comments: true,

      comment: (text) =>
      {
         writer.comment(text);
      },

      cdata: (text) =>
      {
         writer.cdata(text);
      },

      text: (text, raw) =>
      {
         writer.text(text, raw);
      },

      start: (name, attrs, empty) =>
      {
         switch (name)
         {
            case 'video':
            case 'object':
            case 'embed':
            case 'img':
            case 'iframe':
               if (data.height !== undefined && data.width !== undefined)
               {
                  setAttributes(attrs, {
                     width: data.width,
                     height: data.height
                  });
               }
               break;
         }

         if (updateAll)
         {
            switch (name)
            {
               case 'video':
                  setAttributes(attrs, {
                     poster: data.poster,
                     src: ''
                  });
                  break;

               case 'iframe':
                  setAttributes(attrs, {
                     src: data.source
                  });
                  break;

               case 'source':
                  if (sourceCount < 2)
                  {
                     setAttributes(attrs, {
                        src: data[sources[sourceCount]],
                        type: data[`${sources[sourceCount]}mime`]
                     });

                     if (!data[sources[sourceCount]])
                     {
                        return;
                     }
                  }
                  sourceCount++;
                  break;

               case 'img':
                  if (!data.poster)
                  {
                     return;
                  }

                  hasImage = true;
                  break;
            }
         }

         writer.start(name, attrs, empty);
      },

      end: (name) =>
      {
         if (name === 'video' && updateAll)
         {
            for (let index = 0; index < 2; index++)
            {
               if (data[sources[index]])
               {

                  /**
                   * An attribute list.
                   *
                   * @type {any}
                   */
                  const attrs = [];
                  attrs.map = {};

                  if (sourceCount <= index)
                  {
                     setAttributes(attrs, {
                        src: data[sources[index]],
                        type: data[`${sources[index]}mime`]
                     });

                     writer.start('source', attrs, true);
                  }
               }
            }
         }

         if (data.poster && name === 'object' && updateAll && !hasImage)
         {

            /**
             * An attribute list.
             *
             * @type {any}
             */
            const imgAttrs = [];
            imgAttrs.map = {};

            setAttributes(imgAttrs, {
               src: data.poster,
               width: data.width,
               height: data.height
            });

            writer.start('img', imgAttrs, true);
         }

         writer.end(name);
      }
   }, tinymce.html.Schema({})).parse(html);

   return writer.getContent();
};
