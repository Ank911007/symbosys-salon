import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * A highly reusable Portal component to render children outside the current DOM hierarchy,
 * straight into document.body. Essential for Modals, Tooltips, and Dropdowns to escape
 * CSS transform stacking contexts and overflow: hidden containers.
 */
export function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}
