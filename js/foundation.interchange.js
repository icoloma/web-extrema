!function(t,e){"use strict";Foundation.libs.interchange={name:"interchange",version:"5.2.3",cache:{},images_loaded:!1,nodes_loaded:!1,settings:{load_attr:"interchange",named_queries:{"default":"only screen",small:Foundation.media_queries.small,medium:Foundation.media_queries.medium,large:Foundation.media_queries.large,xlarge:Foundation.media_queries.xlarge,xxlarge:Foundation.media_queries.xxlarge,landscape:"only screen and (orientation: landscape)",portrait:"only screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (min-device-pixel-ratio: 2),only screen and (min-resolution: 192dpi),only screen and (min-resolution: 2dppx)"},directives:{replace:function(e,i,a){if(/IMG/.test(e[0].nodeName)){var n=e[0].src;if(new RegExp(i,"i").test(n))return;return e[0].src=i,a(e[0].src)}var s=e.data(this.data_attr+"-last-path");if(s!=i)return/\.(gif|jpg|jpeg|tiff|png)([?#].*)?/i.test(i)?(t(e).css("background-image","url("+i+")"),e.data("interchange-last-path",i),a(i)):t.get(i,function(t){e.html(t),e.data(this.data_attr+"-last-path",i),a()})}}},init:function(e,i,a){Foundation.inherit(this,"throttle random_str"),this.data_attr=this.set_data_attr(),t.extend(!0,this.settings,i,a),this.bindings(i,a),this.load("images"),this.load("nodes")},get_media_hash:function(){var t="";for(var e in this.settings.named_queries)t+=matchMedia(this.settings.named_queries[e]).matches.toString();return t},events:function(){var i,a=this;return t(e).off(".interchange").on("resize.fndtn.interchange",a.throttle(function(){var t=a.get_media_hash();t!==i&&a.resize(),i=t},50)),this},resize:function(){var e=this.cache;if(!this.images_loaded||!this.nodes_loaded)return void setTimeout(t.proxy(this.resize,this),50);for(var i in e)if(e.hasOwnProperty(i)){var a=this.results(i,e[i]);a&&this.settings.directives[a.scenario[1]].call(this,a.el,a.scenario[0],function(){if(arguments[0]instanceof Array)var t=arguments[0];else var t=Array.prototype.slice.call(arguments,0);a.el.trigger(a.scenario[1],t)})}},results:function(t,e){var i=e.length;if(i>0)for(var a=this.S("["+this.add_namespace("data-uuid")+'="'+t+'"]');i--;){var n,s=e[i][2];if(n=matchMedia(this.settings.named_queries.hasOwnProperty(s)?this.settings.named_queries[s]:s),n.matches)return{el:a,scenario:e[i]}}return!1},load:function(t,e){return("undefined"==typeof this["cached_"+t]||e)&&this["update_"+t](),this["cached_"+t]},update_images:function(){var t=this.S("img["+this.data_attr+"]"),e=t.length,i=e,a=0,n=this.data_attr;for(this.cache={},this.cached_images=[],this.images_loaded=0===e;i--;){if(a++,t[i]){var s=t[i].getAttribute(n)||"";s.length>0&&this.cached_images.push(t[i])}a===e&&(this.images_loaded=!0,this.enhance("images"))}return this},update_nodes:function(){var t=this.S("["+this.data_attr+"]").not("img"),e=t.length,i=e,a=0,n=this.data_attr;for(this.cached_nodes=[],this.nodes_loaded=0===e;i--;){a++;var s=t[i].getAttribute(n)||"";s.length>0&&this.cached_nodes.push(t[i]),a===e&&(this.nodes_loaded=!0,this.enhance("nodes"))}return this},enhance:function(i){for(var a=this["cached_"+i].length;a--;)this.object(t(this["cached_"+i][a]));return t(e).trigger("resize")},parse_params:function(t,e,i){return[this.trim(t),this.convert_directive(e),this.trim(i)]},convert_directive:function(t){var e=this.trim(t);return e.length>0?e:"replace"},object:function(t){var e=this.parse_data_attr(t),i=[],a=e.length;if(a>0)for(;a--;){var n=e[a].split(/\((.*?)(\))$/);if(n.length>1){var s=n[0].split(/\, /),r=this.parse_params(s[0],s[1],n[1]);i.push(r)}}return this.store(t,i)},store:function(t,e){var i=this.random_str(),a=t.data(this.add_namespace("uuid",!0));return this.cache[a]?this.cache[a]:(t.attr(this.add_namespace("data-uuid"),i),this.cache[i]=e)},trim:function(e){return"string"==typeof e?t.trim(e):e},set_data_attr:function(t){return t?this.namespace.length>0?this.namespace+"-"+this.settings.load_attr:this.settings.load_attr:this.namespace.length>0?"data-"+this.namespace+"-"+this.settings.load_attr:"data-"+this.settings.load_attr},parse_data_attr:function(t){for(var e=t.attr(this.attr_name()).split(/\[(.*?)\]/),i=e.length,a=[];i--;)e[i].replace(/[\W\d]+/,"").length>4&&a.push(e[i]);return a},reflow:function(){this.load("images",!0),this.load("nodes",!0)}}}(jQuery,window,window.document);