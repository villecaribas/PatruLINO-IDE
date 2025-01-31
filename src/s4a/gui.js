// userMenu proxy

SpriteIconMorph.prototype.originalUserMenu = SpriteIconMorph.prototype.userMenu;
SpriteIconMorph.prototype.userMenu = function () {
    menu = this.originalUserMenu();
    menu.addLine();
    var myself = this;
    menu.addItem(
        'connect to Arduino',
        function () {
            myself.object.arduino.attemptConnection();
        });
    menu.addItem(
        'disconnect Arduino',
        function () {
            myself.object.arduino.disconnect();
        });
    return menu;
};

// Snap! menus
// Adding Snap4Arduino extra options to snapMenu, projectMenu and settingsMenu

IDE_Morph.prototype.originalSnapMenu = IDE_Morph.prototype.snapMenu;
IDE_Morph.prototype.snapMenu = function () {
    this.originalSnapMenu();
    var menu = this.world().activeMenu;

    // adding s4a items
    menu.addLine();
    menu.addItem('About Snap4Arduino...', 'aboutSnap4Arduino');
    menu.addLine();
    menu.addItem('Snap4Arduino website',
        function () {
            window.open('http://snap4arduino.rocks', 'Snap4ArduinoWebsite');
        }
    );
    menu.addItem('Snap4Arduino repository',
        function () {
            window.open('http://github.com/bromagosa/Snap4Arduino', 'SnapSource');
        }
    );

    menu.popup(this.world(), this.logo.bottomLeft());
};

IDE_Morph.prototype.originalSettingsMenu = IDE_Morph.prototype.settingsMenu;
IDE_Morph.prototype.settingsMenu = function () {
    this.originalSettingsMenu();
    var menu = this.world().activeMenu,
        pos = this.controlBar.settingsButton.bottomLeft();

    // adding extra s4a items only for Desktop version
    if (typeof process === 'object') {
        menu.addLine();
        // http server option
        menu.addItem(
            (this.isServerOn ? '\u2611 ' : '\u2610 ') + localize('HTTP server'),
            'toggleServer',
            this.isServerOn ? 'uncheck to stop\nHTTP server' : 'check to start\nHTTP server, allowing\nremote control\nof Snap4Arduino'
        );
        if (this.isServerOn) {
            menu.addItem(
                (this.isStagePublic ? '\u2611 ' : '\u2610 ') + localize('Public stage'),
                'togglePublicStage',
                this.isStagePublic ? 'uncheck to prevent the stage\nfrom being viewed\nfrom the HTTP server' : 'check to allow the stage\nto be viewed\nfrom the HTTP server'
            );
        }
        // network serial port option
        menu.addItem(
            (Arduino.prototype.networkPortsEnabled ? '\u2611 ' : '\u2610 ') + localize('Network serial ports'),
            function () {
                Arduino.prototype.networkPortsEnabled = !Arduino.prototype.networkPortsEnabled;
                if (Arduino.prototype.networkPortsEnabled) {
                    this.saveSetting('network-ports-enabled', true);
                } else {
                    this.removeSetting('network-ports-enabled');
                }
            },
            Arduino.prototype.networkPortsEnabled ? 'uncheck to disable\nserial ports over\nnetwork' : 'check to enable\nserial ports over\nnetwork'
        );

    }
    //Uploading firmware menus for all versions
    var iframe = document.getElementById('firmwareUploader'),
        toneButton = iframe.contentWindow.document.getElementById('UNO_FirmataSA5Tone'),
        irButton = iframe.contentWindow.document.getElementById('UNO_FirmataSA5Ir'),
        npButton = iframe.contentWindow.document.getElementById('UNO_FirmataNeopixel'),
        stButton = iframe.contentWindow.document.getElementById('UNO_FirmataSt'),
        firmwaresMenu = function () {
            var menu = new MenuMorph(this, "Firmwares");
            menu.addItem('FirmataSA5 tone (recomended)', function () { toneButton.click() });
            menu.addItem('FirmataSA5 ir', function () { irButton.click() });
            menu.addItem('Firmata neopixel', function () { npButton.click() });
            menu.addItem('Firmata Standard', function () { stButton.click() });
            return menu;
        };

    menu.addLine();
    menu.addMenu('Upload firmware on UNO boards', firmwaresMenu());
    menu.addItem('More supported devices',
        function () {
            window.open('https://snap4arduino.rocks/#devices', 'Snap4ArduinoWebsite');
        });
    if (typeof process !== 'object') {
        menu.addItem('Snap4Arduino connector required',
            function () {
                window.open('https://snap4arduino.rocks/#install', 'Snap4ArduinoWebsite');
            });
    }
    menu.popup(this.world(), pos);
};

