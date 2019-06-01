// ==UserScript==
// @name         Nighthawk-Hook @ Krunker
// @version      2019.06.01
// @description  Be better.
// @author       Richard
// @updateURL    https://github.com/richardletshacks/nighthawk-hook/raw/master/script.user.js
// @downloadURL  https://github.com/richardletshacks/nighthawk-hook/raw/master/script.user.js
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(game|server|party)=.+)$/
// @grant        GM_xmlhttpRequest
// @namespace    nh
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// ==/UserScript==

// * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * *

const version = '2.0';

// * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * *

GM_xmlhttpRequest({
    method: "GET",
    url: document.location.origin,
    onload: res => {
        let html = res.responseText;
        html = html.replace(/game\.[^\.]+\.js/, '____.js');
        html = html.replace(/<script data-cfasync(.|\s)*?<\/script>/, `<meta name="nh_version" content="${version}">`);
        GM_xmlhttpRequest({
            method: "GET",
            url: document.location.origin + '/libs/zip.js',
            onload: res => {
                let zip = res.responseText;
                zip = zip.replace(/document\..+<\/div>"\)/, '');
                html = html.replace(/<script src="libs\/zip\.js.+"><\/script>/, `<script>${zip}</script>`);
                html += '<script src="https://raw.githubusercontent.com/richardletshacks/nighthawk-hook/master/bypass.js"></script>';
                html += '<script src="https://raw.githubusercontent.com/richardletshacks/nighthawk-hook/master/cheat.js"></script>';
                html += '<script src="https://raw.githubusercontent.com/richardletshacks/nighthawk-hook/master/game.js"></script>';

                document.open();
                document.write(html);
                document.close();
            }
        })
    }
})
