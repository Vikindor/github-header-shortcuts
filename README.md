<h1 align="center">
GitHub - Add Shortcuts To Page Header
</h1>

Userscript for browsers that adds a customizable shortcut bar to the GitHub and Gist page headers.
Places quick-access buttons (Profile, Repositories, Stars, Gists etc.) directly in the top navigation with tooltips and hotkey hints.

## ✨ Features

- Works on both **github.com** and **gist.github.com**
- Configurable set of header buttons in the `CONFIG` section
- Adjustable order via `CONFIG.order`
- Automatically restores after PJAX (SPA) navigations
- Tooltips display assigned keyboard shortcuts (for example **G + R**)
- Native GitHub styling and dark/light theme support

## 🖼 Screenshots

<p align="center">
  <img src="media/github_header.jpg" width="100%" alt="GitHub header shortcuts screenshot" title="GitHub header shortcuts"/>  
</p>

## 🚀 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or another userscript manager).  
2. Install the script from one of the mirrors:  
   - [GreasyFork](https://greasyfork.org/en/scripts/553502-github-add-shortcuts-to-page-header)  
   - [OpenUserJS](https://openuserjs.org/scripts/Vikindor/GitHub_-_Add_Shortcuts_To_Page_Header)  
   - or [download directly from this repository](./GitHub_-_Add_Shortcuts_To_Page_Header.js).

## 🔧 Configuration

Open the script in your userscript manager and adjust the config block at the top:

```js
const CONFIG = {
  profile: true,
  repositories: true,
  projects: true,
  packages: true,
  stars: true,
  gists: true,
  organizations: true,
  enterprises: true,
  settings: true,
  order: ['profile','repositories','projects','packages','stars','gists','organizations','enterprises','settings'],
};
```

true / false — toggle visibility of each button

order — controls display order

## 📦 Available Buttons

| Button | Shortcut | Destination |
|:--|:--|:--|
| **Profile** | G + P | `https://github.com/<user>` |
| **Repositories** | G + R | `https://github.com/<user>?tab=repositories` |
| **Projects** | G + T | `https://github.com/<user>?tab=projects` |
| **Packages** | G + K | `https://github.com/<user>?tab=packages` |
| **Stars** | G + S | `https://github.com/<user>?tab=stars` |
| **Gists** | G + I | `https://gist.github.com/<user>` |
| **Organizations** | G + O | `https://github.com/settings/organizations` |
| **Enterprises** | G + E | `https://github.com/settings/enterprises` |
| **Settings** | G + C | `https://github.com/settings/profile` |

## 📄 License

[MIT License](LICENSE) © [Vikindor](https://vikindor.github.io/)
