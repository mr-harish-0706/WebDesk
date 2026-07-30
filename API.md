# WebDesk API Reference

The `window.webdesk` object provides a type-safe bridge between the React renderer and Electron main process.

## Web App Management API

### `window.webdesk.getApps(): Promise<WebApp[]>`
Returns all registered non-archived web applications.

### `window.webdesk.createApp(appData): Promise<WebApp>`
Creates a new web application and automatically registers a Linux `.desktop` launcher if enabled.

### `window.webdesk.launchApp(id: string): Promise<boolean>`
Launches the web application in an isolated window using its designated profile session partition (`persist:profile_id`).

### `window.webdesk.scrapeMetadata(url: string): Promise<FaviconScrapeResult>`
Fetches website title and favicon URL for auto-filling web app installation details.

---

## Session Profiles API

### `window.webdesk.getProfiles(): Promise<Profile[]>`
Returns all active isolated session profiles (Personal, Work, College, Gaming, Custom).

### `window.webdesk.createProfile(profileData): Promise<Profile>`
Creates a new isolated session profile partition.

---

## Linux Desktop Launcher API

### `window.webdesk.createDesktopLauncher(appId: string): Promise<boolean>`
Writes an XDG desktop file to `~/.local/share/applications/webdesk-[id].desktop`.

### `window.webdesk.removeDesktopLauncher(appId: string): Promise<boolean>`
Deletes the XDG desktop file for the specified app ID.
