function CHelpText(oParentContainer) {

    var _oParentContainer = oParentContainer;
    var _oHelpText;
    var _oHelpTextStroke;
    var _oContainer;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        _oHelpText = new createjs.Text(TEXT_HELP, "42px " + FONT_GAME, TEXT_COLOR);
        _oHelpText.x = CANVAS_WIDTH / 2;
        _oHelpText.y = CANVAS_HEIGHT_HALF;
        _oHelpText.textAlign = "center";

        _oContainer.addChild(_oHelpText);

        _oHelpTextStroke = new createjs.Text(TEXT_HELP, "42px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oHelpTextStroke.x = CANVAS_WIDTH / 2;
        _oHelpTextStroke.y = _oHelpText.y;
        _oHelpTextStroke.textAlign = "center";
        _oHelpTextStroke.outline = OUTLINE_WIDTH;

        _oContainer.addChild(_oHelpTextStroke);
        _oContainer.alpha = 0;
    };

    this.fadeAnim = function (fVal, oFunc) {
        createjs.Tween.get(_oContainer, {override: true}).to({alpha: fVal}, MS_TIME_FADE_HELP_TEXT).call(function () {
            if (oFunc !== null) {
                oFunc();
            }
        }, null, this);
    };

    this.unload = function () {
        createjs.Tween.removeTweens(_oContainer);
        _oParentContainer.removeChild(_oContainer);
    };

    this._init();

    return this;
}