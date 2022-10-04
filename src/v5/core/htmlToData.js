/**
 * Please see `./LICENSE` for license details.
 */

/**
 * @param {string}   html -
 *
 * @returns {MediaData} -
 */
export const htmlToData = (html) =>
{
   let data = {};

   tinymce.html.SaxParser({
      validate: false,
      allow_conditional_comments: true,
      start: (name, attrs) =>
      {
         if (!data.source && name === 'param')
         {
            data.source = attrs.map.movie;
         }

         if (name === 'iframe' || name === 'object' || name === 'embed' || name === 'video' || name === 'audio')
         {
            if (!data.type)
            {
               data.type = name;
            }

            data = Object.assign({}, attrs.map, data);
         }

         if (name === 'source')
         {
            if (!data.source)
            {
               data.source = attrs.map.src;
            }
         }

         if (name === 'img' && !data.poster)
         {
            data.poster = attrs.map.src;
         }

         if (attrs.map['data-oembed-poster'] !== void 0)
         {
            data.poster = attrs.map['data-oembed-poster'];
         }
      }
   }).parse(html);

   data.source = data.source || data.src || data.data;
   data.poster = data.poster || '';

   return data;
};