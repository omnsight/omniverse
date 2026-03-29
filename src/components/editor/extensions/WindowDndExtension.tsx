import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { useWindowDragStore } from '../../../stores/windowDragStateStore';

export const WindowDndExtension = Extension.create({
  name: 'windowDnd',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('windowDnd'),
        props: {
          handleDOMEvents: {
            dragover: (view, event) => {
              const dragging = useWindowDragStore.getState().activeDrag;
              if (!dragging) return false;

              event.preventDefault();
              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
              }

              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (pos) {
                const widget = document.createElement('span');
                widget.innerHTML = `
                  <div style="
                    background-color: var(--mantine-color-blue-light);
                    border: 1px dashed var(--mantine-color-blue-filled);
                    color: var(--mantine-color-blue-filled);
                    padding: 4px 10px;
                    border-radius: var(--mantine-radius-sm);
                    pointer-events: none;
                    white-space: nowrap;
                  ">
                    ${dragging.label}
                  </div>
                `;

                const deco = Decoration.widget(pos.pos, widget);
                view.setProps({
                  decorations: () => DecorationSet.create(view.state.doc, [deco]),
                });
              }
              return false;
            },
            dragleave: (view) => {
              view.setProps({ decorations: () => DecorationSet.empty });
              return false;
            },
          },
          handleDrop: (view, event) => {
            view.setProps({ decorations: () => DecorationSet.empty });

            const raw = event.dataTransfer?.getData('application/x-tiptap-node');
            console.debug('raw', raw);
            if (!raw) return false;

            try {
              const { type, label, state } = JSON.parse(raw);
              const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
              console.debug('drop pos', pos, 'type', type, 'label', label, 'state', state);

              if (pos) {
                const node = view.state.schema.nodes.windowAnchor.create({ type, label, state });
                const transaction = view.state.tr.insert(pos.pos, node);
                view.dispatch(transaction);
                useWindowDragStore.getState().actions.setDragging(undefined);
                return true;
              }
            } catch (e) {
              return false;
            }
            return false;
          },
        },
      }),
    ];
  },
});
