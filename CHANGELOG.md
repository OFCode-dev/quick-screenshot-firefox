# Changelog

## 1.1.0
- Add the icon files referenced by the manifest (missing icons broke add-on validation/packaging)
- Firefox for Android: fall back to a preview tab (copy / long-press to save or share) when writing the image to the clipboard from the background page is not possible
- Capture the current window instead of relying on `windowId` (the `windows` API is limited on Android)
- Make badge feedback optional so platforms without toolbar badges (Android) can't break the capture flow
- Show the extension's own icon on the toolbar button

## 1.0.0
- Initial release
