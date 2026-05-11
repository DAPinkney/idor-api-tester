/ ==UserScript==
// @name         API Request Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lightweight API request tool for authorized testing
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.id = 'api-tool';
    Object.assign(container.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '400px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: '999999',
        color: '#ccc',
        display: 'none',
        padding: '12px'
    });

    container.innerHTML = `
        <div style="display:flex; gap:6px; margin-bottom:8px">
            <select id="at-method" style="background:#111; color:#ccc; border:1px solid #333; border-radius:4px; padding:4px">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
            </select>
            <input id="at-url" placeholder="https://example.com/api/users/1042" style="flex:1; background:#111; color:#ccc; border:1px solid #333; border-radius:4px; padding:4px 8px" />
            <button id="at-send" style="background:transparent; color:#4a9eff; border:1px solid #4a9eff; border-radius:4px; padding:4px 12px; cursor:pointer">Send</button>
        </div>
        <div style="margin-bottom:6px; font-size:10px; color:#666">HEADERS</div>
        <input id="at-csrf" placeholder="x-csrf-token value" style="width:100%; background:#111; color:#ccc; border:1px solid #333; border-radius:4px; padding:4px 8px; margin-bottom:6px" />
        <input id="at-cookie" placeholder="cookie value (optional)" style="width:100%; background:#111; color:#ccc; border:1px solid #333; border-radius:4px; padding:4px 8px; margin-bottom:8px" />
        <div style="margin-bottom:6px; font-size:10px; color:#666">BODY (JSON)</div>
        <textarea id="at-body" placeholder='{"operationName": "GetUserCourses", "variables": {"userID": "00000"}}' style="width:100%; height:70px; background:#111; color:#ccc; border:1px solid #333; border-radius:4px; padding:4px 8px; resize:vertical; margin-bottom:8px"></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
            <div style="font-size:10px; color:#666">RESPONSE</div>
            <div id="at-status" style="font-size:10px"></div>
        </div>
        <pre id="at-response" style="background:#111; border:1px solid #333; border-radius:4px; padding:8px; margin:0; white-space:pre-wrap; word-break:break-all; max-height:200px; overflow-y:auto; font-size:11px; color:#ccc">Waiting...</pre>
        <div style="display:flex; gap:6px; margin-top:8px">
            <button onclick="document.getElementById('at-response').innerText='Waiting...'" style="background:transparent; color:#666; border:1px solid #333; border-radius:4px; padding:3px 8px; cursor:pointer; font-size:11px">Clear</button>
            <button onclick="navigator.clipboard.writeText(document.getElementById('at-response').innerText)" style="background:transparent; color:#666; border:1px solid #333; border-radius:4px; padding:3px 8px; cursor:pointer; font-size:11px">Copy</button>
        </div>
    `;

    document.body.appendChild(container);

    document.getElementById('at-send').addEventListener('click', async () => {
        const method = document.getElementById('at-method').value;
        const url = document.getElementById('at-url').value.trim();
        const csrf = document.getElementById('at-csrf').value.trim();
        const cookie = document.getElementById('at-cookie').value.trim();
        const body = document.getElementById('at-body').value.trim();
        const res = document.getElementById('at-response');
        const status = document.getElementById('at-status');

        if (!url) { res.innerText = 'Enter a URL'; return; }

        res.innerText = 'Sending...';
        status.innerText = '';

        const headers = { 'content-type': 'application/json' };
        if (csrf) headers['x-csrf-token'] = csrf;
        if (cookie) headers['cookie'] = cookie;

        const start = Date.now();

        GM_xmlhttpRequest({
            method,
            url,
            headers,
            data: body && method !== 'GET' ? body : undefined,
            onload: function(response) {
                const elapsed = Date.now() - start;
                status.innerText = response.status + ' — ' + elapsed + 'ms';
                status.style.color = response.status < 400 ? '#4caf50' : '#f44336';
                try {
                    res.innerText = JSON.stringify(JSON.parse(response.responseText), null, 2);
                } catch {
                    res.innerText = response.responseText;
                }
            },
            onerror: function(err) {
                status.innerText = 'Error';
                status.style.color = '#f44336';
                res.innerText = JSON.stringify(err);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'A') {
            const visible = container.style.display === 'block';
            container.style.display = visible ? 'none' : 'block';
        }
    });

})();
