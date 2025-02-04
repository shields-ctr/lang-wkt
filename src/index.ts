import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import { completeFromList, ifIn } from "@codemirror/autocomplete";
import {styleTags, tags} from "@lezer/highlight"
import {parser} from "./syntax.grammar"

export const WKTLanguage = LRLanguage.define({
  parser: parser.configure({

    // I believe this is a list of extensions
    props: [
      styleTags({
        point: tags.keyword,
        line: tags.keyword,
        polygon: tags.keyword,
        multipoint: tags.keyword,
        multiline: tags.keyword,
        multipolygon: tags.keyword,
        Number: tags.integer,
        Comment: tags.lineComment,
        "( )": tags.paren,
        ",": tags.separator
      }),
      indentNodeProp.add({
        Geometry: delimitedIndent({closing:")", align: true})
      }),
      foldNodeProp.add({
        // List: foldInside // only seems to work right if symbol starts a line? or does it have to do with templating?
        Geometry: foldInside,
        GeometryM: foldInside,
        GeometryZ: foldInside,
        GeometryZM: foldInside
      })
    ]
  }),

  // these are 'facets' which are added to the AST.
  // They impact extension behavior
  languageData: {
    commentTokens: {line: "//"},
    // autocompletion: ,
    // wordChars:,
    closeBrackets: {
      brackets:"(",
      before:")"
    }
  }
})

const WKTCompletion = WKTLanguage.data.of({
  autocomplete: ifIn(["WKT", "Geometry"],completeFromList([
    {type: "class", label: "GEOMETRYCOLLECTION", info: "TODO add spec"},
    {type: "class", label: "POINT", info: "TODO add spec"},//, validFor: /^(@\w*)?$/},
    {type: "class", label: "LINESTRING", info: "TODO add spec"},//, validFor: /^(@\w*)?$/},
    {type: "class", label: "POLYGON", info: "TODO add spec"},//, validFor: /^(@\w*)?$/},
    {type: "class", label: "MULTILINESTRING", info: "TODO add spec"},//, validFor: /^(@\w*)?$/},
    {type: "class", label: "MULTIPOLYGON", info: "TODO add spec"},//, validFor: /^(@\w*)?$/},
  ]))
});

export function WKT() {
  return new LanguageSupport(WKTLanguage, [WKTCompletion])
}
