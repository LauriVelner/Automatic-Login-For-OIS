// ==UserScript==
// @name         Automatic Login for ÕIS
// @namespace    http://tampermonkey.net/
// @version      2025-03-01
// @description  Skript, mis automaatselt logib kasutaja ÕIS-i / Userscript, which automatically signs the user into their account
// @author       Lauri Velner
// @match        https://ois2.ut.ee/*
// @match        https://auth.ut.ee/*
// @match        https://moodle.ut.ee/*
// @match        https://login.microsoftonline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// ==/UserScript==


// To do: comments + make english logic more robust + make action dependant on current website
// Add saving passwords
// Make an extension
// Test for other browsers: chrome, safari, opera, edge, internet explorer
// Possibly make compatible for older versions/browsers
// Possibly add recommendation to update browser if too old
// "You signed out of your account" handling for login.microsoftonline

// Redirect from https://auth.ut.ee/idp/module.php/core/frontpage_welcome.php

// MutationObservers are optimized for monitoring changes to the DOM. They’re generally lightweight if you scope them to a limited subtree or specific mutations

/*
Look for ways to handle this error:
Content-Security-Policy: (Report-Only policy) The page’s settings would block an inline script (script-src-elem) from being executed because it violates the following directive: “script-src 'self'
'nonce-wyThVuLUmU-bbR3NQmtybg' 'unsafe-inline' 'unsafe-eval' https://*.msauth.net https://*.msftauth.net https://*.msftauthimages.net https://*.msauthimages.net https://*.msidentity.com
https://*.microsoftonline-p.com https://*.microsoftazuread-sso.com https://*.azureedge.net https://*.outlook.com https://*.office.com https://*.office365.com https://*.microsoft.com https://*.bing.com 'report-sample'”

*/
(function() {
    'use strict';

    // Prior to allowing access to your outlook mailbox, your authentication is checked
    // It's separate from the ÕIS auth., and has a time limit, necessitating you to
    // log back in after it expires. The issue is that there's an annoying log out screen it send you to
    // when it checks your authentication status and it turns out the authentification has expired
    // This fixes the issue, redirecting from the log out screen back to the mailbox.
    if (window.location.href.indexOf("https://login.microsoftonline.com/common/oauth2/logout") !== -1) {
        window.location.href = "https://outlook.office.com/mail/";
    }

    window.addEventListener('load', () => {
        // ÕIS auth page (https://auth.ut.ee/) accessed after clicking login
        const elementOISAuth = document.querySelector('[data-authsource-name="ut-azure"]');
        if (elementOISAuth != null) {
            elementOISAuth.click();
        }

        // Moodle login
        const elementMoodle = document.querySelector(".mb-0");
        if (elementMoodle != null) {
            elementMoodle.click();
        }
    });

    // ÕIS frontpage; remain logged in
    function addRecursiveListener() {
        window.addEventListener('load', () => {
            waitForElm('.mdc-button__label', "Jätka").then((elm) => {
                elm.click();
                addRecursiveListener();
            });
        });
    }
    addRecursiveListener();

    window.addEventListener('load', () => {
        waitForElm('.mdc-button__label', "Logi sisse").then((elm) => {
            elm.click();
        });
    });

    function waitForClickable(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const check = () => {
                const el = document.querySelector(selector);
                // Check if element exists, is visible, and not disabled
                if (el && el.offsetParent !== null && !el.disabled) {
                    resolve(el);
                } else {
                    elapsed += interval;
                    if (elapsed >= timeout) {
                        reject(new Error("Element not clickable after timeout"));
                    } else {
                        setTimeout(check, interval);
                    }
                }
            };
            check();
        });
    }

    var xpath = "//span[contains(text(),'Logi sisse')]";
    function waitForElm(selector, textSelector) {
        return new Promise(resolve => {
            if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                return resolve(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
            }

            const observer = new MutationObserver(mutations => {
                if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
                    observer.disconnect();
                    resolve(document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForElmBasic(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) {
                return resolve(el);
            }
            const observer = new MutationObserver(mutations => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    window.addEventListener('load', () => {
        const element = '[data-bind="text: ((session.isSignedIn || session.isSamsungSso) && session.unsafe_fullName) || session.unsafe_displayName"]'; // select account button
        waitForElmBasic(element).then((elm) => {
            elm.click();

            waitForClickable('#idSIButton9') // login button
                .then(el => {
                el.click();
            })
                .catch(err => console.error(err));
        });
    });

})();