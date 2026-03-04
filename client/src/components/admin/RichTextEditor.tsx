import React, { useState, useRef, useEffect } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight
} from 'react-icons/fa';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Digite a URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  return (
    <div className="rich-editor">
      <div className="editor-toolbar">
        <button type="button" onClick={() => execCommand('bold')} title="Negrito">
          <FaBold />
        </button>
        <button type="button" onClick={() => execCommand('italic')} title="Itálico">
          <FaItalic />
        </button>
        <button type="button" onClick={() => execCommand('underline')} title="Sublinhado">
          <FaUnderline />
        </button>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} title="Lista">
          <FaListUl />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} title="Lista numerada">
          <FaListOl />
        </button>
        <button type="button" onClick={handleLink} title="Link">
          <FaLink />
        </button>
        <button type="button" onClick={handleImage} title="Imagem">
          <FaImage />
        </button>
        <button type="button" onClick={() => execCommand('justifyLeft')} title="Alinhar esquerda">
          <FaAlignLeft />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} title="Centralizar">
          <FaAlignCenter />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} title="Alinhar direita">
          <FaAlignRight />
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;