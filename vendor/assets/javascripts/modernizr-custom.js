/*! modernizr 3.2.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-csscalc-filereader-flexbox-formvalidation-inlinesvg-input-localstorage-notification-peerconnection-proximity-scriptasync-svg-touchevents-mq !*/
!function(e,t,n){var o=[],i={_version:"3.2.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){o.push({name:e,fn:t,options:n})},addAsyncTest:function(e){o.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=i,Modernizr=new Modernizr,Modernizr.addTest("notification","Notification"in e&&"permission"in e.Notification&&"requestPermission"in e.Notification),Modernizr.addTest("svg",!!t.createElementNS&&!!t.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect),Modernizr.addTest("localstorage",function(){var e="modernizr";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}})}(window,document);