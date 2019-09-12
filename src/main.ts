import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands.js';

import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js';
import 'monaco-editor/esm/vs/editor/contrib/comment/comment.js';
import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js';
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding.js';
import 'monaco-editor/esm/vs/editor/contrib/indentation/indentUtils.js';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js';
import 'monaco-editor/esm/vs/editor/contrib/links/links.js';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js';



import { delugeMonarchConfiguration } from './dg.monarch';
import { delugeLangConfiguration } from './dg.configuration';
 



document.getElementById('theme-button').onclick = function() {
  let btn = document.getElementById('theme-button');
  let theme = +btn.dataset.theme;
  let lightMode : HTMLElement = btn.querySelector('.light_mode');
  let darkMode : HTMLElement = btn.querySelector('.dark_mode');

  if(theme == 0){
    btn.setAttribute('data-theme', '1');
    monaco.editor.setTheme('vs-dark');
    lightMode.style.display = 'inline';
    darkMode.style.display = 'none';
    document.documentElement.style.setProperty('--theme-color', '#1e1e1e' );

  } 
  if(theme == 1) {
     btn.setAttribute('data-theme', '0');
     monaco.editor.setTheme('vs-light');
     lightMode.style.display = 'none';
     darkMode.style.display = 'inline';
     document.documentElement.style.setProperty('--theme-color', '#fff');
  }
};



// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return '/editor.worker.bundle.js';
  }
}


const langId = 'deluge';

monaco.languages.register({ id: langId, extensions: ['dg'] });

monaco.languages.setLanguageConfiguration('deluge', delugeLangConfiguration);

monaco.languages.setMonarchTokensProvider('deluge', delugeMonarchConfiguration);


const editor = monaco.editor.create(document.getElementById('code'), {
  value: [
    'response = Map();',
    'response.put("bot",{"name":"OneDrive"});',
    'if(arguments.trim().length() <= 0 && selections.size() <= 0)',
    '{',
    '  response.put("text","Please enter a file name to look for in OneDrive.");',
    '  return response;',
    '}',
    'for each valuee in valuess',
    '{',
    '  response.put("text","Search results of *" + arguments + "*.");',
    '  return response;',
    '}'
  ].join('\n'),
  language: langId,
  copyWithSyntaxHighlighting: true,
  renderWhitespace: "boundary",
  fontSize: 20
});

 
var worker = new Worker('/worker.js');

worker.onmessage = function (event) {
  if (event.data instanceof Object && 
    event.data.hasOwnProperty('method') &&
    event.data.hasOwnProperty('params')) {

      var method = event.data['method'];
      var params = event.data['params'];

      if(method === 'diagnostics') {
        monaco.editor.setModelMarkers(editor.getModel(), langId,  params) ;
      }
  }
}
didOpen();
didChange();
 

function didOpen() {
  worker.postMessage({ 'method': 'onOpen', 'params': editor.getModel().getValue() });
}

function didChange() {
  editor.onDidChangeModelContent((event) => {
    worker.postMessage({ 'method': 'onChange', 'params': editor.getModel().getValue() });
  });
}

//Not used
function onHover() {
  monaco.languages.registerHoverProvider(langId, {
    provideHover: function (model, position) {

      return {
        range: new monaco.Range(1, 1, 1, 1),
        contents: []
      };

    }
  });
}





