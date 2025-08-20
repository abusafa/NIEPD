'use client';

import { useState, useEffect } from 'react';
import './lexical-editor.css';
import { Label } from '@/components/ui/label';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {
  $getRoot,
  $getSelection,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { HeadingNode, QuoteNode, $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from '@lexical/list';
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
  LinkNode,
} from '@lexical/link';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Indent,
  Outdent,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lexical editor configuration
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    hashtag: 'editor-text-hashtag',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

function onError(error: Error) {
  console.error('Lexical error:', error);
}

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const updateToolbar = () => {
    const selection = $getSelection();
    if (selection) {
      // Update formatting states
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      
      // Check if current selection is a link
      const node = selection.getNodes()[0];
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
      
      // Check block type
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
      if (element && $isHeadingNode(element)) {
        setBlockType(`h${element.getTag()}`);
      } else {
        setBlockType('paragraph');
      }
    }
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      'CAN_UNDO_COMMAND',
      (payload: boolean) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [activeEditor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      'CAN_REDO_COMMAND',
      (payload: boolean) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [activeEditor]);

  const formatText = (format: string) => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: string) => {
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const insertLink = () => {
    if (!isLink) {
      const url = prompt('Enter URL:');
      if (url) {
        activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    } else {
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'number') {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
        if (element) {
          const headingNode = $createHeadingNode(headingSize);
          element.replace(headingNode);
        }
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
        disabled={!canUndo}
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
        disabled={!canRedo}
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <Button
        variant={isBold ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={isItalic ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={isUnderline ? "default" : "ghost"}
        size="sm"
        onClick={() => formatText('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Headings */}
      <Button
        variant={blockType === 'h1' ? "default" : "ghost"}
        size="sm"
        onClick={() => formatHeading('h1')}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === 'h2' ? "default" : "ghost"}
        size="sm"
        onClick={() => formatHeading('h2')}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant={blockType === 'h3' ? "default" : "ghost"}
        size="sm"
        onClick={() => formatHeading('h3')}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatElement('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatElement('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatElement('right')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => formatElement('justify')}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList('bullet')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => insertList('number')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Indentation */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
      >
        <Outdent className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
      >
        <Indent className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Link */}
      <Button
        variant={isLink ? "default" : "ghost"}
        size="sm"
        onClick={insertLink}
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}

// HTML Conversion Plugin
function HtmlPlugin({ initialHtml, onChange }: { initialHtml?: string; onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Set initial content
  useEffect(() => {
    if (isFirstRender && initialHtml && initialHtml.trim() !== '') {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        
        // Skip empty HTML content
        if (initialHtml === '<p><br></p>' || initialHtml === '<p></p>' || initialHtml === '<br>') {
          setIsFirstRender(false);
          return;
        }

        try {
          // Create DOM parser
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, 'text/html');
          
          // Generate Lexical nodes from DOM
          const nodes = $generateNodesFromDOM(editor, dom);
          
          // Append nodes to root
          root.append(...nodes);
        } catch (error) {
          console.log('HTML parsing failed, falling back to text content');
          
          // Fallback: treat as plain text and create paragraphs
          const textContent = initialHtml.replace(/<[^>]*>/g, ''); // Strip HTML tags
          const paragraphs = textContent.split('\n').filter(p => p.trim() !== '');
          
          if (paragraphs.length > 0) {
            paragraphs.forEach(paragraphText => {
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(paragraphText.trim()));
              root.append(paragraph);
            });
          } else {
            // Single paragraph fallback
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(textContent));
            root.append(paragraph);
          }
        }
      });
      setIsFirstRender(false);
    }
  }, [initialHtml, editor, isFirstRender]);

  // Handle content changes
  const handleEditorChange = (editorState: EditorState) => {
    if (!isFirstRender) { // Only trigger onChange after initial load
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    }
  };

  return <OnChangePlugin onChange={handleEditorChange} />;
}



interface LexicalRichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  dir?: 'ltr' | 'rtl';
  required?: boolean;
}

export default function LexicalRichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  dir = 'ltr',
  required = false,
}: LexicalRichTextEditorProps) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      ListNode,
      ListItemNode,
    ],
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative" dir={dir}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[150px] p-4 outline-none focus:ring-0 resize-none"
                  placeholder={
                    <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                      {placeholder}
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HtmlPlugin initialHtml={value} onChange={onChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
