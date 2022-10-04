// /**
//  * Defines the regex to filter for YouTube.
//  *
//  * @type {RegExp}
//  */
// const s_REGEX_YOUTUBE = /^(https:\/\/youtu\.be|https:\/\/youtube.com)/;

/**
 * Provides extra CSS styles to configure text and various elements in TinyMCE.
 *
 * @type {object}
 */
const s_DEFAULT_STYLE_FORMATS = [{
   title: 'Styles',
   items: [
      {
         title: 'Border', items: [
            {
               title: 'No Border', selector: '*', styles: {
                  border: 'none'
               }
            },
            {
               title: 'Border Radius', items: [
                  {
                     title: 'BR None', selector: '*', styles: {
                        'border-radius': 'unset'
                     }
                  },
                  {
                     title: 'BR 4px', selector: '*', styles: {
                        'border-radius': '4px'
                     }
                  },
                  {
                     title: 'BR 8px', selector: '*', styles: {
                        'border-radius': '8px'
                     }
                  },
                  {
                     title: 'BR 16px', selector: '*', styles: {
                        'border-radius': '16px'
                     }
                  },
               ]
            },
         ]
      },
      {
         title: 'Drop Shadow', items: [
            {
               title: 'DS None', selector: '*', styles: {
                  filter: 'unset'
               }
            },
            {
               title: 'DS 4px', selector: '*', styles: {
                  filter: 'drop-shadow(4px 4px 3px black)'
               }
            },
            {
               title: 'DS 8px', selector: '*', styles: {
                  filter: 'drop-shadow(8px 8px 6px black)'
               }
            },
         ]
      },
      {
         title: 'Float', items: [
            {
               title: 'Float Left', selector: '*', styles: {
                  float: 'left',
                  margin: '0 10px 0 0'
               }
            },
            {
               title: 'Float Right', selector: '*', styles: {
                  float: 'right',
                  margin: '0 0 0 10px'
               }
            }
         ]
      },
      {
         title: 'Fonts',
         items: [
            {
               title: 'Neon', items: [
                  {
                     title: 'Neon Blue', selector: '*', styles: {
                        'color': '#fff',
                        'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6'
                     }
                  },
                  {
                     title: 'Neon Green', selector: '*', styles: {
                        'color': '#fff',
                        'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00e704, 0 0 20px #00e704, 0 0 25px #00e704, 0 0 30px #00e704, 0 0 35px #00e704'
                     }
                  },
                  {
                     title: 'Neon Red', selector: '*', styles: {
                        'color': '#fff',
                        'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #e70000, 0 0 20px #e70000, 0 0 25px #e70000, 0 0 30px #e70000, 0 0 35px #e70000'
                     }
                  },
                  {
                     title: 'Neon Purple', selector: '*', styles: {
                        'color': '#fff',
                        'text-shadow': '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #7900ea, 0 0 20px #7900ea, 0 0 25px #7900ea, 0 0 30px #7900ea, 0 0 35px #7900ea'
                     }
                  }
               ]
            }
         ]
      },
      {
         title: 'Margin', items: [
            {
               title: 'No Margin', selector: '*', styles: {
                  margin: 'unset'
               }
            },
            {
               title: 'Left', items: [
                  {
                     title: 'ML 5px', selector: '*', styles: {
                        'inline': 'span',
                        'margin-left': '5px'
                     }
                  },
                  {
                     title: 'ML 10px', selector: '*', styles: {
                        'inline': 'span',
                        'margin-left': '10px'
                     }
                  }
               ]
            },
            {
               title: 'Right', items: [
                  {
                     title: 'MR 5px', selector: '*', styles: {
                        'inline': 'span',
                        'margin-right': '5px'
                     }
                  },
                  {
                     title: 'MR 10px', selector: '*', styles: {
                        'inline': 'span',
                        'margin-right': '10px'
                     }
                  }
               ]
            },
         ]
      },
   ]
},
];

tinymce.init({
   selector: 'textarea.tinymce',
   plugins: 'typhonjs-oembed media help',
   toolbar: 'styleselect | undo redo | typhonjs-oembed | media | help',
   style_formats: s_DEFAULT_STYLE_FORMATS,
   extended_valid_elements: 'iframe[allow|allowfullscreen|frameborder|scrolling|class|style|src|width|height]',
   // oembed_dimensions: false,
   oembed_live_embeds: false,
   oembed_default_width: 424,
   oembed_default_height: 238,
   // oembed_disable_file_source: true,
   file_picker_callback: (callback, value, meta) => {
      // Provide alternative source and posted for the media dialog
      switch (meta.filetype) {
         case 'image':
            callback('https://i.ytimg.com/vi/27e0A74_4Lc/hqdefault.jpg');
            break;

         case 'media':
            callback('https://youtu.be/27e0A74_4Lc');
            break;
      }

      if (meta.filetype === 'media') {
         callback('https://youtu.be/a4tNU2jgTZU');
      }
   },
   // oembed_url_resolver: async (data) => {
   //   // Prefilter any non YouTube URLs
   //   if (!s_REGEX_YOUTUBE.exec(data.url)) {
   //     throw new Error('Only YouTube video URLs are accepted.');
   //   }
   //
   //   // Fetch the embed URL from YouTube.
   //   const response = await window.fetch(`https://www.youtube.com/oembed?url=${
   //     data.url}&format=json&maxwidth=424&maxheight=238`);
   //
   //   if (!response || response.status !== 200) {
   //     throw new Error('Could not fetch YouTube embed URL.');
   //   }
   //
   //   const json = await response.json();
   //
   //   return { html: json.html, poster: json.thumbnail_url };
   // },
   height: 600
});

