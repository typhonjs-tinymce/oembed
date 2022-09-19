![@typhonjs-tinymce/ombed](https://i.imgur.com/Mivjpjf.jpg)

[![License](https://img.shields.io/badge/license-LGPL_2.1-yellowgreen.svg?style=plastic)](https://github.com/typhonjs-tinymce/oembed/blob/main/LICENSE)

Release 0.2.0 is TinyMCE v6 compatible. For a TinyMCE v5 compatible plugin check out the [TMCE-v5 branch](https://github.com/typhonjs-tinymce/oembed/tree/TMCE-v5).

Provides a media embed plugin for TinyMCE connecting to various oEmbed content providers. Please bear with us as this is a new release. The benefit of this plugin is that it provides a streamlined single panel UI and allows import from various oEmbed providers. Right now just YouTube / Vimeo for external video embeds. Another plus
is that the thumbnail provided in oEmbed data returned from the provider is automatically used as a poster image allowing the display of applying styles during interactive editing which the default media plugin can not accomplish. 

It should be noted that presently it is not possible to run both the standard OSS `media` plugin alongside `typhonjs-oembed`. A lot more is coming along with details on configuration. 

Pict below: shows the simple GUI with a YouTube link added and automatic filling of all data fields. The bottom left shows adding styles w/ the thumbnail poster image and the final result on the lower right. 

![oembed](https://i.imgur.com/Ockfdh4.jpg)
