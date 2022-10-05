![@typhonjs-tinymce/ombed](https://i.imgur.com/Mivjpjf.jpg)

[![License](https://img.shields.io/badge/license-LGPL_2.1-yellowgreen.svg?style=plastic)](https://github.com/typhonjs-tinymce/oembed/blob/main/LICENSE)

Provides a media embed plugin for TinyMCE connecting to various oEmbed content providers. Please bear with us as this is a new release. The benefit of this plugin is that it provides a streamlined single panel UI and allows import from various oEmbed providers. Right now just YouTube / Vimeo for external video embeds. Another plus
is that the thumbnail provided in oEmbed data returned from the provider is automatically used as a poster image allowing the display of applying styles during interactive editing which the default media plugin can not accomplish. 

-----

Release 0.4.0 has sub-package exports for TinyMCE v5 & v6 versions of the plugin though the default export is also the v6 version. 

Auto-registration of the plugin:
- For TinyMCE v5 use: `import '@typhonjs-tinymce/oembed/v5`
- For TinyMCE v6 use: `import '@typhonjs-tinymce/oembed/v6` or just `import '@typhonjs-tinymce/oembed`

However, if you need to manually invoke the plugin registration this is handy when you don't know the TinyMCE version:
- For TinyMCE v5 use: `import initPluginv5 from '@typhonjs-tinymce/oembed/v5/plugin`
- For TinyMCE v6 use: `import initPluginv6 from '@typhonjs-tinymce/oembed/v6/plugin`

`initPlugin<XX>` is a function to invoke plugin registration.

-----

There are also bundled distributions in `./dist` in this repo and UMD builds as well.

It should be noted that presently it is not possible to run both the standard OSS `media` plugin alongside `typhonjs-oembed`. A lot more is coming along with details on configuration. 

Pict below: shows the simple GUI with a YouTube link added and automatic filling of all data fields. The bottom left shows adding styles w/ the thumbnail poster image and the final result on the lower right. 

![oembed](https://i.imgur.com/Ockfdh4.jpg)
