/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Base URL - Base URL of the Endurance API (e.g. http://localhost:8081) */
  "apiBaseUrl": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `browse-classes` command */
  export type BrowseClasses = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `browse-classes` command */
  export type BrowseClasses = {}
}

