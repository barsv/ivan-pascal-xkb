// small program to convert html to md
var TurndownService = require('turndown')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var fs = require("fs");
fs.readdirSync('html').forEach(lang => {
    var inputDir = 'html/' + lang + '/';
    var outputDir = 'md/' + lang + '/';
    fs.mkdirSync(outputDir, { recursive: true });
    fs.readdirSync(inputDir).forEach(filename => {
        if (!filename.endsWith('html')) return;
        var f = fs.readFileSync(inputDir + filename);
        var lines = f.toString();
        var d = new JSDOM(lines);
        var turndownService = new TurndownService()
        var markdown = turndownService.turndown(d.window.document.querySelector('.content'));
        var outputFileName = filename.replace('.html', '.md');
        fs.writeFileSync(outputDir + outputFileName, markdown);
    });
});
