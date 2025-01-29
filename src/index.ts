import {parser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags} from "@lezer/highlight"

export const WKTLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Name: tags.name,
        Number: tags.integer,
        Comment: tags.lineComment,
        "( )": tags.paren,
        ",": tags.separator
      })
    ]
  }),
  languageData: {
    commentTokens: {line: ";"}
  }
})

export function WKT() {
  return new LanguageSupport(WKTLanguage)
}
