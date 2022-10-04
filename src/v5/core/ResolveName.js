/**
 * Please see `./LICENSE` for license details.
 */

/**
 *
 */
export default class ResolveName
{
   /**
    * @param {import('tinymce').Editor}  editor -
    */
   static setup(editor)
   {
      editor.on('ResolveName', (e) =>
      {
         let name;

         if (e.target.nodeType === 1 && (name = e.target.getAttribute('data-mce-object')))
         {
            e.name = name;
         }
      });
   }
}
