    // ==UserScript==
// @name         Nighthawk-Hook @ Krunker.io
// @version      1.0.1
// @description  Be better.
// @author       Richard
// @namespace    Richard
// @updateURL    https://github.com/richardletshacks/nighthawk-hook/raw/master/script.user.js
// @downloadURL  https://github.com/richardletshacks/nighthawk-hook/raw/master/script.user.js
// @match        *://krunker.io/*
// @grant        GM_xmlhttpRequest
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// ==/UserScript==

if (window.location.href.includes("krunker")) {

  var checkgameloaded;
  unsafeWindow.checkgame=false;
  window.WebSocket.prototype.oldSend = WebSocket.prototype.send;
  window.WebSocket.prototype.send = function(m){
        if (!checkgameloaded){
          inject(this);
        }
        this.oldSend(m);
  }

window.chatmessage = window.Ze = (t, e, i) => {
        for (chatList.innerHTML += i ? "<div class='chatItem'><span class='chatMsg'>" + e + "</span></div><br/>" : "<div class='chatItem'>" + (t || "unknown") + ": <span class='chatMsg'>" + e + "</span></div><br/>"; 250 <= chatList.scrollHeight;) chatList.removeChild(chatList.childNodes[0])
    }

  function inject(socket){
    window.socket = socket;
    checkgameloaded = socket;

    window.chatmessage("Nighthawk", 'Welcome to the cheat! All modules are located on your right, directly beneath the leaderboard.');
    $("#healthHolder").append('<a style=\"color:green;top:1520px;\">hooked$</a>');
  }
var OnOffMode;
(function (OnOffMode) {
    OnOffMode["On"] = "<span style=\"color:green;\">ON</span>";
    OnOffMode["Off"] = "<span style=\"color:gray;\">OFF</span>";
})(OnOffMode || (OnOffMode = {}));
var AimwallMode;
(function (AimwallMode) {
    AimwallMode["On"] = "<span style=\"color:green;\">ON</span>";
    AimwallMode["Off"] = "<span style=\"color:gray;\">OFF</span>";
})(AimwallMode || (AimwallMode = {}));
class Module {
    constructor() {
        this.allStates = this.getAllModes();
        this.currentModeIndex = this.allStates.indexOf(this.getInitialMode());
    }
    onModeChanged() {
        // Let implementations override this if needed
    }
    onTick() {
        // Let implementations override this if needed
    }
    getInitialMode() {
        return this.allStates[0];
    }
    onKeyPressed() {
        this.currentModeIndex++;
        if (this.currentModeIndex >= this.allStates.length) {
            this.currentModeIndex = 0;
        }
        this.onModeChanged();
    }
    isEnabled() {
        return this.currentModeIndex !== 0;
    }
    getStatus() {
        return this.allStates[this.currentModeIndex].toString();
    }
    getCurrentMode() {
        return this.allStates[this.currentModeIndex];
    }
}

var AimbotMode;
(function (AimbotMode) {
    AimbotMode["Off"] = "<span style=\"color:gray;\">OFF</span>";
    AimbotMode["Quickscoper"] = "Quickscoper";
        AimbotMode["Trigscoper"] = "Triggerbot";
    AimbotMode["OnRMB"] = "On RMB";
            AimbotMode["HipFire"] = "Hip Fire";
})(AimbotMode || (AimbotMode = {}));
class Aimbot extends Module {
    constructor() {
        super(...arguments);
        this.scopingOut = false;
        this.canShoot = true;
    }
    getName() {
        return 'Aimbot';
    }
    getKey() {
        return 'I';
    }
    getAllModes() {
        return [AimbotMode.Off, AimbotMode.Quickscoper, AimbotMode.Trigscoper, AimbotMode.OnRMB, AimbotMode.HipFire];
    }
    onTick() {
        if (!this.players) {
            return;
        }
        const possibleTargets = this.players
        .filter(player => {
            if (unsafeWindow.aimwaller == true) {
                return player.active && !player.isYou && (!player.team || player.team !== this.me.team);
            } else {
                return player.active && player.inView && !player.isYou && (!player.team || player.team !== this.me.team);
            }
        })
            .sort((p1, p2) => this.distance(this.me, p1) - this.distance(this.me, p2));
        let isLockedOn = false;
        if (possibleTargets.length > 0) {
            const target = possibleTargets[0];
            switch (this.getCurrentMode()) {
                case AimbotMode.Quickscoper:
                    isLockedOn = this.runQuickscoper(target);
                    break;
                case AimbotMode.Trigscoper:
                    isLockedOn = this.runTrigscoper(target);
                    break;
                case AimbotMode.OnRMB:
                    isLockedOn = this.runOnRMB(target);
                    break;
                case AimbotMode.HipFire:
                    isLockedOn = this.runHipFire(target);
                    break;
            }
        }
        if (!isLockedOn) {
            this.control.camLookAt(null);
            this.control.target = null;
            if (this.getCurrentMode() === AimbotMode.Quickscoper) {
                this.control.mouseDownL = 0;
                this.control.mouseDownR = 0;
            } else if (this.getCurrentMode() === AimbotMode.Trigscoper) {
                this.control.mouseDownL = 0;
                this.control.mouseDownR = 0;
            }
        }
    }
    runTrigscoper(target) {
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
        }
        if (this.me.recoilForce > 0.01) {
            return false;
        }
        this.lookAt(target);
                    if (this.control.mouseDownR !== 1) {
                    this.control.mouseDownR = 1;
                } else {
                    this.control.mouseDownL = this.control.mouseDownL === 1 ? 0 : 1
                }
        return true;
    }
    runQuickscoper(target) {
        if (this.me.didShoot) {
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.me.weapon.rate);
        }
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
            this.scopingOut = true;
        }
        if (this.me.aimVal === 1) {
            this.scopingOut = false;
        }
        if (this.scopingOut || !this.canShoot || this.me.recoilForce > 0.01) {
            return false;
        }
        this.lookAt(target);
        if (this.control.mouseDownR === 0) {
            this.control.mouseDownR = 1;
        }
        else if (this.me.aimVal < 0.2) {
            this.control.mouseDownL = 1 - this.control.mouseDownL;
        }
        return true;
    }
    runOnRMB(target) {
        if (this.control.mouseDownR === 0) {
            return false;
        }
        this.lookAt(target);
        return true;
    }
    runHipFire(target) {
        this.lookAt(target);
        return true;
    }
    lookAt(target) {
        this.control.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - this.me.recoilAnimY * 0.3 * 25, target.z2);
    }
    aimAt(target) {
        this.control.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - this.me.recoilAnimY * 0.3 * 25, target.z2);
    }
    distance(player1, player2) {
        const dx = player1.x - player2.x;
        const dy = player1.y - player2.y;
        const dz = player1.z - player2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

var BHopMode;
(function (BHopMode) {
    BHopMode["Off"] = "<span style=\"color:gray;\">OFF</span>";
    BHopMode["Jump"] = "Jump";
    BHopMode["SlideJump"] = "Slide Jump";
})(BHopMode || (BHopMode = {}));
class AutoBHop extends Module {
    constructor() {
        super(...arguments);
        this.isSliding = false;
    }
    getName() {
        return 'Auto BHop';
    }
    getKey() {
        return 'B';
    }
    getAllModes() {
        return [BHopMode.Off, BHopMode.Jump, BHopMode.SlideJump];
    }
    onTick() {
        this.control.keys[32] = !this.control.keys[32];
        if (this.getCurrentMode() === BHopMode.SlideJump) {
            if (this.isSliding) {
                this.inputs[8] = 1;
                return;
            }
            if (this.me.yVel < -0.04 && this.me.canSlide) {
                this.isSliding = true;
                setTimeout(() => {
                    this.isSliding = false;
                }, 350);
                this.inputs[8] = 1;
            }
        }
    }
}

class AimWalls extends Module {
    getName() {
        return 'Aim Through Walls';
    }
    getKey() {
        return 'R';
    }
    getAllModes() {
        return [AimwallMode.Off, AimwallMode.On];
    }
    getInitialMode() {
        unsafeWindow.aimwaller = false;
        return AimwallMode.Off;
    }
    onModeChanged() {
        unsafeWindow.aimwaller = this.getCurrentMode() === AimwallMode.On;
    }
}



class AutoWeaponSwap extends Module {
    getName() {
        return 'Auto Weapon Swap';
    }
    getKey() {
        return 'H';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
if (this.me.ammos[this.me.weaponIndex] === 0 && this.me.ammos[0] != this.me.ammos[1]) {
            this.inputs[10] = -1
        }
    }
}

class AutoReload extends Module {
    getName() {
        return 'Auto Reload';
    }
    getKey() {
        return 'J';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.On;
    }
    onTick() {
      if (this.me.ammos[this.me.weaponIndex] === 0) {
            this.inputs[9] = 1;
        }
    }
}

class NoRecoil extends Module {
    getName() {
        return 'No Recoil';
    }
    getKey() {
        return 'G';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
        this.me.recoilAnimYOld = this.me.recoilAnimY;
        this.me.recoilAnimY = 0;
    }
}

class UnlimitedAmmo extends Module {
    getName() {
        return 'Unlimited Ammo';
    }
    getKey() {
        return 'L';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
        this.me.ammos[this.me.weaponIndex]=101
    }
}

class SpeedHack extends Module {
    getName() {
        return 'Speed Hack';
    }
    getKey() {
        return 'K';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
this.inputs[1] *= 1.25;
    }
}


class WallHack extends Module {
    getName() {
        return 'Wall Hack';
    }
    getKey() {
        return 'O';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        unsafeWindow.wallHackEnabled = true;
        return OnOffMode.On;
    }
    onModeChanged() {
        unsafeWindow.wallHackEnabled = this.getCurrentMode() === OnOffMode.On;
    }
}

class Menu {
    constructor() {
        this.modules = [];
    }
    init() {
        this.modules.push(new Aimbot());
        this.modules.push(new AutoReload());
        this.modules.push(new UnlimitedAmmo());
        this.modules.push(new AimWalls());
        this.modules.push(new AutoWeaponSwap());
        this.modules.push(new NoRecoil());
        this.modules.push(new SpeedHack());
        this.modules.push(new WallHack());
        this.modules.push(new AutoBHop());
        const initGUIInterval = setInterval(() => {
            if (this.canInjectGUI()) {
                clearInterval(initGUIInterval);
                this.injectGUI();
                this.updateGUI();
            }
        }, 100);
    }
    onTick(me, inputs) {
        this.modules.forEach(module => {
            if (module.isEnabled()) {
                module.me = me;
                module.inputs = inputs;
                module.control = unsafeWindow.control;
                module.players = unsafeWindow.players;
                module.onTick();
            }
        });
    }
    onKeyPressed(e) {
        let shouldUpdateGUI = false;
        this.modules.forEach(module => {
            if (module.getKey().toUpperCase() === e.key.toUpperCase()) {
                module.onKeyPressed();
                shouldUpdateGUI = true;
            }
        });
        if (shouldUpdateGUI) {
            this.updateGUI();
        }
    }
    updateGUI() {
        const GUI = unsafeWindow.document.querySelector('#nighthawkGUI');
        if (GUI === null) {
            return;
        }
        const moduleLines = this.modules.map(module => {
            return `
        <div class="leaderItem">
          <div class="leaderNameF">${module.getKey().toUpperCase()} - ${module.getName()}</div>
          <div class="leaderScore">${module.getStatus()}</div>
        </div>
      `;
        });
        GUI.innerHTML = `
      <div class="menutitle">Nighthawk-Hook</div>
      ${moduleLines.join('')}
    `.trim();
    }
    injectGUI() {
        const GUI = unsafeWindow.document.createElement('div');
        GUI.innerHTML = `
      <div>
        <style>
          #nighthawkGUI {
            text-align: left;
            width: 310px;
            z-index: 3;
            padding: 10px;
            padding-left: 20px;
            padding-right: 20px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 25px;
            margin-top: 20px;
            background-color: rgba(0, 0, 0, 0.2);
          }

          #nighthawkGUI .menutitle {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            color: #fff;
            margin-top: 5px;
            margin-bottom: 5px;
          }

          #nighthawkGUI .leaderItem {
           font-size: 14px;
          }
        </style>

        <div id="nighthawkGUI"></div>
      </div>
    `.trim();
        const leaderDisplay = unsafeWindow.document.querySelector('#leaderDisplay');
        leaderDisplay.parentNode.insertBefore(GUI.firstChild, leaderDisplay.nextSibling);
    }
    canInjectGUI() {
        return unsafeWindow.document.querySelector('#leaderDisplay') !== null;
    }
}
// tslint:disable no-console
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }
    log(...message) {
        console.log(this.prefix, ...message);
    }
    error(...message) {
        console.error(this.prefix, ...message);
    }
    crash(message) {
        document.open();
        document.write(`
      <html lang="en">
        <body>
          <div class="container">
            <div class="title">Cheat crashed!</div>
            <div class="message">Error message: ${message}</div>
            <div class="message">Please report bugs on Discord: richard#1337</div>
          </div>
        </body>
      </html>
    `);
        document.close();
        throw new Error(`${this.prefix} ${message}`);
    }
}
const logger = new Logger('[Menu]');

