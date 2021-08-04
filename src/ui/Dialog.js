/**
 * Please see `./LICENSE` for license details.
 */
import { Obj, Optional }   from '@ephox/katamari';

import { htmlToData }      from '../core/htmlToData.js';
import Nodes               from '../core/Nodes.js';
import Service             from '../core/Service.js';
import { updateHtml }      from '../core/updateHtml.js';
import Settings            from '../Settings.js';

/**
 *
 */
export default class Dialog
{
   /**
    * @param {import('tinymce').Editor}  editor -
    */
   static showDialog(editor)
   {
      const editorData = getEditorData(editor);

      let currentData = editorData;
      const initialData = wrap(editorData);

      const disableFilePoster = Settings.getDisableFilePoster(editor);
      const disableFileSource = Settings.getDisableFileSource(editor);

      const items = [];

      // mediaInput - Dialog.UrlInputSpec
      items.push({
         name: 'source',
         type: 'urlinput',
         filetype: !disableFileSource ? 'media' : void 0,
         label: 'Source'
      });

      // sizeInput - Dialog.SizeInputSpec
      if (Settings.hasDimensions(editor))
      {
         items.push({
            type: 'sizeinput',
            name: 'dimensions',
            label: 'Constrain proportions',
            constrain: true
         });
      }

      // mediaPoster - Dialog.UrlInputSpec
      items.push({
         name: 'poster',
         type: 'urlinput',
         filetype: !disableFilePoster ? 'image' : void 0,
         label: 'Media poster (Image URL)'
      });

      // embedTextarea - Dialog.TextAreaSpec
      items.push({
         name: 'embed',
         type: 'textarea',
         label: 'Generated Embed:',
         disabled: true
      });

      /**
       * @type {import('tinymce').Dialog.PanelSpec}
       */
      const body = {
         type: 'panel',
         items
      };

      editor.windowManager.open({
         title: 'Insert/Edit Media (oEmbed)',
         size: 'normal',

         body,
         buttons: [
            {
               type: 'cancel',
               name: 'cancel',
               text: 'Cancel'
            },
            {
               type: 'submit',
               name: 'save',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: async (api) =>
         {
            const serviceData = Dialog.unwrap(api.getData());
            await submitForm(currentData, serviceData, editor);
            api.close();
         },
         onChange: async (api, detail) =>
         {
            try
            {
               switch (detail.name)
               {
                  case 'source':
                     await handleSource(currentData, api, editor);
                     break;

                  case 'embed':
                     handleEmbed(api, editor);
                     break;

                  case 'dimensions':
                  case 'poster':
                     handleUpdate(api, detail.name);
                     break;

                  default:
                     break;
               }
               currentData = Dialog.unwrap(api.getData());
            }
            catch (err)
            {
               console.log(err);
            }
         },
         initialData
      }, void 0);
   }

   /**
    * @param {MediaDialogData}       data -
    *
    * @param {keyof MediaDialogData} [sourceInput] -
    *
    * @returns {MediaData} -
    */
   static unwrap(data, sourceInput)
   {
      const metaData = sourceInput ? extractMeta(sourceInput, data).getOr({}) : {};
      const get = getValue(data, metaData, sourceInput);
      return {
         ...get('source'),
         ...get('poster'),
         ...get('embed'),
         ...getDimensions(data, metaData)
      };
   }
}

/**
 * @type {('width' | 'height')[]}
 */
const s_DIMENSION_ATTR = ['width', 'height'];

/**
 * @param {{ url: string; html: string; poster: string }} response -
 *
 * @param {import('tinymce').Dialog.DialogInstanceApi<MediaDialogData>}     api -
 *
 * @param {Editor}  editor -
 */
const addEmbedHtml = (response, api, editor) =>
{
   // Only set values if a URL has been defined
   if (typeof response.url === 'string' && response.url.trim().length > 0)
   {
      const html = response.html;
      const snippetData = snippetToData(editor, html);

      /**
       * @type {MediaData}
       */
      const nuData = {
         ...snippetData,
         source: response.url,
         embed: html,
         poster: response.poster
      };

      api.setData(wrap(nuData));
   }
};

/**
 * Note: mainData is DialogSubData
 *
 * @param {keyof MediaDialogData} sourceInput -
 *
 * @param {MediaDialogData}       data -
 *
 * @returns {Optional<Record<string, string>>} -
 */
const extractMeta = (sourceInput, data) => Obj.get(data, sourceInput).bind((mainData) => Obj.get(mainData, 'meta'));

/**
 * @param {MediaDialogData}         data -
 *
 * @param {Record<string, string>}  metaData -
 *
 * @returns {{}} -
 */
const getDimensions = (data, metaData) =>
{
   const dimensions = {};
   Obj.get(data, 'dimensions').each((dims) =>
   {
      for (const prop of s_DIMENSION_ATTR)
      {
         Obj.get(metaData, prop).orThunk(() => Obj.get(dims, prop)).each((value) => dimensions[prop] = value);
      }
   });
   return dimensions;
};

/**
 * @param {import('tinymce').Editor} editor -
 *
 * @returns {MediaData} -
 */
const getEditorData = (editor) =>
{
   const element = editor.selection.getNode();
   const snippet = isMediaElement(element) ? editor.serializer.serialize(element, { selection: true }) : '';
   return {
      embed: snippet,
      ...htmlToData(snippet)
   };
};

/**
 * @param {MediaDialogData}         data -
 *
 * @param {Record<string, string>}  metaData -
 *
 * @param {keyof MediaDialogData}   [sourceInput] -
 *
 * @returns {Function} {function(prop: keyof MediaDialogData): Record<string, string>}
 */
const getValue = (data, metaData, sourceInput) => (prop) =>
{
   // Cases:
   // 1. Get the nested value prop (component is the executed urlinput)
   // 2. Get from metadata (a urlinput was executed but urlinput != this component)
   // 3. Not a urlinput so just get string
   // If prop === sourceInput do 1, 2 then 3, else do 2 then 1 or 3
   // ASSUMPTION: we only want to get values for props that already exist in data

   /**
    * @returns {Optional<string | Record<string, string> | DialogSubData>} -
    */
   const getFromData = () => Obj.get(data, prop);

   /**
    * @returns {Optional<string>} -
    */
   const getFromMetaData = () => Obj.get(metaData, prop);

   /**
    * Note v: string
    *
    * @param {Record<string, string>} c -
    *
    * @returns {Optional<string>} -
    */
   const getNonEmptyValue = (c) => Obj.get(c, 'value').bind((v) => v.length > 0 ? Optional.some(v) : Optional.none());

   /**
    * @returns {Optional<string>} -
    */
   const getFromValueFirst = () => getFromData().bind((child) => typeof child === 'object' ?
    getNonEmptyValue(child).orThunk(getFromMetaData) : // as Record<string, string>
     getFromMetaData().orThunk(() => Optional.from(child))); // as string

   /**
    * @returns {Optional<string>} -
    */
   const getFromMetaFirst = () => getFromMetaData().orThunk(() =>
    getFromData().bind((child) => typeof child === 'object' ?
     getNonEmptyValue(child) :   // as Record<string, string>
      Optional.from(child)));    // as string

   return { [prop]: (prop === sourceInput ? getFromValueFirst() : getFromMetaFirst()).getOr('') };
};

/**
 * @param {MediaData} prevData -
 *
 * @param {import('tinymce').Dialog.DialogInstanceApi<MediaDialogData>} api -
 *
 * @param {import('tinymce').Editor} editor -
 *
 * @returns {Promise<void>} -
 */
const handleSource = async (prevData, api, editor) =>
{
   const serviceData = Dialog.unwrap(api.getData(), 'source');

   // If a new URL is entered, then clear the embed html and fetch the new data
   if (prevData.source !== serviceData.source)
   {
      addEmbedHtml({ url: serviceData.source, html: '', poster: '' }, api, editor);

      const response = await Service.getEmbedHtml(editor, serviceData);
      if (response)
      {
         addEmbedHtml(response, api, editor);
      }
   }
};

/**
 * @param {import('tinymce').Dialog.DialogInstanceApi<MediaDialogData>} api -
 *
 * @param {import('tinymce').Editor} editor -
 */
const handleEmbed = (api, editor) =>
{
   const data = Dialog.unwrap(api.getData());
   const dataFromEmbed = snippetToData(editor, data.embed);
   api.setData(wrap(dataFromEmbed));
};

/**
 * @param {import('tinymce').Dialog.DialogInstanceApi<MediaDialogData>} api -
 *
 * @param {keyof MediaDialogData} sourceInput -
 */
const handleUpdate = (api, sourceInput) =>
{
   const data = Dialog.unwrap(api.getData(), sourceInput);
   const embed = data.embed ? updateHtml(data.embed, data, false) : '';
   api.setData(wrap({ ...data, embed }));
};

/**
 * @param {import('tinymce').Editor} editor -
 *
 * @param {string} html -
 *
 * @param {MediaData} data -
 */
const handleInsert = (editor, html, data) =>
{
   const beforeObjects = editor.dom.select('*[data-mce-object]');

   Nodes.setPoster(data.poster);

   editor.insertContent(html);

   Nodes.setPoster(void 0);

   const element = selectPlaceholder(editor, beforeObjects);

   element.dataset.oembedPoster = data.poster;

   editor.nodeChanged();
};

/**
 * @param {Element} element -
 *
 * @returns {string} -
 */
const isMediaElement = (element) => element.getAttribute('data-mce-object');

/**
 *
 * @param {import('tinymce').Editor} editor -
 *
 * @param {HTMLElement[]} beforeObjects -
 *
 * @returns {HTMLElement} -
 */
const selectPlaceholder = (editor, beforeObjects) =>
{
   /**
    * @type {HTMLElement[]}
    */
   const afterObjects = editor.dom.select('*[data-mce-object]');

   // Find new image placeholder so we can select it
   for (let i = 0; i < beforeObjects.length; i++)
   {
      for (let y = afterObjects.length - 1; y >= 0; y--)
      {
         if (beforeObjects[i] === afterObjects[y])
         {
            afterObjects.splice(y, 1);
         }
      }
   }

   editor.selection.select(afterObjects[0]);

   return afterObjects[0];
};

/**
 * @param {import('tinymce').Editor}  editor -
 *
 * @param {string}  embedSnippet -
 *
 * @returns {MediaData} -
 */
const snippetToData = (editor, embedSnippet) => htmlToData(embedSnippet);

/**
 * @param {MediaData} prevData -
 *
 * @param {MediaData} newData -
 *
 * @param {import('tinymce').Editor}    editor -
 *
 * @returns {Promise<void>} -
 */
const submitForm = async (prevData, newData, editor) =>
{
   newData.embed = updateHtml(newData.embed, newData);

   // Only fetch the embed HTML content if the URL has changed from what it previously was
   if (newData.embed && (prevData.source === newData.source || Service.isCached(newData.source)))
   {
      handleInsert(editor, newData.embed, newData);
   }
   else
   {
      const response = await Service.getEmbedHtml(editor, newData);
      if (response)
      {
         handleInsert(editor, response.html, newData);
      }
   }
};

/**
 * @param {MediaData} data -
 *
 * @returns {MediaDialogData} -
 */
const wrap = (data) =>
{
   /**
    * @type {MediaDialogData}
    */
   const wrapped = {
      ...data,
      source: { value: Obj.get(data, 'source').getOr('') },
      poster: { value: Obj.get(data, 'poster').getOr('') }
   };

   // Add additional size values that may or may not have been in the html
   for (const prop of s_DIMENSION_ATTR)
   {
      Obj.get(data, prop).each((value) =>
      {
         const dimensions = wrapped.dimensions || {};
         dimensions[prop] = value;
         wrapped.dimensions = dimensions;
      });
   }

   return wrapped;
};
