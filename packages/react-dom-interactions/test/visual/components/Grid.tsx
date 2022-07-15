import {
  useFloating,
  useInteractions,
  FloatingFocusManager,
  useClick,
  useDismiss,
  useListNavigation,
  useRole,
} from '@floating-ui/react-dom-interactions';
import {useRef, useState} from 'react';

export const Main = () => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const {x, y, reference, floating, strategy, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useRole(context, {role: 'listbox'}),
    useClick(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      cols: 3,
      orientation: 'horizontal',
      loop: true,
      openOnArrowKeyDown: false,
      disabledIndices: [0, 1, 2, 5, 10, 15, 46, 47, 48],
    }),
    useDismiss(context),
  ]);

  return (
    <>
      <h1>Grid</h1>
      <div className="container">
        <button ref={reference} {...getReferenceProps()}>
          Reference
        </button>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              ref={floating}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 100px 100px',
                position: strategy,
                left: x ?? 0,
                top: y ?? 0,
              }}
              {...getFloatingProps()}
            >
              {[...Array(49)].map((_, index) => (
                <button
                  role="option"
                  key={index}
                  tabIndex={-1}
                  disabled={[0, 1, 2, 5, 10, 15, 46, 47, 48].includes(index)}
                  ref={(node) => {
                    listRef.current[index] = node;
                  }}
                  {...getItemProps()}
                >
                  Item {index}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </div>
    </>
  );
};
