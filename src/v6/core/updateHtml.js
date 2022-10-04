/**
 * Please see `./LICENSE` for license details.
 */

const sources = ['source'];

/**
 * @param {string}              html -
 *
 * @param {Partial<MediaData>}  data -
 *
 * @param {boolean}             [updateAll] -
 *
 * @param {Schema}              [schema] -
 *
 * @returns {string} -
 */
export const updateHtml = (html, data, updateAll, schema) =>
{
   let numSources = 0;
   let sourceCount = 0;
   let hasImage;

   const parser = tinymce.html.DomParser(schema);
   parser.addNodeFilter('source', (nodes) => numSources = nodes.length);

   const rootNode = parser.parse(html);

   // Node is AstNode | null | undefined

   for (let node = rootNode; node; node = node.walk())
   {
      if (node.type === 1)
      {
         const name = node.name;

         switch (name)
         {
            case 'video':
            case 'object':
            case 'embed':
            case 'img':
            case 'iframe':
               if (data.height !== undefined && data.width !== undefined)
               {
                  node.attr('width', data.width);
                  node.attr('height', data.height);
               }
               break;
         }

         if (updateAll)
         {
            switch (name)
            {
               case 'video':
                  node.attr('poster', data.poster);
                  node.attr('src', null);
                  break;

               case 'iframe':
                  node.attr('src', data.source);
                  break;

               case 'source':
                  if (sourceCount < 2)
                  {
                     node.attr('src', data[sources[sourceCount]]);
                     node.attr('type', data[sources[sourceCount] + 'mime'] || null);

                     if (!data[sources[sourceCount]]) {
                        node.remove();
                        continue;
                     }
                  }
                  sourceCount++;
                  break;

               case 'img':
                  if (!data.poster)
                  {
                     node.remove();
                  }
                  hasImage = true;
                  break;
            }
         }
      }
   }

   return tinymce.html.Serializer({}, schema).serialize(rootNode);
};