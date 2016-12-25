var qtek = require('qtek');
var PostProcessPass = require('./PostProcessPass');

qtek.Shader.import(require('raw!./blur.glsl'));


function CausticsEffect() {
    this._passH = new PostProcessPass(qtek.Shader.source('undersea.blur_h'), true);
    this._passV = new PostProcessPass(qtek.Shader.source('undersea.blur_v'));

    this._passV.setUniform('texture', this._passH.getTargetTexture());
}

CausticsEffect.prototype = {

    constructor: CausticsEffect,

    setParameter: function (name, value) {
        this._passV.setUniform(name, value);
    },

    render: function (forwardRenderer, deferredRenderer, camera, colorTexture) {
        var passH = this._passH;
        var passV = this._passV;
        var gBuffer = deferredRenderer.getGBuffer();

        passH.resize(forwardRenderer.getWidth(), forwardRenderer.getHeight());
        // passV.resize(forwardRenderer.getWidth(), forwardRenderer.getHeight());

        passH.setUniform('texture', colorTexture);

        passH.setUniform('projectionInv', camera.invProjectionMatrix._array);
        passH.setUniform('gBufferTexture2', gBuffer.getTargetTexture2());
        passV.setUniform('projectionInv', camera.invProjectionMatrix._array);
        passV.setUniform('gBufferTexture2', gBuffer.getTargetTexture2());

        passH.render(forwardRenderer);
        passV.render(forwardRenderer);
    }
};

module.exports = CausticsEffect;