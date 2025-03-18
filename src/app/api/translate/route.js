import * as deepl from 'deepl-node';

/*
 * Params: 
 *   text - text to be translated
 *   target_lang - code for language to be translated to
 * 
 * Returns:
 *   text - translated text
 *   source_lang - code for detected language
 * 
 */

export async function GET (request) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text');
  const target_lang = searchParams.get('target_lang');

  const translator = new deepl.Translator(process.env.DEEPL_API_KEY);
  const result = await translator.translateText(text, null, target_lang);

  let response = new Response;
  return Response.json({
    text: result.text,
    source_lang: result.detectedSourceLang.toUpperCase()
  });
}