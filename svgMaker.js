
const TextToSVG = require('text-to-svg')
const fs = require('fs')

const NameSVG = () => {
    const tts = TextToSVG.loadSync('./GARABD.TTF')
    const attributes = { fill: 'white', stroke: 'black' };
    const options = { x: 0, y: 0, fontSize: 72, anchor: 'top', attributes: attributes };

    const svg = tts.getSVG('Oliver Belfitt-Nash', options);
    return svg
}

const res = NameSVG()
fs.writeFileSync('./res.html',res)