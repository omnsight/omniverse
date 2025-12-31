import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface UsePresentationProps {
  editor: Editor | null;
  speed?: number; // ms per step
  onViewEncountered?: (viewId: string) => void;
}

export const usePresentation = ({ editor, speed = 2000, onViewEncountered }: UsePresentationProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying || !editor) return;

    let pos = currentIndex;
    const interval = setInterval(() => {
      if (pos >= editor.state.doc.content.size) {
        setIsPlaying(false);
        setCurrentIndex(0);
        return;
      }

      // Simple traversal logic: move through nodes
      // Ideally we want to highlight paragraphs or sentences. 
      // For simplicity, we'll iterate through top-level nodes or significant inline nodes.
      
      // Let's try to find the next "step" (block or view component)
      let nextPos = pos + 1;
      let found = false;

      editor.state.doc.nodesBetween(pos, editor.state.doc.content.size, (node, p) => {
        if (found) return false;
        if (p <= pos) return true; // Skip current

        if (node.type.name === 'viewComponent') {
          // Found a view!
          const viewId = node.attrs.id;
          if (viewId && onViewEncountered) {
             onViewEncountered(viewId);
          }
          // Highlight/select this node
          editor.commands.setTextSelection({ from: p, to: p + node.nodeSize });
          editor.commands.scrollIntoView();
          
          nextPos = p;
          found = true;
          return false;
        }

        if (node.isBlock) {
             // Highlight/select this block
             editor.commands.setTextSelection({ from: p, to: p + node.nodeSize });
             editor.commands.scrollIntoView();
             
             nextPos = p;
             found = true;
             return false;
        }
      });
      
      if (!found) {
          // End of doc
          setIsPlaying(false);
          setCurrentIndex(0);
      } else {
          setCurrentIndex(nextPos);
      }

    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, editor, speed, currentIndex, onViewEncountered]);

  const start = () => {
    if (editor) {
        editor.commands.focus('start');
        setCurrentIndex(0);
        setIsPlaying(true);
    }
  };

  const stop = () => setIsPlaying(false);

  return { isPlaying, start, stop };
};
