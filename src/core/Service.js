/**
 * Please see `./LICENSE` for license details.
 */
import Settings from '../Settings.js';

/**
 * @type {Map<string, EmbedData>}
 */
const s_CACHE = new Map();


/**
 * Currently supports Vimeo / YouTube.
 *
 * @type {OEmbedService[]}
 */
const s_SERVICES = [
   {
      name: 'Spotify',
      regex: /^(https:\/\/open.spotify.com\/(.*)|spotify:(.*))/,
      url: (url, maxwidth, maxheight) => `https://open.spotify.com/oembed?url=${url}`
   },
   {
      name: 'Vimeo',
      regex: /^(https:\/\/vimeo.com\/(.*)|https:\/\/vimeo.com\/album\/(.*)\/video\/(.*)|https:\/\/vimeo.com\/channels\/(.*)\/(.*)|https:\/\/vimeo.com\/groups\/(.*)\/videos\/(.*)|https:\/\/vimeo.com\/ondemand\/(.*)\/(.*)|https:\/\/player.vimeo.com\/video\/(.*))/,
      url: (url, maxwidth, maxheight) => `https://vimeo.com/api/oembed.json?url=${url}&maxwidth=${maxwidth}&maxheight=${maxheight}`
   },
   {
      name: 'YouTube',
      regex: /^(https:\/\/(.*).youtube.com\/watch(.*)|https:\/\/(.*).youtube.com\/v\/(.*)|https:\/\/youtu.be\/(.*)|https:\/\/(.*).youtube.com\/playlist?list=(.*))/,
      url: (url, maxwidth, maxheight) => `https://www.youtube.com/oembed?url=${url}&format=json&maxwidth=${maxwidth}&maxheight=${maxheight}`
   }
]

/**
 *
 */
export default class Service
{
   /**
    * @param {import('tinymce').Editor}    editor -
    *
    * @param {MediaData} data -
    *
    * @returns {Promise<EmbedData>} -
    */
   static async getEmbedHtml(editor, data)
   {
      let response;

      if (s_CACHE.has(data.source))
      {
         return s_CACHE.get(data.source);
      }

      const embedHandler = Settings.getUrlResolver(editor);

      if (embedHandler)
      {
         try
         {
            const handlerResponse = await embedHandler({ url: data.source });
            response = { url: data.source, html: handlerResponse.html, poster: handlerResponse.poster };
         }
         catch (err)
         {
            const message = err.msg || err.message || 'Unknown error.';
            editor.notificationManager.open({ type: 'error', text: `Media embed handler error: ${message}` });

            return void 0;
         }
      }
      else
      {
         let oembedName;
         let oembedUrl;

         const maxwidth = Settings.getMediaWidth(editor);
         const maxheight = Settings.getMediaHeight(editor);

         for (const service of s_SERVICES)
         {
            if (service.regex.exec(data.source))
            {
               oembedUrl = service.url(data.source, maxwidth, maxheight)
               oembedName = service.name;
            }
         }

         if (oembedUrl === void 0)
         {
            editor.notificationManager.open({
               type: 'error',
               text: 'Media embed handler error: URL did not match any providers available.'
            });
            return void 0;
         }

         // Fetch the embed URL from YouTube.
         const remoteResponse = await window.fetch(oembedUrl);

         if (!remoteResponse || remoteResponse.status !== 200)
         {
            editor.notificationManager.open({
               type: 'error',
               text: `Media embed handler error: Could not fetch ${oembedName} embed URL.`
            });
            return void 0;
         }

         const json = await remoteResponse.json();

         response = { url: data.source, html: json.html, poster: json.thumbnail_url };
      }

      s_CACHE.set(data.source, response);

      return response;
   }

   /**
    * @param {string} url -
    *
    * @returns {boolean} URL is cached.
    */
   static isCached(url)
   {
      return s_CACHE.has(url);
   }
}
