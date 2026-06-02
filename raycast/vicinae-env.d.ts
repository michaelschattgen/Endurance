/// <reference types="@vicinae/api">

/*
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 */

type ExtensionPreferences = {
  /** API Base URL - Base URL of the Endurance API (e.g. http://localhost:8081) */
	"apiBaseUrl"?: string;
}

declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Command: Browse Classes */
	export type BrowseClasses = ExtensionPreferences & {
		
	}
}

declare namespace Arguments {
  /** Command: Browse Classes */
	export type BrowseClasses = {
		
	}
}