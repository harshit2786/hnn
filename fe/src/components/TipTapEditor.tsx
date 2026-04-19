import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Extension } from "@tiptap/core";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, Quote, List, ListOrdered, Minus,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
  IndentIncrease, IndentDecrease,
} from "lucide-react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "text-primary bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const IndentExtension = Extension.create({
  name: "indent",
  addOptions() {
    return { types: ["paragraph", "heading"], step: 24, max: 120 };
  },
  addGlobalAttributes() {
    return [{
      types: this.options.types as string[],
      attributes: {
        indent: {
          default: 0,
          parseHTML: (el: HTMLElement) => parseInt(el.style.marginLeft) || 0,
          renderHTML: (attrs: Record<string, number>) =>
            attrs.indent > 0 ? { style: `margin-left: ${attrs.indent}px` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      indent:
        () =>
        ({ tr, state, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if ((this.options.types as string[]).includes(node.type.name)) {
              const next = Math.min((node.attrs.indent as number || 0) + this.options.step, this.options.max);
              if (next !== node.attrs.indent) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
                changed = true;
              }
            }
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
      outdent:
        () =>
        ({ tr, state, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if ((this.options.types as string[]).includes(node.type.name)) {
              const next = Math.max((node.attrs.indent as number || 0) - this.options.step, 0);
              if (next !== node.attrs.indent) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, indent: next });
                changed = true;
              }
            }
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.indent(),
      "Shift-Tab": () => this.editor.commands.outdent(),
    };
  },
});

export default function TipTapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Underline,
      IndentExtension,
      Placeholder.configure({ placeholder: "Begin your entry here…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-journal min-h-[400px] focus:outline-none p-1",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-sm">
      {/* Toolbar — sticky below the editor page header */}
      <div className="sticky top-[92px] lg:top-14 z-10 flex items-center gap-0.5 px-3 py-2 border-b border-border bg-background/95 backdrop-blur-sm flex-wrap rounded-t-sm">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading"
        >
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Subheading"
        >
          <Heading3 size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered list"
        >
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().outdent().run()}
          title="Decrease indent"
        >
          <IndentDecrease size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().indent().run()}
          title="Increase indent"
        >
          <IndentIncrease size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align left"
        >
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align center"
        >
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align right"
        >
          <AlignRight size={14} />
        </ToolbarButton>

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 size={14} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-6 py-5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
