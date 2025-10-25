# 🔥 Colab Keepalive

A professional Chrome extension that prevents Google Colab notebooks from disconnecting due to inactivity.

## Features

- ✅ **Automatic Activity Simulation** - Simulates user activity every 60 seconds
- ✅ **Auto-Reconnect** - Automatically clicks the connect button if disconnected
- ✅ **Auto-Start Option** - Optionally start keepalive automatically when you open Colab
- ✅ **Clean UI** - Modern, intuitive popup interface
- ✅ **Lightweight** - Minimal resource usage
- ✅ **Manifest V3** - Uses the latest Chrome extension architecture

## Installation

### From Source (Developer Mode)

1. **Clone or download** this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `colab_keepalive` folder
6. The extension icon should appear in your toolbar

### Creating Icons (Required)

The extension needs three icon sizes. You can:

**Option 1: Use a placeholder**
```bash
# Create simple colored squares as placeholders
# You'll need image editing software or online tools
```

**Option 2: Generate programmatically**
```python
# Run this Python script to generate simple icons
python generate_icons.py
```

## Usage

1. **Open Google Colab** - Navigate to https://colab.research.google.com/
2. **Open a notebook** - Create or open any notebook
3. **Click the extension icon** - The popup will show the current status
4. **Start Keepalive** - Click "Start Keepalive" button
5. **Verify** - Status indicator turns green when active

### Auto-Start Feature

- Check "Auto-start on page load" in the popup
- Keepalive will automatically activate whenever you open a Colab notebook
- Preference is saved and persists across browser sessions

## How It Works

The extension operates in three phases:

1. **Activity Simulation** - Every 60 seconds, it:
   - Simulates mouse movement on the page
   - Triggers mouseover events on notebook elements
   - Keeps the session active

2. **Connection Monitoring** - Continuously checks for:
   - Disconnection status
   - Connect button visibility
   - Automatic reconnection when needed

3. **State Management** - Tracks:
   - Active/inactive status per tab
   - User preferences (auto-start)
   - Extension lifecycle

## Project Structure

```
colab_keepalive/
├── manifest.json       # Extension configuration
├── background.js       # Service worker (background tasks)
├── content.js          # Content script (runs on Colab pages)
├── popup.html          # Popup UI structure
├── popup.js            # Popup UI logic
├── icon16.png          # 16x16 icon
├── icon48.png          # 48x48 icon
├── icon128.png         # 128x128 icon
└── README.md           # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome standard)
- **Permissions**: 
  - `activeTab` - Access to current tab
  - `scripting` - Inject content scripts
  - `storage` - Save preferences
- **Host Permissions**: `https://colab.research.google.com/*`
- **Architecture**: 
  - Service Worker for background tasks
  - Content Script for page interaction
  - Popup for user interface

## Development

### Building from Scratch

1. **Setup**
   ```bash
   # No build process needed - pure vanilla JS
   # Just ensure all files are present
   ```

2. **Testing**
   - Load extension in developer mode
   - Open Chrome DevTools
   - Check Console for debug messages
   - Test on actual Colab notebooks

3. **Debugging**
   - **Background Script**: `chrome://extensions/` → Click "service worker"
   - **Content Script**: Open DevTools on Colab page
   - **Popup**: Right-click extension icon → Inspect popup

### Code Quality

- ✅ Comprehensive error handling
- ✅ JSDoc comments throughout
- ✅ Proper async/await usage
- ✅ Clean separation of concerns
- ✅ No external dependencies

## Troubleshooting

### Extension Not Working

1. **Refresh the Colab page** after installing/enabling
2. **Check permissions** - Ensure all required permissions are granted
3. **Verify you're on Colab** - Extension only works on `colab.research.google.com`
4. **Check console** - Look for error messages in DevTools

### Status Shows "Not on Colab"

- Make sure you're on a Google Colab page
- URL should include `colab.research.google.com`

### Icons Not Showing

- Ensure `icon16.png`, `icon48.png`, and `icon128.png` exist in the extension folder
- Use the `generate_icons.py` script to create them
- Reload the extension after adding icons

## Security & Privacy

- ✅ **No data collection** - Extension doesn't collect or transmit any data
- ✅ **Local storage only** - Preferences stored locally on your machine
- ✅ **Minimal permissions** - Only requests necessary permissions
- ✅ **Open source** - All code is visible and auditable

## Future Enhancements

- [ ] Configurable interval timing
- [ ] Activity log viewer
- [ ] Notification on disconnect/reconnect
- [ ] Multiple notebook support
- [ ] Statistics tracking (uptime, reconnections)

## License

MIT License - Feel free to use, modify, and distribute

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

**Made with ❤️ for Colab users who want uninterrupted runtime**
