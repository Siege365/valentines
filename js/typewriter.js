/* ============================================
   TYPEWRITER — Character-by-character reveal
   with variable rhythm and cursor
   ============================================ */

const Typewriter = (() => {

  /**
   * type(element, text, options) → Promise
   * Reveals text character by character with natural rhythm.
   */
  function type(element, text, options = {}) {
    const {
      speed = 70,          // base ms per character
      variance = 30,       // random variance ±ms
      pauseComma = 200,    // extra pause after comma
      pausePeriod = 350,   // extra pause after period
      showCursor = true,
      cursorClass = 'typewriter-cursor',
      onChar = null,       // callback per character
      onComplete = null,
    } = options;

    return new Promise((resolve) => {
      element.textContent = '';

      // Add cursor
      let cursor;
      if (showCursor) {
        cursor = document.createElement('span');
        cursor.className = cursorClass;
        cursor.textContent = '';
        element.appendChild(cursor);
      }

      const chars = text.split('');
      let index = 0;

      function typeNext() {
        if (index >= chars.length) {
          // Finished
          if (cursor) {
            // Keep cursor blinking for a moment, then remove
            setTimeout(() => {
              if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            }, 1500);
          }
          if (onComplete) onComplete();
          resolve();
          return;
        }

        const char = chars[index];

        // Insert character before cursor
        const span = document.createTextNode(char);
        if (cursor) {
          element.insertBefore(span, cursor);
        } else {
          element.appendChild(span);
        }

        if (onChar) onChar(char, index);
        index++;

        // Calculate delay for next character
        let delay = speed + (Math.random() * variance * 2 - variance);

        // Natural pauses
        if (char === ',') delay += pauseComma;
        if (char === '.') delay += pausePeriod;
        if (char === '?') delay += pausePeriod;
        if (char === ' ') delay *= 0.6; // spaces are quicker

        setTimeout(typeNext, delay);
      }

      // Small initial delay before starting
      setTimeout(typeNext, 300);
    });
  }

  /**
   * clear(element) — Clears typed text
   */
  function clear(element) {
    element.textContent = '';
  }

  return { type, clear };
})();
