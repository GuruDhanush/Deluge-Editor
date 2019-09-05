import  { languages }  from 'monaco-editor/esm/vs/editor/editor.main';


export let delugeLangConfiguration : languages.LanguageConfiguration  = {
    comments: {
        "lineComment": "//",
        "blockComment": [ "/*", "*/" ]
    },
    brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        { open: '{', close: '}'},
        { open: '[', close: ']'},
        { open: '(', close: ')'},
        { open: '"', close: '"'},
        { open: "'", close: "'"}
    ],
    surroundingPairs: [
        { open: '{', close: '}'},
        { open: '[', close: ']'},
        { open: '(', close: ')'},
        { open: '"', close: '"'},
        { open: "'", close: "'"}
    ]
}