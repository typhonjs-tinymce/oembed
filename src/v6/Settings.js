/**
 * Please see `./LICENSE` for license details.
 */
export default class Settings
{
   static getDisableFilePoster(editor)
   {
      return editor.getParam('oembed_disable_file_poster', false);
   }

   static getDisableFileSource(editor)
   {
      return editor.getParam('oembed_disable_file_source', false);
   }

   static getMediaHeight(editor)
   {
      return editor.getParam('oembed_default_height', 288);
   }

   static getMediaWidth(editor)
   {
      return editor.getParam('oembed_default_width', 512);
   }

   static getUrlResolver(editor)
   {
      return editor.getParam('oembed_url_resolver');
   }

   static hasDimensions(editor)
   {
      return editor.getParam('oembed_dimensions', true);
   }

   static hasLiveEmbeds(editor)
   {
      return editor.getParam('oembed_live_embeds', true);
   }

   static hasPoster(editor)
   {
      return editor.getParam('oembed_poster', true);
   }

   static shouldFilterHtml(editor)
   {
      return editor.getParam('oembed_filter_html', true);
   }
}