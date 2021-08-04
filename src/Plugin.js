/**
 * Please see `./LICENSE` for license details.
 */
import FilterContent from './core/FilterContent.js';
import ResolveName   from './core/ResolveName.js';
import Selection     from './core/Selection.js';
import Buttons       from './ui/Buttons.js';
import Dialog        from './ui/Dialog.js';

export class PluginOembed
{
   constructor(editor)
   {
      editor.addCommand('typhonjsOembed', () => Dialog.showDialog(editor));
      Buttons.register(editor);
      ResolveName.setup(editor);
      FilterContent.setup(editor);
      Selection.setup(editor);
   }

   getMetadata() {
      return {
         name: 'TyphonJS oEmbed',
         url: 'https://github.com/typhonjs-tinymce/oembed'
      };
   }
}

export default () =>
{
   tinymce.PluginManager.add('typhonjs-oembed', PluginOembed);
};
