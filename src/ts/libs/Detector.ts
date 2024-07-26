/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 * 
 * TypeScript version by Hirokazu Egashira
 * Original JavaScript code: https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
 */
export const Detector = {

    canvas: !!window.CanvasRenderingContext2D,
    webgl: (() => {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
    })(),
    workers: !!window.Worker,
    fileapi: !!(window.File && window.FileReader && window.FileList && window.Blob),
    

    getWebGLErrorMessage: function (): HTMLDivElement {

        const domElement = document.createElement('div');

        domElement.style.fontFamily = 'monospace';
        domElement.style.fontSize = '13px';
        domElement.style.textAlign = 'center';
        domElement.style.background = '#eee';
        domElement.style.color = '#000';
        domElement.style.padding = '1em';
        domElement.style.width = '475px';
        domElement.style.margin = '5em auto 0';

        if (!this.webgl) {

            domElement.innerHTML = window.WebGLRenderingContext ? [
                'Sorry, your graphics card doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>'
            ].join('\n') : [
                'Sorry, your browser doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a><br/>',
                'Please try with',
                '<a href="http://www.google.com/chrome">Chrome 10</a>, ',
                '<a href="http://www.mozilla.com/en-US/firefox/all-beta.html">Firefox 4</a> or',
                '<a href="http://nightly.webkit.org/">Safari 6</a>'
            ].join('\n');

        }

        return domElement;

    },

    addGetWebGLMessage: function (parameters: { parent?: HTMLElement; id?: string } = {}): void {

        const parent = parameters.parent !== undefined ? parameters.parent : document.body;
        const id = parameters.id !== undefined ? parameters.id : 'oldie';
        
        const domElement = this.getWebGLErrorMessage();
        domElement.id = id;  

        parent.appendChild(domElement);

    }

};
