// ==UserScript==
// @name         GitHub - Add Shortcuts To Page Header
// @namespace    github-header-shortcuts
// @version      1.0.0
// @description  Adds a configurable toolbar to the GitHub header with shortcuts to Repositories, Stars, Gists, and more.
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/github-header-shortcuts/
// @supportURL   https://github.com/Vikindor/github-header-shortcuts/issues
// @license      MIT
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- CONFIG ----------------
  const CONFIG = {
    // Toggle buttons: set to 'true' to show, 'false' to hide
    profile:true,
    repositories: true,
    projects: true,
    packages: true,
    stars: true,
    gists: true,
    organizations: true,
    enterprises: true,
    settings: true,
    // Define the display order of buttons in the header
    order: ['profile', 'repositories', 'projects', 'packages', 'stars', 'gists', 'organizations', 'enterprises', 'settings'],
  };

  const ID_CONTAINER = 'gh-shortcuts-between-start-end';

  const injectCSS = () => {
    if (document.getElementById('gh-shortcuts-style')) return;
    const style = document.createElement('style');
    style.id = 'gh-shortcuts-style';
    style.textContent = `
      #${ID_CONTAINER}::after {
        content: "";
        display: block;
        width: 1px;
        height: 20px;
        background-color: var(--borderColor-default, #30363d);
        opacity: 0.6;
        align-self: center;
      }
    `;
    document.head.appendChild(style);
  };

  const getUserLogin = () =>
    document.querySelector('meta[name="user-login"]')?.getAttribute('content')?.trim() || '';

  const createContainer = () => {
    const wrap = document.createElement('div');
    wrap.id = ID_CONTAINER;
    wrap.className = 'd-flex flex-items-center gap-2 px-2';
    return wrap;
  };

  const resolveMountPoint = () => {
    const host = location.hostname;

    if (host === 'gist.github.com') {
      const bell = document.querySelector('notification-indicator, .notification-indicator');
      const bellItem = bell ? bell.closest('.Header-item') : null;
      if (bellItem && bellItem.parentElement) {
        return { parent: bellItem.parentElement, beforeNode: bellItem };
      }
      return { parent: null, beforeNode: null };
    }

    const end = document.querySelector('.AppHeader-globalBar-end');
    if (end && end.parentElement) {
      return { parent: end.parentElement, beforeNode: end };
    }

    return { parent: null, beforeNode: null };
  };

  const createButton = (info) => {
    const a = document.createElement('a');
    a.href = info.href(getUserLogin());
    a.className =
      'AppHeader-link d-flex flex-items-center gap-1 no-underline color-fg-muted hover-color-fg-default';
    a.style.margin = '0 5px';
    if (info.hotkey) a.setAttribute('data-hotkey', info.hotkey);
    a.title = info.tooltip || info.title;
    a.innerHTML = `
      <svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" class="octicon octicon-${info.icon}">
        <path d="${info.path}"></path>
      </svg>
      <span>${info.title}</span>
    `;
    return a;
  };

  const placeShortcuts = () => {
    if (document.getElementById(ID_CONTAINER)) return;

    const { parent, beforeNode } = resolveMountPoint();
    if (!parent || !beforeNode) return;

    const container = createContainer();

    (CONFIG.order || Object.keys(BUTTONS)).forEach((key) => {
      const info = BUTTONS[key];
      if (info && CONFIG[key]) container.appendChild(createButton(info));
    });

    injectCSS();
    parent.insertBefore(container, beforeNode);
  };

  // ---------------- BUTTON DEFINITIONS ----------------
  const BUTTONS = {
    profile: {
      title: 'Profile',
      tooltip: 'Profile (G + P)',
      icon: 'person',
      hotkey: 'g p',
      href: (user) => `https://github.com/${user}`,
      path: 'M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z',
    },
    repositories: {
      title: 'Repositories',
      tooltip: 'Repositories (G + R)',
      icon: 'repo',
      hotkey: 'g r',
      href: (user) => `https://github.com/${user}?tab=repositories`,
      path: 'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z',
    },
    projects: {
      title: 'Projects',
      tooltip: 'Projects (G + T)',
      icon: 'table',
      hotkey: 'g t',
      href: (user) => `https://github.com/${user}?tab=projects`,
      path: 'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z',
    },
    packages: {
      title: 'Packages',
      tooltip: 'Packages (G + K)',
      icon: 'package',
      hotkey: 'g k',
      href: (user) => `https://github.com/${user}?tab=packages`,
      path: 'm8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z',
    },
    stars: {
      title: 'Stars',
      tooltip: 'Stars (G + S)',
      icon: 'star',
      hotkey: 'g s',
      href: (user) => `https://github.com/${user}?tab=stars`,
      path: 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z',
    },
    gists: {
      title: 'Gists',
      tooltip: 'Gists (G + I)',
      icon: 'gist',
      hotkey: 'g i',
      href: (user) => `https://gist.github.com/${user}`,
      path: 'M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L10.69 8 9.22 6.53a.75.75 0 0 1 0-1.06ZM6.78 6.53 5.31 8l1.47 1.47a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-2-2a.75.75 0 0 1 0-1.06l2-2a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z',
    },
    organizations: {
      title: 'Organizations',
      tooltip: 'Organizations (G + O)',
      icon: 'organization',
      hotkey: 'g o',
      href: () => 'https://github.com/settings/organizations',
      path: 'M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z',
    },
    enterprises: {
      title: 'Enterprises',
      tooltip: 'Enterprises (G + E)',
      icon: 'globe',
      hotkey: 'g e',
      href: () => 'https://github.com/settings/enterprises',
      path: 'M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z',
    },
    settings: {
      title: 'Settings',
      tooltip: 'Settings (G + C)',
      icon: 'gear',
      hotkey: 'g c',
      href: () => 'https://github.com/settings/profile',
      path: 'M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z',
    },
  };
  // ----------------------------------------------------

  const observer = new MutationObserver(() => {
  if (!document.getElementById(ID_CONTAINER)) placeShortcuts();
  });

  placeShortcuts();
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
