var e;e=function(){class e{static getDisableFilePoster(e){return e.getParam("oembed_disable_file_poster",!1)}static getDisableFileSource(e){return e.getParam("oembed_disable_file_source",!1)}static getMediaHeight(e){return e.getParam("oembed_default_height",288)}static getMediaWidth(e){return e.getParam("oembed_default_width",512)}static getUrlResolver(e){return e.getParam("oembed_url_resolver")}static hasDimensions(e){return e.getParam("oembed_dimensions",!0)}static hasLiveEmbeds(e){return e.getParam("oembed_live_embeds",!0)}static hasPoster(e){return e.getParam("oembed_poster",!0)}static shouldFilterHtml(e){return e.getParam("oembed_filter_html",!0)}}const t=(t,a)=>{if(!1===e.shouldFilterHtml(t))return a;const r=tinymce.html.Writer();let s;return tinymce.html.SaxParser({validate:!1,allow_conditional_comments:!1,comment:e=>{s||r.comment(e)},cdata:e=>{s||r.cdata(e)},text:(e,t)=>{s||r.text(e,t)},start:(e,a,o)=>{if(s=!0,"script"!==e&&"noscript"!==e&&"svg"!==e){for(let r=a.length-1;r>=0;r--){const s=a[r].name;0===s.indexOf("on")&&(delete a.map[s],a.splice(r,1)),"style"===s&&(a[r].value=t.dom.serializeStyle(t.dom.parseStyle(a[r].value),e))}r.start(e,a,o),s=!1}},end:e=>{s||r.end(e)}},tinymce.html.Schema({})).parse(a),r.getContent()};let a;class r{static placeHolderConverter(t){return a=>{let r,n=a.length;for(;n--;)r=a[n],r.parent&&!r.parent.attr("data-mce-object")&&(i(r)&&e.hasLiveEmbeds(t)?l(r)||r.replace(s(t,r)):l(r)||r.replace(o(t,r)))}}static setPoster(e){a=e}}const s=(e,t)=>{const r=t.name;void 0!==a&&t.attr("data-oembed-poster",a);const s=new tinymce.html.Node("span",1);s.attr({contentEditable:"false",style:t.attr("style"),"data-mce-object":r,class:`mce-preview-object mce-object-${r}`}),m(e,t,s);const o=e.dom.parseStyle(t.attr("style")),n=new tinymce.html.Node(r,1);if(d(t,n,o),n.attr({src:t.attr("src"),style:t.attr("style"),class:t.attr("class")}),"iframe"===r)n.attr({allowfullscreen:t.attr("allowfullscreen"),frameborder:"0"});else{const a=["controls","crossorigin","currentTime","loop","muted","poster","preload"];for(const e of a)n.attr(e,t.attr(e));const o=s.attr("data-mce-html");null!=o&&((e,t,a,r)=>{const s=tinymce.html.DomParser({forced_root_block:!1,validate:!1},e.schema).parse(r,{context:t});for(;s.firstChild;)a.append(s.firstChild)})(e,r,n,o)}const i=new tinymce.html.Node("span",1);return i.attr("class","mce-shim"),s.append(n),s.append(i),s},o=(e,t)=>{const r=t.name;void 0!==a&&t.attr("data-oembed-poster",a);const s=new tinymce.html.Node("img",1);s.shortEnded=!0,m(e,t,s);const o=t.attr("data-oembed-poster");return d(t,s,{}),s.attr({style:t.attr("style"),src:o||"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7","data-mce-object":r,class:`mce-object mce-object-${r}`}),s},n=(e,t,a,r=null)=>{const s=e.attr(a);return null!=s?s:Object.hasOwnProperty.call(t,a)?null:r},i=e=>{const t=e.name;return"iframe"===t||"video"===t||"audio"===t},c=e=>{const t=e.attr("class");return t&&/\btiny-pageembed\b/.test(t)},l=e=>{for(;e=e.parent;)if(c(e))return!0;return!1},m=(e,a,r)=>{const s=a.attributes;let o=s.length;for(;o--;){const t=s[o].name;let a=s[o].value;"width"!==t&&"height"!==t&&"style"!==t&&("data"!==t&&"src"!==t||(a=e.convertURL(a,t)),r.attr(`data-mce-p-${t}`,a))}const n=a.firstChild&&a.firstChild.value;n&&(r.attr("data-mce-html",escape(t(e,n))),r.firstChild=null)},d=(e,t,a)=>{const r="img"===t.name||"video"===e.name,s=r?"300":null,o="audio"===e.name?"30":"150",i=r?o:null;t.attr({width:n(e,a,"width",s),height:n(e,a,"height",i)})},u=(e,t)=>{const a=Object.keys(t);for(let r=0,s=a.length;r<s;r++){const s=a[r],o=`${t[s]}`;if(e.map[s]){let t=e.length;for(;t--;){const a=e[t];a.name===s&&(o?(e.map[s]=o,a.value=o):(delete e.map[s],e.splice(t,1)))}}else o&&(e.push({name:s,value:o}),e.map[s]=o)}},h=["source"],p=(e,t,a)=>{const r=tinymce.html.Writer();let s,o=0;return tinymce.html.SaxParser({validate:!1,allow_conditional_comments:!0,comment:e=>{r.comment(e)},cdata:e=>{r.cdata(e)},text:(e,t)=>{r.text(e,t)},start:(e,n,i)=>{switch(e){case"video":case"object":case"embed":case"img":case"iframe":void 0!==t.height&&void 0!==t.width&&u(n,{width:t.width,height:t.height})}if(a)switch(e){case"video":u(n,{poster:t.poster,src:""});break;case"iframe":u(n,{src:t.source});break;case"source":if(o<2&&(u(n,{src:t[h[o]],type:t[`${h[o]}mime`]}),!t[h[o]]))return;o++;break;case"img":if(!t.poster)return;s=!0}r.start(e,n,i)},end:e=>{if("video"===e&&a)for(let e=0;e<2;e++)if(t[h[e]]){const a=[];a.map={},o<=e&&(u(a,{src:t[h[e]],type:t[`${h[e]}mime`]}),r.start("source",a,!0))}if(t.poster&&"object"===e&&a&&!s){const e=[];e.map={},u(e,{src:t.poster,width:t.width,height:t.height}),r.start("img",e,!0)}r.end(e)}},tinymce.html.Schema({})).parse(e),r.getContent()},g=(e,t)=>a=>e.selection.selectorChangedWithUnbind(t.join(","),a.setActive).unbind;class b{constructor(e,t){this.tag=e,this.value=t}static some(e){return new b(!0,e)}static none(){return b.singletonNone}fold(e,t){return this.tag?t(this.value):e()}isSome(){return this.tag}isNone(){return!this.tag}map(e){return this.tag?b.some(e(this.value)):b.none()}bind(e){return this.tag?e(this.value):b.none()}exists(e){return this.tag&&e(this.value)}forall(e){return!this.tag||e(this.value)}filter(e){return!this.tag||e(this.value)?this:b.none()}getOr(e){return this.tag?this.value:e}or(e){return this.tag?this:e}getOrThunk(e){return this.tag?this.value:e()}orThunk(e){return this.tag?this:e()}getOrDie(e){if(this.tag)return this.value;throw new Error(null!=e?e:"Called getOrDie on None")}static from(e){return null==e?b.none():b.some(e)}getOrNull(){return this.tag?this.value:null}getOrUndefined(){return this.value}each(e){this.tag&&e(this.value)}toArray(){return this.tag?[this.value]:[]}toString(){return this.tag?`some(${this.value})`:"none()"}}b.singletonNone=new b(!1);const f=Object.hasOwnProperty,y=(e,t)=>v(e,t)?b.from(e[t]):b.none(),v=(e,t)=>f.call(e,t),w=e=>{let t={};return tinymce.html.SaxParser({validate:!1,allow_conditional_comments:!0,start:(e,a)=>{t.source||"param"!==e||(t.source=a.map.movie),"iframe"!==e&&"object"!==e&&"embed"!==e&&"video"!==e&&"audio"!==e||(t.type||(t.type=e),t=Object.assign({},a.map,t)),"source"===e&&(t.source||(t.source=a.map.src)),"img"!==e||t.poster||(t.poster=a.map.src),void 0!==a.map["data-oembed-poster"]&&(t.poster=a.map["data-oembed-poster"])}}).parse(e),t.source=t.source||t.src||t.data,t.poster=t.poster||"",t},A=new Map,j=[{name:"Vimeo",regex:/^(https:\/\/vimeo.com\/(.*)|https:\/\/vimeo.com\/album\/(.*)\/video\/(.*)|https:\/\/vimeo.com\/channels\/(.*)\/(.*)|https:\/\/vimeo.com\/groups\/(.*)\/videos\/(.*)|https:\/\/vimeo.com\/ondemand\/(.*)\/(.*)|https:\/\/player.vimeo.com\/video\/(.*))/,url:(e,t,a)=>`https://vimeo.com/api/oembed.json?url=${e}&maxwidth=${t}&maxheight=${a}`},{name:"YouTube",regex:/^(https:\/\/(.*).youtube.com\/watch(.*)|https:\/\/(.*).youtube.com\/v\/(.*)|https:\/\/youtu.be\/(.*)|https:\/\/(.*).youtube.com\/playlist?list=(.*))/,url:(e,t,a)=>`https://www.youtube.com/oembed?url=${e}&format=json&maxwidth=${t}&maxheight=${a}`}];class x{static async getEmbedHtml(t,a){let r;if(A.has(a.source))return A.get(a.source);const s=e.getUrlResolver(t);if(s)try{const e=await s({url:a.source});r={url:a.source,html:e.html,poster:e.poster}}catch(e){const a=e.msg||e.message||"Unknown error.";return void t.notificationManager.open({type:"error",text:`Media embed error: ${a}`})}else{let s,o;const n=e.getMediaWidth(t),i=e.getMediaHeight(t);for(const e of j)e.regex.exec(a.source)&&(o=e.url(a.source,n,i),s=e.name);if(void 0===o)return void t.notificationManager.open({type:"error",text:"Media embed error: URL did not match any providers available."});const c=await window.fetch(o);if(!c||200!==c.status)return void t.notificationManager.open({type:"error",text:`Media embed error: Could not fetch ${s} embed URL.`});const l=await c.json();if(void 0===l.html){const e=l.error?l.error:`Could not fetch ${s} embed URL.`;return void t.notificationManager.open({type:"error",text:`Media embed error: ${e}`})}r={url:a.source,html:l.html,poster:l.thumbnail_url}}return A.set(a.source,r),r}static isCached(e){return A.has(e)}}class _{static showDialog(t){const a=M(t);let r=a;const s=F(a),o=e.getDisableFilePoster(t),n=e.getDisableFileSource(t),i=[];i.push({name:"source",type:"urlinput",filetype:n?void 0:"media",label:"Source"}),e.hasDimensions(t)&&i.push({type:"sizeinput",name:"dimensions",label:"Constrain proportions",constrain:!0}),i.push({name:"poster",type:"urlinput",filetype:o?void 0:"image",label:"Media poster (Image URL)"}),i.push({name:"embed",type:"textarea",label:"Generated Embed:",disabled:!0});const c={type:"panel",items:i};t.windowManager.open({title:"Insert/Edit Media (oEmbed)",size:"normal",body:c,buttons:[{type:"cancel",name:"cancel",text:"Cancel"},{type:"submit",name:"save",text:"Save",primary:!0}],onSubmit:async e=>{const a=_.unwrap(e.getData());await U(r,a,t),e.close()},onChange:async(e,a)=>{try{switch(a.name){case"source":await $(r,e,t);break;case"embed":k(e,t);break;case"dimensions":case"poster":N(e,a.name)}r=_.unwrap(e.getData())}catch(e){console.log(e)}},initialData:s},void 0)}static unwrap(e,t){const a=t?P(t,e).getOr({}):{},r=S(e,a,t);return{...r("source"),...r("poster"),...r("embed"),...D(e,a)}}}const C=["width","height"],O=(e,t,a)=>{if("string"==typeof e.url&&e.url.trim().length>0){const r=e.html,s={...H(a,r),source:e.url,embed:r,poster:e.poster};t.setData(F(s))}},P=(e,t)=>y(t,e).bind((e=>y(e,"meta"))),D=(e,t)=>{const a={};return y(e,"dimensions").each((e=>{for(const r of C)y(t,r).orThunk((()=>y(e,r))).each((e=>a[r]=e))})),a},M=e=>{const t=e.selection.getNode(),a=R(t)?e.serializer.serialize(t,{selection:!0}):"";return{embed:a,...w(a)}},S=(e,t,a)=>r=>{const s=()=>y(e,r),o=()=>y(t,r),n=e=>y(e,"value").bind((e=>e.length>0?b.some(e):b.none()));return{[r]:(r===a?s().bind((e=>"object"==typeof e?n(e).orThunk(o):o().orThunk((()=>b.from(e))))):o().orThunk((()=>s().bind((e=>"object"==typeof e?n(e):b.from(e)))))).getOr("")}},$=async(e,t,a)=>{const r=_.unwrap(t.getData(),"source");if(e.source!==r.source){O({url:r.source,html:"",poster:""},t,a);const e=await x.getEmbedHtml(a,r);e&&O(e,t,a)}},k=(e,t)=>{const a=_.unwrap(e.getData()),r=H(t,a.embed);e.setData(F(r))},N=(e,t)=>{const a=_.unwrap(e.getData(),t),r=a.embed?p(a.embed,a,!1):"";e.setData(F({...a,embed:r}))},E=(e,t,a)=>{const s=e.dom.select("*[data-mce-object]");r.setPoster(a.poster),e.insertContent(t),r.setPoster(void 0),T(e,s).dataset.oembedPoster=a.poster,e.nodeChanged()},R=e=>e.getAttribute("data-mce-object"),T=(e,t)=>{const a=e.dom.select("*[data-mce-object]");for(let e=0;e<t.length;e++)for(let r=a.length-1;r>=0;r--)t[e]===a[r]&&a.splice(r,1);return e.selection.select(a[0]),a[0]},H=(e,t)=>w(t),U=async(e,t,a)=>{if(t.embed=p(t.embed,t),t.embed&&(e.source===t.source||x.isCached(t.source)))E(a,t.embed,t);else{const e=await x.getEmbedHtml(a,t);e&&E(a,e.html,t)}},F=e=>{const t={...e,source:{value:y(e,"source").getOr("")},poster:{value:y(e,"poster").getOr("")}};for(const a of C)y(e,a).each((e=>{const r=t.dimensions||{};r[a]=e,t.dimensions=r}));return t};tinymce.PluginManager.add("typhonjs-oembed",class{constructor(e){e.addCommand("typhonjsOembed",(()=>_.showDialog(e))),class{static register(e){e.ui.registry.addToggleButton("typhonjs-oembed",{tooltip:"Insert/edit media",icon:"embed",onAction:()=>{e.execCommand("typhonjsOembed")},onSetup:g(e,["img[data-mce-object]","span[data-mce-object]"])}),e.ui.registry.addMenuItem("typhonjs-oembed",{icon:"embed",text:"Media...",onAction:()=>{e.execCommand("typhonjsOembed")}})}}.register(e),class{static setup(e){e.on("ResolveName",(e=>{let t;1===e.target.nodeType&&(t=e.target.getAttribute("data-mce-object"))&&(e.name=t)}))}}.setup(e),class{static setup(e){e.on("preInit",(()=>{e.parser.addNodeFilter("iframe,video,audio,object,embed",r.placeHolderConverter(e)),e.serializer.addAttributeFilter("data-mce-object",((a,r)=>{let s,o,n,i,c,l,m,d,u=a.length;for(;u--;)if(s=a[u],s.parent){for(m=s.attr(r),o=new tinymce.html.Node(m,1),"audio"!==m&&(d=s.attr("class"),d&&-1!==d.indexOf("mce-preview-object")?o.attr({width:s.firstChild.attr("width"),height:s.firstChild.attr("height")}):o.attr({width:s.attr("width"),height:s.attr("height")})),o.attr({style:s.attr("style")}),i=s.attributes,n=i.length;n--;){const e=i[n].name;0===e.indexOf("data-mce-p-")&&o.attr(e.substr(11),i[n].value)}c=s.attr("data-mce-html"),c&&(l=new tinymce.html.Node("#text",3),l.raw=!0,l.value=t(e,unescape(c)),o.append(l)),s.replace(o)}}))}))}}.setup(e),class{static setup(e){e.on("click keyup touchend",(()=>{const t=e.selection.getNode();t&&e.dom.hasClass(t,"mce-preview-object")&&e.dom.getAttrib(t,"data-mce-selected")&&t.setAttribute("data-mce-selected","2")})),e.on("ObjectSelected",(e=>{"script"===e.target.getAttribute("data-mce-object")&&e.preventDefault()})),e.on("ObjectResized",(e=>{const t=e.target;let a;t.getAttribute("data-mce-object")&&(a=t.getAttribute("data-mce-html"),a&&(a=unescape(a),t.setAttribute("data-mce-html",escape(p(a,{width:String(e.width),height:String(e.height)})))))}))}}.setup(e)}getMetadata(){return{name:"TyphonJS oEmbed",url:"https://github.com/typhonjs-tinymce/oembed"}}})},"function"==typeof define&&define.amd?define(e):e();
//# sourceMappingURL=typhonjs-oembed.js.map