IDE_Morph.prototype.originalProjectMenu = IDE_Morph.prototype.projectMenu;
IDE_Morph.prototype.projectMenu = function () {
    this.originalProjectMenu();
    var menu = this.world().activeMenu,
        pos = this.controlBar.projectButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    // adding s4a items
    menu.addLine();
    menu.addItem('Open from URL...', 'openFromUrl');
    menu.addItem('Save, share and get URL...', 'saveAndShare');
    menu.addLine();
    menu.addItem(
        'New Arduino translatable project',
        'createNewArduinoProject',
        'Experimental feature!\nScripts written under this\n'
        + 'mode will be translatable\nas Arduino sketches'
    );
    menu.addLine();
    menu.addItem(
        'Start a Snap Jr. session',
        'startSnapJr',
        'Start Snap4Arduino in an\nicon-based blocks mode\n'
        + 'for the youngest programmers'
    );

    menu.popup(this.world(), pos);
};

IDE_Morph.prototype.originalApplySavedSettings = IDE_Morph.prototype.applySavedSettings;
IDE_Morph.prototype.applySavedSettings = function () {
    this.originalApplySavedSettings();

    if (this.getSetting('network-ports-enabled')) {
        Arduino.prototype.networkPortsEnabled = true;
    } else {
        Arduino.prototype.networkPortsEnabled = false;
    }

    Arduino.prototype.hostname = this.getSetting('network-serial-hostname') || 'tcp://arduino.local:23';
};

IDE_Morph.prototype.fileImport = function () {
    var myself = this,
        inp = document.createElement('input');
    if (this.filePicker) {
        document.body.removeChild(myself.filePicker);
        this.filePicker = null;
    }
    inp.type = 'file';
    inp.style.color = "transparent";
    inp.style.backgroundColor = "transparent";
    inp.style.border = "none";
    inp.style.outline = "none";
    inp.style.position = "absolute";
    inp.style.top = "0px";
    inp.style.left = "0px";
    inp.style.width = "0px";
    inp.style.height = "0px";
    inp.addEventListener(
        "change",
        function () {
            document.body.removeChild(inp);
            myself.filePicker = null;
            world.hand.processDrop(inp.files);
        },
        false
    );
    document.body.appendChild(inp);
    this.filePicker = inp;
    inp.click();
};

