---
layout: main.liquid
title: bookmarks
meta-description: chromium bookmarks 
page_css: | 
    <style>
    /* Add some basic styling */
    ul { 
        list-style-type: none; 
        margin: 0; 
        padding: 0; 
    }
    li { 
        margin: 5px 0; 
    }
    .folder > ul {
        display: none;
        padding-left: 20px;
    }
    .folder.expanded > ul {
        display: block;
    }
    .toggle-button {
        cursor: pointer;
        user-select: none;
        margin-right: 5px;
    }
    </style>
page_js: |
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
  <script src="../_js/bookmarks.js"></script>
---

<h1>Bookmarks</h1>
<ul id="bookmarks"></ul>