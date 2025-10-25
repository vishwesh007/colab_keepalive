# Quick Installation Guide

## Install the Extension

1. **Open Chrome** and go to: `chrome://extensions/`

2. **Enable Developer Mode**
   - Look for the toggle in the top-right corner
   - Switch it ON

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to: `c:\Users\vishwesh\react-js-assignments\colab_keepalive`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Colab Keepalive" in your extensions list
   - The extension icon (🔥) should appear in your Chrome toolbar

## Test It Out

1. Go to: https://colab.research.google.com/
2. Open or create a notebook
3. Click the Colab Keepalive extension icon
4. Click "Start Keepalive"
5. Status should turn green showing "Active"

## Troubleshooting

### If extension doesn't load:
- Make sure all files are present (use the file list below)
- Check for errors in the Extensions page
- Try clicking "Reload" on the extension card

### Required Files:
```
✓ manifest.json
✓ background.js
✓ content.js
✓ popup.html
✓ popup.js
✓ icon16.png
✓ icon48.png
✓ icon128.png
✓ README.md
```

### If it doesn't work on Colab:
- Refresh the Colab page after installing
- Check DevTools console for errors (F12)
- Make sure you're on colab.research.google.com

## Next Steps

- Read the full README.md for detailed usage
- Enable "Auto-start on page load" for convenience
- Star/fork the project if you find it useful!

---

**Need help?** Check README.md or open an issue.