function applyPatch(script, method, regex, replacer) {
    const newScript = script.replace(regex, replacer);
    if (script === newScript) {
        logger.crash(`${method} was not successful`);
    }
    return newScript;
}
function patchControl(script) {
    return applyPatch(script, 'patchControl', /var ([a-zA-Z0-9]+)=this,([a-zA-Z0-9]+)=([a-zA-Z0-9]+)\.renderer\.domElement/, ($0, $1, $2, $3) => {
        return `var ${$1} = window.control = this, ${$2} = ${$3}.renderer.domElement;`;
    });
}
function patchPlayers(script) {
    return applyPatch(script, 'patchPlayers', /if\(this\.now/, 'window.players = this.players.list; if (this.now');
}
function patchOnTick(script) {
    return applyPatch(script, 'patchOnTick', /,([a-zA-Z0-9]+)\.procInputs\(([a-zA-Z0-9]+)/, ($0, $1, $2) => {
        return `, window.onTick(${$1}, ${$2}), ${$1}.procInputs(${$2}`;
    });
}
function patchOnKeyPressed(script) {
    return applyPatch(script, 'patchOnKeyPressed', /"keyup",function\(([a-zA-Z0-9]+)\){/, ($0, $1) => {
        return `"keyup", function (${$1}) { if (document.activeElement !== chatInput) { window.onKeyPressed(${$1}); }`;
    });
}
function patchForAimbot(script) {
      return applyPatch(script, 'patchForAimbot', /{if\(this\.target\){(.+)}},this.camLookAt=/, ($0, $1) => {
        return `
      {
        if (this.target) {
          this.object.rotation.y = this.target.yD;
          this.pitchObject.rotation.x = this.target.xD;

          const half = Math.PI / 2;
          this.pitchObject.rotation.x = Math.max(-half, Math.min(half, this.pitchObject.rotation.x));

          this.yDr = this.pitchObject.rotation.x % Math.PI;
          this.xDr = this.object.rotation.y % Math.PI;

          ${$1}
        }
      }, this.camLookAt =
    `;
    });
}
function patchForWallHack(script) {
    return applyPatch(script, 'patchForWallHack', /if\(([a-zA-Z0-9]+)\.inView\){(.+)}else ([a-zA-Z0-9]+)\.style\.display="none"}var ([a-zA-Z0-9]+);/, ($0, $1, $2, $3, $4) => {
        return `
      if (${$1}.inView || window.wallHackEnabled) {
        ${$2}
      } else ${$3}.style.display = "none"
      } var ${$4};
    `;
    });
}
function patchIsHacker(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9]+)\.isHacker&&/, `&& 1 === 0 &&`);
}
function patchLastHack(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9]+)\.lastHack&&/, `&& 1 === 0 &&`);
}
function patchServerSearch(script) {
    return applyPatch(script, 'patchServerSearch', /([a-zA-Z0-9]+)\.data\.([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)\.toLowerCase/, ($0, $1, $2) => {
        return `(${$1}.data.${$2} || '').toLowerCase`;
    });
}
function patchStyleErrors(script) {
    return applyPatch(script, 'patchStyleErrors', /else document\.getElementById\("healthBarE"\+([a-zA-Z0-9]+)\)\.style\.width=([a-zA-Z0-9]+)\+"%"/, ($0, $1, $2) => {
        return `else (document.getElementById("healthBarE" + ${$1}) || { style: {} }).style.width = ${$2} + "%"`;
    });
}
function patchGameScript(script) {
    logger.log('Patching the game script...');
    script = patchControl(script);
    script = patchPlayers(script);
    script = patchOnTick(script);
    script = patchOnKeyPressed(script);
    script = patchForAimbot(script);
    script = patchForWallHack(script);
    script = patchIsHacker(script);
    script = patchLastHack(script);
    script = patchServerSearch(script);
    script = patchStyleErrors(script);
    logger.log('Successfully patched the game script!');
    return script;
}

function request(url) {
    return new Promise(resolve => {
        logger.log(`Retrieving ${url}`);
        GM_xmlhttpRequest({
            url,
            method: 'GET',
            onload: response => resolve(response.responseText),
        });
    });
}

function replaceRemoteScriptWithInline(html, partialSrc, script) {
    const inline = `<script type="text/javascript">${script}</script>`;
    const regExp = new RegExp(`<script src="[^"]*${partialSrc}[^"]*"></script>`);
    const withoutScriptTag = html.replace(regExp, '');
    return withoutScriptTag + inline;
}
async function inlineRemoteScript(html, partialSrc) {
    const regExp = new RegExp(`<script src="([^"]*)${partialSrc}([^"]*)"></script>`);
    const [, prefix, suffix] = regExp.exec(html);
    const script = await request(prefix + partialSrc + suffix);
    return replaceRemoteScriptWithInline(html, partialSrc, script);
}

(async () => {
    window.stop();
    logger.log('Loading Cheats');
    let newHtml = await request(document.location.href);
    const gameScriptHash = /game\.([^\.]+)\.js/.exec(newHtml)[1];
    const gameScript = await request(`https://krunker.io/js/game.${gameScriptHash}.js`);
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip.js');
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip-ext.js');
    logger.log('Patching Libraries');
    newHtml = replaceRemoteScriptWithInline(newHtml, 'js/game', patchGameScript(gameScript));
    const bot = new Menu();
    logger.log('Initiating Menu');
    bot.init();
    unsafeWindow.onTick = (me, inputs) => bot.onTick(me, inputs);
    unsafeWindow.onKeyPressed = (e) => bot.onKeyPressed(e);
    document.open();
    document.write(newHtml);
    document.close();
    logger.log('Successfully loaded Cheats!');

    let char_list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const chars = ['$','%','#','@','&','(',')','=','*','/'];
    const charsTotal = chars.length;
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let title = 'nighthawk-hook $';
    let i = 0;
    setInterval(() => {
	// document.title = chars[getRandomInt(0, charsTotal - 1)];
	// document.title = title.substring(0, i + 1);
	document.title = title.substring(0, i + 1);
	// document.title = chars[getRandomInt(0, charsTotal - 1)];
	if (i == 0) {
		direction = 1;
	} else if (i == title.length) {
		direction = -1;
	}
	i += direction;
    }, 300);

})();
}
