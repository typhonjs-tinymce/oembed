/**
 * Please see `./LICENSE` for license details.
 */
import { updateHtml } from './updateHtml.js';

/**
 *
 */
export default class Selection
{
   /**
    * @param {import('tinymce').Editor}  editor -
    */
   static setup(editor)
   {
      editor.on('click keyup touchend', () =>
      {
         const selectedNode = editor.selection.getNode();

         if (selectedNode && editor.dom.hasClass(selectedNode, 'mce-preview-object'))
         {
            if (editor.dom.getAttrib(selectedNode, 'data-mce-selected'))
            {
               selectedNode.setAttribute('data-mce-selected', '2');
            }
         }
      });

      editor.on('ObjectSelected', (e) =>
      {
         const objectType = e.target.getAttribute('data-mce-object');

         if (objectType === 'script')
         {
            e.preventDefault();
         }
      });

      editor.on('ObjectResized', (e) =>
      {
         const target = e.target;
         let html;

         if (target.getAttribute('data-mce-object'))
         {
            html = target.getAttribute('data-mce-html');
            if (html)
            {
               html = unescape(html);
               target.setAttribute('data-mce-html', escape(updateHtml(html, {
                  width: String(e.width),
                  height: String(e.height)
               })));
            }
         }
      });
   }
}

