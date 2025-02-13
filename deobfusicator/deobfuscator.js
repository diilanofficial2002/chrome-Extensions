function deobfuscateCode() {
    function formatCode(code) {
      try {
        return code
          .replace(/\b(function|if|for|while|do|switch|return)\b/g, '\n$1')
          .replace(/[{]/g, '\n{\n')
          .replace(/[}]/g, '\n}\n')
          .replace(/;/g, ';\n')
          .replace(/\n\s*\n/g, '\n')
          .trim();
      } catch (e) {
        console.error('Formatting error:', e);
        return code;
      }
    }
  
    function deobfuscateJS(code) {
      try {
        let deobfuscated = code
          .replace(/\\x([0-9A-Fa-f]{2})/g, (match, p1) => 
            String.fromCharCode(parseInt(p1, 16)))
          .replace(/\\u([0-9A-Fa-f]{4})/g, (match, p1) => 
            String.fromCharCode(parseInt(p1, 16)))
          .replace(/\[(['"])[^\1]+\1\](\[[0-9]+\])/g, (match) => {
            try {
              return eval(match);
            } catch (e) {
              return match;
            }
          });
  
        return formatCode(deobfuscated);
      } catch (e) {
        console.error('JavaScript deobfuscation error:', e);
        return code;
      }
    }
  
    function deobfuscatePHP(code) {
      try {
        let deobfuscated = code
          .replace(/base64_decode\(['"]([^'"]+)['"]\)/g, (match, p1) => {
            try {
              return atob(p1);
            } catch (e) {
              return match;
            }
          })
          .replace(/eval\((.*?)\);/g, '$1;')
          .replace(/\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\s*=\s*(['"])(.*?)\1;/g, 
            (match, quote, content) => {
              return `$${content.replace(/[^a-zA-Z0-9_]/g, '')} = ${quote}${content}${quote};`;
            });
  
        return formatCode(deobfuscated);
      } catch (e) {
        console.error('PHP deobfuscation error:', e);
        return code;
      }
    }
  
    const elements = document.querySelectorAll('script, pre, code');
  
    elements.forEach(element => {
      const content = element.textContent || element.innerText;
      
      if (content) {
        let deobfuscated;
        if (content.includes('<?php') || content.includes('<?=')) {
          deobfuscated = deobfuscatePHP(content);
        } else {
          deobfuscated = deobfuscateJS(content);
        }
  
        const deobfuscatedElement = document.createElement('pre');
        deobfuscatedElement.className = 'deobfuscated-code';
        deobfuscatedElement.style.cssText = `
          background-color:rgb(0, 0, 0);
          padding: 15px;
          border-radius: 5px;
          margin: 10px 0;
          white-space: pre-wrap;
          font-family: monospace;
        `;
        deobfuscatedElement.textContent = deobfuscated;
  
        element.parentNode.insertBefore(deobfuscatedElement, element.nextSibling);
      }
    });
  }
  
  deobfuscateCode();