/*!
 * use.js v0.3.0
 * Copyright 2012, Tim Branyen (@tbranyen)
 * use.js may be freely distributed under the MIT license.
 */
(function(a){var b={};define({version:"0.3.0",load:function(c,d,e,f){f||(f=require.rawConfig);var g=f.use&&f.use[c];if(!g)throw new TypeError("Module '"+c+"' is undefined or does not"+" have a `use` config. Make sure it exists, add a `use` config, or"+" don't use use! on it");b[c]={deps:g.deps||[],attach:g.attach},d(g.deps||[],function(){var b=arguments;d([c],function(){var c=g.attach;return f.isBuild?e():typeof c=="function"?e(c.apply(a,b)):e(a[c])})})},write:function(a,c,d){var e=b[c],f=e.deps,g={attach:null,deps:""};typeof e.attach=="function"?g.attach=e.attach.toString():g.attach=["function() {","return typeof ",String(e.attach),' !== "undefined" ? ',String(e.attach)," : void 0;","}"].join(""),f.length&&(g.deps="'"+f.toString().split(",").join("','")+"'"),d(["define('",a,"!",c,"', ","[",g.deps,"], ",g.attach,");\n"].join(""))}})})(this);
