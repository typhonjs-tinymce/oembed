/**
 * Please see `./LICENSE` for license details.
 */

/**
 *
 */
export default class Buttons
{
   /**
    * @param {import('tinymce').Editor}  editor -
    */
   static register(editor)
   {
      editor.ui.registry.addToggleButton('typhonjs-oembed', {
         tooltip: 'Insert/edit media',
         icon: 'embed',
         onAction: () =>
         {
            editor.execCommand('typhonjsOembed');
         },
         onSetup: stateSelectorAdapter(editor, ['img[data-mce-object]', 'span[data-mce-object]'])
      });

      editor.ui.registry.addMenuItem('typhonjs-oembed', {
         icon: 'embed',
         text: 'Media...',
         onAction: () =>
         {
            editor.execCommand('typhonjsOembed');
         }
      });
   }
}

/**
 * @param {import('tinymce').Editor}    editor -
 *
 * @param {string[]}  selector -
 *
 * @returns {function(import('tinymce').Toolbar.ToolbarToggleButtonInstanceApi): *} -
 */
const stateSelectorAdapter = (editor, selector) => (buttonApi) =>
 editor.selection.selectorChangedWithUnbind(selector.join(','), buttonApi.setActive).unbind;