//Not decorated because we want to show original Snap! logo
// Only two lines (marked) are changed from original repo
IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'Snap! 8.1.0-dev\nBuild Your Own Blocks\n\n'//Sn4A mod
        + 'Copyright \u24B8 2008-2022 Jens M\u00F6nig and '
        + 'Brian Harvey\n'
        + 'jens@moenig.org, bh@cs.berkeley.edu\n\n'
        + '        Snap! is developed by the University of California, '
        + 'Berkeley and SAP        \n'
        + 'with support from the National Science Foundation (NSF),\n'
        + 'MIOsoft and YC Research.\n'
        + 'The design of Snap! is influenced and inspired by Scratch,\n'
        + 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

        + 'for more information see https://snap.berkeley.edu';

    noticeTxt = localize('License')
        + '\n\n'
        + 'Snap! is free software: you can redistribute it and/or modify\n'
        + 'it under the terms of the GNU Affero General Public License as\n'
        + 'published by the Free Software Foundation, either version 3 of\n'
        + 'the License, or (at your option) any later version.\n\n'

        + 'This program is distributed in the hope that it will be useful,\n'
        + 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
        + 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
        + 'GNU Affero General Public License for more details.\n\n'

        + 'You should have received a copy of the\n'
        + 'GNU Affero General Public License along with this program.\n'
        + 'If not, see http://www.gnu.org/licenses/\n\n'

        + 'Want to use Snap! but scared by the open-source license?\n'
        + 'Get in touch with us, we\'ll make it work.';

    creditsTxt = localize('Contributors')
        + '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
        + '\ncountless bugfixes and optimizations'
        + '\nMichael Ball: Time/Date UI, Library Import Dialog,'
        + '\ncountless bugfixes and optimizations'
        + '\nBernat Romagosa: Countless contributions'
        + '\nBartosz Leper: Retina Display Support'
        + '\nDariusz Dorożalski: Web Serial Support'
        + '\nZhenlei Jia and Dariusz Dorożalski: IME text editing'
        + '\nKen Kahn: IME support and countless other contributions'
        + '\nJosep Ferràndiz: Video Motion Detection'
        + '\nJoan Guillén: Countless contributions'
        + '\nKartik Chandra: Paint Editor'
        + '\nCarles Paredes: Initial Vector Paint Editor'
        + '\n"Ava" Yuan Yuan, Dylan Servilla: Graphic Effects'
        + '\nKyle Hotchkiss: Block search design'
        + '\nBrian Broll: Many bugfixes and optimizations'
        + '\nEckart Modrow: SciSnap! Extension'
        + '\nBambi Brewer: Birdbrain Robotics Extension Support'
        + '\nGlen Bull & team: TuneScope Music Extension'
        + '\nIan Reynolds: UI Design, Event Bindings, '
        + 'Sound primitives'
        + '\nJadga Hügle: Icons and countless other contributions'
        + '\nSimon Walters & Xavier Pi: MQTT extension'
        + '\nIvan Motyashov: Initial Squeak Porting'
        + '\nLucas Karahadian: Piano Keyboard Design'
        + '\nDavide Della Casa: Morphic Optimizations'
        + '\nAchal Dave: Web Audio'
        + '\nJoe Otto: Morphic Testing and Debugging'
        + '\n\n'
        + 'Jahrd, Derec, and Jamet costumes are watercolor paintings'
        + '\nby Meghan Taylor and represent characters from her'
        + '\nwebcomic Prophecy of the Circle, licensed to us only'
        + '\nfor use in Snap! projects. Meghan also painted the Tad'
        + '\ncostumes, but that character is in the public domain.';

    for (module in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, module)) {
            versions += ('\n' + module + ' (' +
                modules[module] + ')');
        }
    }
    if (versions !== '') {
        versions = localize('current module versions:') + ' \n\n' +
            'morphic (' + morphicVersion + ')' +
            versions;
    }
    translations = localize('Translations') + '\n' + SnapTranslator.credits();

    dlg = new DialogBoxMorph();

    function txt(textString) {
        var tm = new TextMorph(
            textString,
            dlg.fontSize,
            dlg.fontStyle,
            true,
            false,
            'center',
            null,
            null,
            MorphicPreferences.isFlat ? null : new Point(1, 1),
            WHITE
        ),
            scroller,
            maxHeight = world.height() - dlg.titleFontSize * 10;
        if (tm.height() > maxHeight) {
            scroller = new ScrollFrameMorph();
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.bounds.setWidth(tm.width());
            scroller.bounds.setHeight(maxHeight);
            scroller.addContents(tm);
            scroller.color = new Color(0, 0, 0, 0);
            return scroller;
        }
        return tm;
    }

    dlg.inform('About Snap', aboutTxt, world, this.snapLogo); //Sn4A mod
    btn1 = dlg.buttons.children[0];
    translatorsBtn = dlg.addButton(
        () => {
            dlg.addBody(txt(translations));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Translators...'
    );
    btn2 = dlg.addButton(
        () => {
            dlg.addBody(txt(aboutTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.hide();
            btn3.show();
            btn4.show();
            licenseBtn.show();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
    licenseBtn = dlg.addButton(
        () => {
            dlg.addBody(txt(noticeTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'License...'
    );
    btn3 = dlg.addButton(
        () => {
            dlg.addBody(txt(versions));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Modules...'
    );
    btn4 = dlg.addButton(
        () => {
            dlg.addBody(txt(creditsTxt));
            dlg.body.fixLayout();
            btn1.show();
            btn2.show();
            translatorsBtn.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    translatorsBtn.hide();
    dlg.fixLayout();
};

IDE_Morph.prototype.aboutSnap4Arduino = function () {
    var dlg, aboutTxt, creditsTxt, translations,
        module, aboutBtn, creditsBtn,
        world = this.world();

    dlg = new DialogBoxMorph();

    function txt(textString) {
        var tm = new TextMorph(
            textString,
            dlg.fontSize,
            dlg.fontStyle,
            true,
            false,
            'center',
            null,
            null,
            MorphicPreferences.isFlat ? null : new Point(1, 1),
            WHITE
        ),
            scroller,
            maxHeight = world.height() - dlg.titleFontSize * 10;
        if (tm.height() > maxHeight) {
            scroller = new ScrollFrameMorph();
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.bounds.setWidth(tm.width());
            scroller.bounds.setHeight(maxHeight);
            scroller.addContents(tm);
            scroller.color = new Color(0, 0, 0, 0);
            return scroller;
        }
        return tm;
    }

    this.getURL('version', function (version) {

        aboutTxt = 'Snap4Arduino ' + version + '\n'
            + 'http://snap4arduino.rocks\n\n'

            + 'Copyright \u24B8 2018-2023 Joan Guillén and Bernat Romagosa\n'
            + 'https://github.com/bromagosa/snap4arduino\n\n'

            + 'Copyright \u24B8 2016-2017 Bernat Romagosa and Arduino.org\n\n'

            + 'Copyright \u24B8 2015 Bernat Romagosa and Citilab\n'
            + 'edutec@citilab.eu\n\n'

            + 'Snap4Arduino is a modification of Snap! originally developed\n'
            + 'by the Edutec research group at the Citilab, Cornellà de\n'
            + 'Llobregat (Barcelona).'

        dlg.inform('About Snap4Arduino', aboutTxt, world, this.logo.cachedTexture);
    });

    creditsTxt = localize('Contributors')
        + '\n\nErnesto Laval: MacOSX version, architectural decisions,\n'
        + 'several features and bugfixes, Spanish translation\n'
        + 'José García, Joan Güell and Víctor Casado: SnapJr mode,\n'
        + 'architectural decisions, several bug reports, testing and\n'
        + 'unvaluable help in many other regards.\n'
        + 'Josep Ferràndiz: Extensive testing, vision\n'
        + 'Frank Hunleth: GNU/Linux 64b version\n'
        + 'Ove Risberg: Network to serial port functionality\n'
        + 'Mareen Przybylla: Early testing, several bug reports,\n'
        + 'German translation, architectural decisions\n'
        + 'Steven Tang and Jeffrey (Ying-Chieh) Chao:\n\t\tSimplified Chinese translation\n'
        + 'Jeffrey (Ying-Chieh) Chao: Traditional Chinese translation\n'
        + 'Alberto Firpo: Italian translation\n'
        + 'Yaroslav Kirov: Ukrainian and Russian translations\n'
        + 'Sjoerd Dirk Meijer: Dutch translation\n'
        + 'Lior Assouline: Hebrew translation\n'
        + 'Manuel Menezes de Sequeira: Portuguese (Portugal) translation\n'
        + 'Hasso Tepper: Estonian translation\n'
        + 'Triyan W. Nugroho: Bahasa Indonesian translation\n'
        + 'Huseyin Yildiz: Turkish translation\n'
        + 'Lee Jubeen: Korean translation\n'
        + 'Asier Iturralde: Basque translation\n'
        + 'Serhiy Kryzhanovsky: Ukrainian translation';

    creditsBtn = dlg.addButton(
        function () {
            dlg.addBody(txt(creditsTxt));
            dlg.body.fixLayout();
            aboutBtn.show();
            creditsBtn.hide();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'Contributions...'
    );
    aboutBtn = dlg.addButton(
        function () {
            dlg.addBody(txt(aboutTxt));
            dlg.body.fixLayout();
            aboutBtn.hide();
            creditsBtn.show();
            dlg.fixLayout();
            dlg.setCenter(world.center());
        },
        'About Snap4Arduino...'
    );
    aboutBtn.hide();
    dlg.fixLayout();
};

IDE_Morph.prototype.originalGetCostumesList = IDE_Morph.prototype.getCostumesList;
IDE_Morph.prototype.getCostumesList = function (dirname) {
    var fs = require('fs'),
        dir,
        costumes = [];

    dir = fs.readdirSync(dirname);
    dir.forEach(
        function (each) {
            costumes.push(each);
        }
    );
    costumes.sort(function (x, y) {
        return x < y ? -1 : 1;
    });
    return costumes;
};


// Snap4Arduino logo
IDE_Morph.prototype.createLogo = function () {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();

    // the logo texture is not loaded dynamically as an image, but instead
    // hard-copied here to avoid tainting the world canvas. This lets us
    // use Snap's (and Morphic's) color pickers to sense any pixel which
    // otherwise would be compromised by annoying browser security.

    // this.logo.texture = this.logoURL; // original code, commented out
    this.logo.texture = 's4a_logo_sm.png'; // Overriden for Snap4Arduino
    this.snapLogo = new Image();
    this.snapLogo.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA" + 
    "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";

    this.logo.render = function (ctx) {
        var gradient = ctx.createLinearGradient(
            0,
            0,
            this.width(),
            0
        );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.5, myself.frameColor.toString());
        ctx.fillStyle = MorphicPreferences.isFlat ?
            myself.frameColor.toString() : gradient;
        ctx.fillRect(0, 0, this.width(), this.height());
        if (this.cachedTexture) {
            this.renderCachedTexture(ctx);
        } else if (this.texture) {
            this.renderTexture(this.texture, ctx);
        }
    };

    this.logo.renderCachedTexture = function (ctx) {
        ctx.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = BLACK;
    this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
    this.add(this.logo);
};

function homePath() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + ((process.platform == 'win32') ? '\\' : '/')
};

/*
 * Override setLanguage function
 */

IDE_Morph.prototype.originalSetLanguage = IDE_Morph.prototype.setLanguage;
IDE_Morph.prototype.setLanguage = function (lang, callback) {
    var myself = this;

    myself.originalSetLanguage(lang, function () {
        myself.setLanguageS4A(lang, callback);
    });
};

IDE_Morph.prototype.setLanguageS4A = function (lang, callback) {
    // Load language script for s4a related functions
    var s4aTranslation = document.getElementById('s4a-language'),
        s4aSrc = 's4a/lang-' + lang + '.js',
        myself = this;
    if (s4aTranslation) {
        document.head.removeChild(s4aTranslation);
    }
    if (lang === 'en') {
        return this.reflectLanguage('en', callback);
    }
    s4aTranslation = document.createElement('script');
    s4aTranslation.id = 's4a-language';
    s4aTranslation.onload = function () {
        myself.reflectLanguage(lang, callback);
    };
    document.head.appendChild(s4aTranslation);
    s4aTranslation.src = s4aSrc;
};

// Fix problme with connected board when creating a new project 
// while a board is connected (it is not freed for the new sprites)
IDE_Morph.prototype.originalNewProject = IDE_Morph.prototype.newProject
IDE_Morph.prototype.newProject = function () {
    // Disconnect each sprite before creating the new project
    var sprites = this.sprites.asArray()
    sprites.forEach(function (sprite) {
        if (sprite.arduino && sprite.arduino.board) {
            sprite.arduino.disconnect(true);
        }
    });
    this.originalNewProject();
};

IDE_Morph.prototype.pushProject = function () {
    var projectContents = this.serializer.serialize(this.stage),
        myself = this;

    new DialogBoxMorph(
        null,
        function (url) {
            myself.doPushProject(projectContents, url);
        }
    ).withKey('pushProject').prompt(
        'Push project',
        document.location.hostname + ':8080',
        this.world()
    );
};

IDE_Morph.prototype.doPushProject = function (contents, url) {
    var myself = this,
        http = new XMLHttpRequest();

    http.open('POST', 'http://' + url, true);

    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            myself.inform(
                'Done',
                http.responseText);
        } else if (http.readyState === 4 && status !== 200) {
            myself.inform(
                'Error',
                http.responseText);
        }
    };

    http.send(contents);
};

IDE_Morph.prototype.openFromUrl = function () {
    this.prompt('Enter project URL', function (url) {
        window.location.href = '#' + url.replace(/.*#/g, '') + '&editMode';
        window.onbeforeunload = nop;
        window.location.reload();
    });
};

IDE_Morph.prototype.saveAndShare = function () {
    var myself = this;

    if (!this.projectName) {
        myself.prompt(
            'Please enter a name for your project',
            function (name) {
                myself.projectName = name;
                myself.doSaveAndShare();
            });
    } else {
        this.doSaveAndShare();
    }
};

IDE_Morph.prototype.doSaveAndShare = function () {
    var myself = this,
        projectName = this.projectName;

    this.showMessage('Saving project\nto the cloud...');
    this.setProjectName(projectName);

    Cloud.saveProject(
        this,
        function () {
            myself.showMessage('sharing\nproject...');
            Cloud.shareProject(
                projectName,
                null, // username is implicit
                function () {
                    myself.showProjectUrl(projectName);
                    myself.showMessage('shared.');
                },
                myself.cloudError()
            );
        },
        this.cloudError()
    );
};

IDE_Morph.prototype.showProjectUrl = function (projectName) {
    var info = new DialogBoxMorph(),
        label = localize('This project is now public at the following URL:'),
        txt = new InputFieldMorph(
            this.cloud.urlForMyProject(projectName),
            false, // no numeric
            null, // no choices
            false // readOnly, to get a selected text
        );
    info.labelString = label;
    txt.setWidth(Math.max(txt.contents().text.text.length * 6, label.length * 8));
    info.createLabel();
    info.addBody(txt);
    info.addButton('ok', 'OK');
    info.fixLayout();
    info.popUp(this.world());
};

// SnapJr.

IDE_Morph.prototype.startSnapJr = function () {
    var myself = this;
    this.showMessage(localize('Loading Snap Jr.'));
    this.getURL(
        'Examples/SnapJunior.xml',
        function (contents) {
            myself.droppedText(contents, 'Snap Jr.');
            location.hash = '#loadJr';
        }
    );
};

// EXPERIMENTAL: Arduino translation mode
IDE_Morph.prototype.createNewArduinoProject = function () {
    var myself = this;
    this.confirm(
        'Replace the current project with a new one?',
        'New Arduino translatable Project',
        function () { myself.newArduinoProject(); });
};

IDE_Morph.prototype.newArduinoProject = function () {
    var myself = this;

    this.newProject();
    SpriteMorph.prototype.initBlocks();

    // toggle codification
    StageMorph.prototype.enableCodeMapping = true;
    this.currentSprite.primitivesCache.variables = null;

    // UI changes
    // Ok, these decorator names are getting silly
    if (!this.isArduinoTranslationMode) {
        SpriteMorph.prototype.notSoOriginalBlockTemplates = SpriteMorph.prototype.blockTemplates;
        SpriteMorph.prototype.blockTemplates = function (category) {
            var blocks = this.notSoOriginalBlockTemplates(category);
            if (category === 'variables') {
                blocks = blocks.splice(1);
                blocks = blocks.splice(0, blocks.length - 1);
            }
            return blocks;
        }

        StageMorph.prototype.notSoOriginalBlockTemplates = StageMorph.prototype.blockTemplates;
        StageMorph.prototype.blockTemplates = function (category) {
            var blocks = this.notSoOriginalBlockTemplates(category);
            if (category === 'variables') {
                blocks = blocks.splice(1);
                blocks = blocks.splice(0, blocks.length - 1);
            }
            return blocks;
        }
    }

    // toggle unusable blocks
    var defs = SpriteMorph.prototype.blocks;

    SpriteMorph.prototype.categories.forEach(function (category) {
        Object.keys(defs).forEach(function (selector) {
            if (!defs[selector].transpilable) {
                StageMorph.prototype.hiddenPrimitives[selector] = true;
            }
        });
        myself.flushBlocksCache(category)
    });

    // hide empty categories
    if (!this.isArduinoTranslationMode) {
        this.categories.children.forEach(function (each) { each.originalPosition = each.position() });
        this.categories.children[9].setPosition(this.categories.children[4].position());
        this.categories.children[8].setPosition(this.categories.children[3].position());
        this.categories.children[7].setPosition(this.categories.children[2].position());
        this.categories.children[5].setPosition(this.categories.children[1].position());
        this.categories.children[1].setPosition(this.categories.children[0].position());

        this.categories.children[0].hide(); // Motion
        this.categories.children[2].hide(); // Looks
        this.categories.children[3].hide(); // Sensing
        this.categories.children[4].hide(); // Sound
        this.categories.children[6].hide(); // Pen

        this.categories.setHeight(this.categories.height() - 30);
    }

    this.isArduinoTranslationMode = true;

    this.currentSprite.paletteCache.variables = null;
    this.refreshPalette();
};

IDE_Morph.prototype.createNewProject = function () {
    var myself = this;
    this.confirm(
        'Replace the current project with a new one?',
        'New Project',
        function () {
            if (myself.isArduinoTranslationMode) {
                StageMorph.prototype.blockTemplates = StageMorph.prototype.notSoOriginalBlockTemplates;
                SpriteMorph.prototype.blockTemplates = SpriteMorph.prototype.notSoOriginalBlockTemplates;
                myself.isArduinoTranslationMode = false;
                // show all categories

                myself.categories.children.forEach(function (each) {
                    each.setPosition(each.originalPosition);
                    each.show();
                });

                myself.categories.setHeight(myself.categories.height() + 30);
            }
            myself.newProject();
        }
    );
};

IDE_Morph.prototype.sn4a_version = function () {
    return require('fs').readFileSync('version').toString();
};

// Can't be decorated, and we need to make sure the "other" category
// shows up
IDE_Morph.prototype.createCategories = function () {
    var myself = this,
        categorySelectionAction = this.scene.unifiedPalette ? scrollToCategory
            : changePalette,
        categoryQueryAction = this.scene.unifiedPalette ? queryTopCategory
            : queryCurrentCategory;

    if (this.categories) {
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.bounds.setWidth(this.paletteWidth);
    this.categories.buttons = [];

    this.categories.refresh = function () {
        this.buttons.forEach(cat => {
            cat.refresh();
            if (cat.state) {
                cat.scrollIntoView();
            }
        });
    };

    this.categories.refreshEmpty = function () {
        var dict = myself.currentSprite.emptyCategories();
        dict.variables = dict.variables || dict.lists; // removing Other cat
        this.buttons.forEach(cat => {
            if (dict[cat.category]) {
                cat.enable();
            } else {
                cat.disable();
            }
        });
    };

    function changePalette(category) {
        return () => {
            myself.currentCategory = category;
            myself.categories.buttons.forEach(each =>
                each.refresh()
            );
            myself.refreshPalette(true);
        };
    }

    function scrollToCategory(category) {
        return () => myself.scrollPaletteToCategory(category);
    }

    function queryCurrentCategory(category) {
        return () => myself.currentCategory === category;
    }

    function queryTopCategory(category) {
        return () => myself.topVisibleCategoryInPalette() === category;
    }

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(MorphicPreferences.isFlat ? 5 : 50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category[0].toUpperCase().concat(category.slice(1)), // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );

        button.category = category;
        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (MorphicPreferences.isFlat) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function addCustomCategoryButton(category, color) {
        var labelWidth = 168,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(MorphicPreferences.isFlat ? 5 : 50),
                color
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            categorySelectionAction(category),
            category, // label
            categoryQueryAction(category), // query
            null, // env
            null, // hint
            labelWidth, // minWidth
            true // has preview
        );

        button.category = category;
        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        if (MorphicPreferences.isFlat) {
            button.labelPressColor = WHITE;
        }
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        myself.categories.buttons.push(button);
        return button;
    }

    function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            more = SpriteMorph.prototype.customCategories.size,
            border = 3,
            xPadding = (200 // myself.logo.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            scroller,
            row,
            col,
            i;

        myself.categories.children.forEach((button, i) => {
            row = i < 8 ? i % 4 : (i == 8 || i == 9) ? 4 : i - 5; // fixing Other and Arduino categories
            col = (i < 4 || (i > 7 && i != 9)) ? 1 : 2; // fixing Other and Arduino categories
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + ((row + 1) * yPadding + (row * buttonHeight) + border) +
                (i > 9 ? border + 2 : 0) // 7 -> 9
            ));
        });
        // Scroller from 6 (5 in Snap!) because Snap4Arduino
        // has already an extra categories row (for Other and Arduino)
        if (more > 5) { // 6->5
            scroller = new ScrollFrameMorph(null, null, myself.sliderColor);
            scroller.setColor(myself.groupColor);
            scroller.acceptsDrops = false;
            scroller.contents.acceptsDrops = false;
            scroller.setPosition(
                new Point(0, myself.categories.children[10].top()) // 8->10
            );
            scroller.setWidth(myself.paletteWidth);
            scroller.setHeight(buttonHeight * 5 + yPadding * 4); // 6,5 -> 5,4

            for (i = 0; i < more; i += 1) {
                scroller.addContents(myself.categories.children[10]); // 8->10
            }
            myself.categories.add(scroller);
            myself.categories.setHeight(
                (5 + 1) * yPadding // 4 -> 5
                + 5 * buttonHeight // 4 -> 5
                + 5 * (yPadding + buttonHeight) + border + 2 // 6->5
                + 2 * border
            );
        } else {
            myself.categories.setHeight(
                (5 + 1) * yPadding // 4 -> 5
                + 5 * buttonHeight // 4 -> 5
                + (more ?
                    (more * (yPadding + buttonHeight) + border + 2)
                    : 0)
                + 2 * border
            );
        }
    }

    SpriteMorph.prototype.categories.forEach(cat => {
        if (!contains(['lists'], cat)) { // Removing "other" filter
            addCategoryButton(cat);
        }
    });

    // sort alphabetically
    Array.from(
        SpriteMorph.prototype.customCategories.keys()
    ).sort().forEach(name =>
        addCustomCategoryButton(
            name,
            SpriteMorph.prototype.customCategories.get(name)
        )
    );

    fixCategoriesLayout();
    this.add(this.categories);
};

// Show URL of public projects in project list
ProjectDialogMorph.prototype.originalInstallCloudProjectList = ProjectDialogMorph.prototype.installCloudProjectList;
ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    this.originalInstallCloudProjectList(pl);
    this.addUserMenuToListItems();
};

ProjectDialogMorph.prototype.originalBuildFilterField = ProjectDialogMorph.prototype.buildFilterField;
ProjectDialogMorph.prototype.buildFilterField = function () {
    var myself = this;

    this.originalBuildFilterField();

    this.filterField.originalReactToKeystroke = this.filterField.reactToKeystroke;
    this.filterField.reactToKeystroke = function (evt) {
        this.originalReactToKeystroke(evt);
        myself.addUserMenuToListItems();
    };
};

ProjectDialogMorph.prototype.addUserMenuToListItems = function () {
    var ide = this.ide;
    this.listField.listContents.children.forEach(function (menuItem) {
        if (menuItem.labelBold) { // shared project
            menuItem.userMenu = function () {
                var menu = new MenuMorph(this);
                menu.addItem(
                    'Show project URL',
                    function () {
                        ide.showProjectUrl(menuItem.labelString);
                    });
                return menu;
            };
        }
    });
};
//Can't be decorated.
//Other category scrolls to other group blocks (not to "wrap")
IDE_Morph.prototype.scrollPaletteToCategory = function (category) {
    var palette = this.palette,
        msecs = this.isAnimating ? 200 : 0,
        firstInCategory,
        delta;

    if (palette.isForSearching) {
        this.refreshPalette();
        palette = this.palette;
    }
    firstInCategory = palette.contents.children.find(
        (block) => {
            return block.category === category &&
                block.selector != 'doWarp' &&
                block.selector != 'doDeclareVariables' &&
                !(block instanceof RingMorph);
        });
    if (firstInCategory === undefined) { return; }
    delta = palette.top() - firstInCategory.top() + palette.padding;
    if (delta === 0) { return; }
    this.world().animations.push(new Animation(
        y => { // setter
            palette.contents.setTop(y);
            palette.contents.keepInScrollFrame();
            palette.adjustScrollBars();
        },
        () => palette.contents.top(), // getter
        delta, // delta
        msecs, // duration in ms
        t => Math.pow(t, 6), // easing
        null // onComplete
    ));
};

//Can't be decorated.
//Other blocks point to Other category (even "doDeclareVariables')
IDE_Morph.prototype.topVisibleCategoryInPalette = function () {
    // private - answer the topmost (partially) visible
    // block category in the palette, so it can be indicated
    // as "current category" in the category selection buttons
    var top;
    if (!this.palette) { return; }
    top = this.palette.contents.children.find(morph =>
        morph.category && morph.bounds.intersects(this.palette.bounds)
    );
    if (top) {
        if (top.category === 'other') {
            if (top.selector === 'doWarp') {
                return 'control';
            }
            if (top instanceof RingMorph) {
                return 'operators';
            }
            if (top.selector === 'doDeclareVariables') {
                return 'variables';
            }
            return 'other';
        }
        if (top.category === 'lists') {
            return 'variables';
        }
        return top.category;
    }
    return null;
};
IDE_Morph.prototype.originalFixLayout = IDE_Morph.prototype.fixLayout;
IDE_Morph.prototype.fixLayout = function (situation) {
    this.originalFixLayout(situation);
    this.categories.refreshEmpty();
};

//To flush "other" when "variables are called (for "extension" and "codification" blocks)
IDE_Morph.prototype.originalFlushBlocksCache = IDE_Morph.prototype.flushBlocksCache;
IDE_Morph.prototype.flushBlocksCache = function (category) {
    if (category === 'variables') {
        this.originalFlushBlocksCache('other');
    }
    this.originalFlushBlocksCache(category);
};

//Replacing window title
IDE_Morph.prototype.snap4arduinoTitle = function () {
    document.title = "PatruLINO-IDE " +
        (this.getProjectName() ? this.getProjectName() : this.sn4a_version());
};
IDE_Morph.prototype.original_setProjectName = IDE_Morph.prototype.setProjectName;
IDE_Morph.prototype.setProjectName = function (string) {
    this.original_setProjectName(string);
    this.snap4arduinoTitle();
};
IDE_Morph.prototype.original_setProjectNotes = IDE_Morph.prototype.setProjectNotes;
IDE_Morph.prototype.setProjectNotes = function (string) {
    this.original_setProjectNotes(string);
    this.snap4arduinoTitle();
};
IDE_Morph.prototype.original_updateChanges = IDE_Morph.prototype.updateChanges;
IDE_Morph.prototype.updateChanges = function (spriteName, details) {
    this.original_updateChanges(spriteName, details);
    this.snap4arduinoTitle();
};
IDE_Morph.prototype.original_switchToUserMode = IDE_Morph.prototype.switchToUserMode;
IDE_Morph.prototype.switchToUserMode = function () {
    this.original_switchToUserMode();
    this.snap4arduinoTitle();
};
IDE_Morph.prototype.original_switchToDevMode = IDE_Morph.prototype.switchToDevMode;
IDE_Morph.prototype.switchToDevMode = function () {
    this.original_switchToDevMode();
    this.snap4arduinoTitle();
};
SceneIconMorph.prototype.original_renameScene = SceneIconMorph.prototype.renameScene;
SceneIconMorph.prototype.renameScene = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    this.original_renameScene();
    ide.snap4arduinoTitle();
};
IDE_Morph.prototype.original_fixLayout = IDE_Morph.prototype.fixLayout;
IDE_Morph.prototype.fixLayout = function (situation) {
    this.original_fixLayout(situation);
    if (situation !== 'refreshPalette') {
        this.snap4arduinoTitle();
    }
};
