(function () {
    let styleId = "invert-colors-style";
    let existingStyle = document.getElementById(styleId);
  
    if (existingStyle) {
      existingStyle.remove(); // Remove if already applied
    } else {
      let style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = "html { filter: invert(1) hue-rotate(180deg); }";
      document.head.appendChild(style);
    }
  })();
  