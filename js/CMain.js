function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function () {
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = false;

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
            FPS = FPS_DESKTOP;
            FPS_TIME = 1 / FPS;
            PHYSICS_STEP = 1 / (FPS * STEP_RATE);
            ROLL_BALL_RATE = 60 / FPS;
        } else {
            BALL_VELOCITY_MULTIPLIER = 0.8;
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        PokiSDK.init().then(
            () => {
                // successfully initialized
                // console.log("PokiSDK initialized");
                // continue to game
                
                //ADD PRELOADER
                _oPreloader = new CPreloader();
            }   
        ).catch(
            () => {
                // initialized but the user has an adblock
                // console.log("Adblock enabled");
                // feel free to kindly ask the user to disable AdBlock, like forcing weird usernames or showing a sad face; be creative!
                // continue to the game
        
                //ADD PRELOADER
                _oPreloader = new CPreloader();
            }   
        );
        //PokiSDK.setDebug(false);


        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        
        PokiSDK.gameLoadingProgress({percentageDone: _iCurResource/RESOURCE_TO_LOAD});
        
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'drop_bounce_grass',loop:false,volume:1, ingamename: 'drop_bounce_grass'});
        aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'goal',loop:false,volume:1, ingamename: 'goal'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_saved',loop:false,volume:1, ingamename: 'ball_saved'});
        aSoundsInfo.push({path: './sounds/',filename:'kick',loop:false,volume:1, ingamename: 'kick'});
        aSoundsInfo.push({path: './sounds/',filename:'pole',loop:false,volume:1, ingamename: 'pole'});
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded
                                                        });
        }
        
    }; 
    
    
    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
        s_oSpriteLibrary.addSprite("but_level", "./sprites/but_level.png");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_pause", "./sprites/but_pause.png");
        s_oSpriteLibrary.addSprite("arrow_right", "./sprites/arrow_right.png");
        s_oSpriteLibrary.addSprite("arrow_left", "./sprites/arrow_left.png");
        s_oSpriteLibrary.addSprite("ball_shadow", "./sprites/ball_shadow.png");
        s_oSpriteLibrary.addSprite("start_ball", "./sprites/start_ball.png");
        s_oSpriteLibrary.addSprite("hand_touch", "./sprites/hand_touch.png");
        s_oSpriteLibrary.addSprite("cursor", "./sprites/cursor.png");
        s_oSpriteLibrary.addSprite("shot_left", "./sprites/shot_left.png");
        s_oSpriteLibrary.addSprite("goal", "./sprites/goal.png");

        for (var i = 0; i < NUM_SPRITE_PLAYER; i++) {
            s_oSpriteLibrary.addSprite("player_" + i, "./sprites/player/player_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[IDLE]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[IDLE] + i, "./sprites/goalkeeper_idle/gk_idle_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[RIGHT]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT] + i, "./sprites/goalkeeper_save_right/gk_save_right_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[LEFT]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT] + i, "./sprites/goalkeeper_save_left/gk_save_left_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[CENTER_DOWN]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_DOWN] + i, "./sprites/goalkeeper_save_center_down/gk_save_center_down_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[CENTER_UP]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[CENTER_UP] + i, "./sprites/goalkeeper_save_center_up/gk_save_center_up_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[LEFT_DOWN]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[LEFT_DOWN] + i, "./sprites/goalkeeper_save_down_left/gk_save_down_left_" + i + ".png");
        }

        for (var i = 0; i < NUM_SPRITE_GOALKEEPER[RIGHT_DOWN]; i++) {
            s_oSpriteLibrary.addSprite(SPRITE_NAME_GOALKEEPER[RIGHT_DOWN] + i, "./sprites/goalkeeper_save_down_right/gk_save_down_right_" + i + ".png");
        }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        
        PokiSDK.gameLoadingProgress({percentageDone: _iCurResource/RESOURCE_TO_LOAD});
        
        _oPreloader.refreshLoader(iPerc);
    };

    this._onAllImagesLoaded = function () {

    };

    this.preloaderReady = function () {
        PokiSDK.gameLoadingStart();
        
        this._loadImages();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        
        _bUpdate = true;
    };
    
    this._onRemovePreloader = function(){
        PokiSDK.gameLoadingFinished();
        
        _oPreloader.unload();
        
		try{
            saveItem("ls_available","ok");
            s_iLastLevel = this.getSavedLevel();
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
		
        s_oSoundTrack = playSound("soundtrack",1,true);
        
        
        this.gotoMenu();
    };
    
    this.pokiShowCommercial = function(oCb){
        s_oMain.stopUpdate();
        PokiSDK.commercialBreak().then(
            () => {
                //console.log("Commercial Break finished");
                s_oMain.startUpdate();
                if(oCb){
                    oCb();
                }
            }
        );
    };
    
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function () {
        _oGame = new CGame(_oData);

        _iState = STATE_GAME;
    };

    this.gotoHelp = function () {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;
    ENABLE_CHECK_ORIENTATION = false;
    ENABLE_FULLSCREEN = false;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_iCanvasResizeHeight;
var s_iCanvasResizeWidth;
var s_iCanvasOffsetHeight;
var s_iCanvasOffsetWidth;
var s_iAdsLevel = 1;
var s_iBestScore = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_bStorageAvailable = true;
var s_aSounds;
var s_bPokiFirstTimePlay = true;