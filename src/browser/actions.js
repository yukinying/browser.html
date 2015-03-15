/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define((require, exports, module) => {

  'use strict';

  const url = require('./util/url');
  const {fromJS} = require('immutable');
  const {open} = require('./web-viewer/actions');
  const {select, active} = require('./deck/actions');
  const {initDashboard} = require('./dashboard/actions');
  // TODO: Should be `const {version} = require('package.json`);` instead but require.js
  // does not supports that.
  const version = '0.0.3';

  const makeSearchURL = input =>
    `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;


  const readInputURL = input =>
    url.isNotURL(input) ? makeSearchURL(input) :
    !url.hasScheme(input) ? `http://${input}` :
    input;

  // We'll hard-code dashboard items for now.
  const dashboardItems = [
    {image: 'tiles/facebook.com.png',
     uri: 'https://facebook.com',
     title: 'facebook.com'},
    {image: 'tiles/youtube.com.png',
     uri: 'https://youtube.com',
     title: 'youtube.com'},
    {image: 'tiles/amazon.com.png',
     uri: 'https://amazon.com',
     title: 'amazon.com'},
    {image: 'tiles/wikipedia.org.png',
     uri: 'https://wikipedia.org',
     title: 'wikipedia.org'},
    {image: 'tiles/twitter.com.png',
     uri: 'https://twitter.com',
     title: 'twitter.com'},
    {image: 'tiles/mail.google.com.png',
     uri: 'https://mail.google.com',
     title: 'mail.google.com'},
    {image: 'tiles/nytimes.com.png',
     uri: 'https://nytimes.com',
     title: 'nytimes.com'},
    {image: 'tiles/qz.com.png',
     uri: 'http://qz.com',
     title: 'qz.com'},
    {image: 'tiles/github.com.png',
     uri: 'https://github.com',
     title: 'github.com'},
    {image: 'tiles/dropbox.com.png',
     uri: 'https://dropbox.com',
     title: 'dropbox.com'},
    {image: 'tiles/linkedin.com.png',
     uri: 'https://linkedin.com',
     title: 'linkedin.com'},
    {image: 'tiles/yahoo.com.png',
     uri: 'https://yahoo.com',
     title: 'yahoo.com'}
  ];

  // Creates a blank session. Returns immutable map.
  const resetSession = () => fromJS({
    isDocumentFocused: document.hasFocus(),
    // TODO: `isFocuse` should be `true` but that causes
    // issues when app iframe isn't focused. Can be fixed
    // once #239 is resolved.
    input: {value: '', isFocused: false},
    tabStrip: {isActive: false},
    dashboard: initDashboard({items: dashboardItems}),
    rfa: {id: -1},
    suggestions: {
      selectedIndex: -1,
      list: []
    },
    webViewers: [open({id: "about:blank",
                       isPinned: true,
                       isSelected: true,
                       isActive: true,
                       isFocused: false})]
  });

  // Reads stored session. Returns either immutable data for the
  // session or null.
  const readSession = () => {
    try {
      return fromJS(JSON.parse(localStorage[`session@${version}`]));
    } catch(error) {
      return null;
    }
  };

  const writeSession = session => {
    session = session.toJSON();
    session.appUpdateAvailable = false;
    session.rfa.id = -1;
    localStorage[`session@${version}`] = JSON.stringify(session);
  };

  // Exports:

  exports.makeSearchURL = makeSearchURL;
  exports.readInputURL = readInputURL;
  exports.focus = focusable => focusable.set('isFocused', true);
  exports.blur = focusable => focusable.set('isFocused', false);
  exports.select = editable => editable.set('selection', {all: true});
  exports.showTabStrip = tabStripCursor =>
    tabStripCursor.set('isActive', true);
  exports.hideTabStrip = tabStripCursor =>
    tabStripCursor.set('isActive', false);
  exports.resetSession = resetSession;
  exports.readSession = readSession;
  exports.writeSession = writeSession;

});
