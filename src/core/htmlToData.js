/**
 *
 * @param {string}   html -
 * @param {Schema}   schema -
 * @returns {{}}
 */
export const htmlToData = (html, schema) =>
{
   /**
    * @type {Partial<MediaData>}
    */
   let data = {};

   const parser = tinymce.html.DomParser({ validate: false, forced_root_block: false }, schema);
   const rootNode = parser.parse(html);

   // node is ASTNode | null | undefined

   for (let node = rootNode; node; node = node.walk())
   {
      if (node.type === 1)
      {
         const name = node.name;

         if (!data.source && name === 'param')
         {
            data.source = node.attributes.map.movie; // node.attr('movie'); // attrs.map.movie;
         }

         if (name === 'iframe' || name === 'object' || name === 'embed' || name === 'video' || name === 'audio')
         {
            if (!data.type)
            {
               data.type = name;
            }

            data = Object.assign({}, node.attributes.map, data);
         }

         if (name === 'source')
         {
            if (!data.source)
            {
               data.source = node.attr('src');
            }
         }

         if (name === 'img' && !data.poster)
         {
            data.poster = node.attr('src');
         }

         if (node.attributes.map['data-oembed-poster'] !== void 0)
         {
            data.poster = node.attributes.map['data-oembed-poster'];
         }
      }
   }

   data.source = data.source || data.src || data.data;
   data.poster = data.poster || '';

   return data;
};