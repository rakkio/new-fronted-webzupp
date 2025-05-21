import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaImage, FaUndo, FaRedo } from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL de la imagen:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-t-lg border border-gray-300 border-b-0">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Negrita"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Cursiva"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Lista con viñetas"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Lista numerada"
      >
        <FaListOl />
      </button>
      <button
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Añadir enlace"
      >
        <FaLink />
      </button>
      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-200"
        title="Añadir imagen"
      >
        <FaImage />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-2" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
        title="Deshacer"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200"
        title="Rehacer"
      >
        <FaRedo />
      </button>
    </div>
  );
};

export default function Editor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-pink-500 hover:text-pink-600 underline'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return (
    <div className="border border-gray-300 rounded-lg">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose prose-pink max-w-none p-4 min-h-[300px] focus:outline-none
          prose-headings:text-gray-900
          prose-p:text-gray-900
          prose-strong:text-gray-900
          prose-em:text-gray-900
          prose-li:text-gray-900
          prose-a:text-pink-500
          prose-a:hover:text-pink-600
          prose-img:rounded-lg
          prose-img:shadow-md
          prose-blockquote:text-gray-700
          prose-blockquote:border-l-pink-500
          prose-code:text-pink-600
          prose-pre:bg-gray-50
          prose-pre:text-gray-800
          prose-hr:border-gray-200
          text-gray-900
        "
      />
    </div>
  );
} 