import{r as l,b as Q,aP as Z,j as t,u as X,aQ as J,ao as K,Y as N,aR as ee,k as te}from"./index-Di8-oTzK.js";import{r as ne}from"./index-D5tT-bBS.js";import{D as oe}from"./DashboardContent-IR6dv7RH.js";import{F as V}from"./ChevronRightIcon-Fc-p9mCl.js";import{m as ae}from"./proxy-5XpoLYmU.js";import"./CurrencyDollarIcon-DOGFzvrg.js";var S=function(e,n){return S=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,o){a.__proto__=o}||function(a,o){for(var s in o)Object.prototype.hasOwnProperty.call(o,s)&&(a[s]=o[s])},S(e,n)};function b(e,n){if(typeof n!="function"&&n!==null)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");S(e,n);function a(){this.constructor=e}e.prototype=n===null?Object.create(n):(a.prototype=n.prototype,new a)}var f=function(){return f=Object.assign||function(n){for(var a,o=1,s=arguments.length;o<s;o++){a=arguments[o];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(n[r]=a[r])}return n},f.apply(this,arguments)};function le(e,n){n===void 0&&(n={});var a=n.insertAt;if(!(typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css",a==="top"&&o.firstChild?o.insertBefore(s,o.firstChild):o.appendChild(s),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(document.createTextNode(e))}}var re=`/*
  code is extracted from Calendly's embed stylesheet: https://assets.calendly.com/assets/external/widget.css
*/

.calendly-inline-widget,
.calendly-inline-widget *,
.calendly-badge-widget,
.calendly-badge-widget *,
.calendly-overlay,
.calendly-overlay * {
  font-size: 16px;
  line-height: 1.2em;
}

.calendly-inline-widget {
  min-width: 320px;
  height: 630px;
}

.calendly-inline-widget iframe,
.calendly-badge-widget iframe,
.calendly-overlay iframe {
  display: inline;
  width: 100%;
  height: 100%;
}

.calendly-popup-content {
  position: relative;
}

.calendly-popup-content.calendly-mobile {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}

.calendly-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 9999;
  background-color: #a5a5a5;
  background-color: rgba(31, 31, 31, 0.4);
}

.calendly-overlay .calendly-close-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.calendly-overlay .calendly-popup {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateY(-50%) translateX(-50%);
  transform: translateY(-50%) translateX(-50%);
  width: 80%;
  min-width: 900px;
  max-width: 1000px;
  height: 90%;
  max-height: 680px;
}

@media (max-width: 975px) {
  .calendly-overlay .calendly-popup {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transform: none;
    transform: none;
    width: 100%;
    height: auto;
    min-width: 0;
    max-height: none;
  }
}

.calendly-overlay .calendly-popup .calendly-popup-content {
  height: 100%;
}

.calendly-overlay .calendly-popup-close {
  position: absolute;
  top: 25px;
  right: 25px;
  color: #fff;
  width: 19px;
  height: 19px;
  cursor: pointer;
  background: url(https://assets.calendly.com/assets/external/close-icon.svg)
    no-repeat;
  background-size: contain;
}

@media (max-width: 975px) {
  .calendly-overlay .calendly-popup-close {
    top: 15px;
    right: 15px;
  }
}

.calendly-badge-widget {
  position: fixed;
  right: 20px;
  bottom: 15px;
  z-index: 9998;
}

.calendly-badge-widget .calendly-badge-content {
  display: table-cell;
  width: auto;
  height: 45px;
  padding: 0 30px;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.25) 0 2px 5px;
  font-family: sans-serif;
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}

.calendly-badge-widget .calendly-badge-content.calendly-white {
  color: #666a73;
}

.calendly-badge-widget .calendly-badge-content span {
  display: block;
  font-size: 12px;
}

.calendly-spinner {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  z-index: -1;
}

.calendly-spinner > div {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: #e1e1e1;
  border-radius: 50%;
  vertical-align: middle;
  -webkit-animation: calendly-bouncedelay 1.4s infinite ease-in-out;
  animation: calendly-bouncedelay 1.4s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.calendly-spinner .calendly-bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.calendly-spinner .calendly-bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes calendly-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes calendly-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
`;le(re);function E(e){return e.charAt(0)==="#"?e.slice(1):e}function se(e){return e?.primaryColor&&(e.primaryColor=E(e.primaryColor)),e?.textColor&&(e.textColor=E(e.textColor)),e?.backgroundColor&&(e.backgroundColor=E(e.backgroundColor)),e}var O;(function(e){e.PROFILE_PAGE_VIEWED="calendly.profile_page_viewed",e.EVENT_TYPE_VIEWED="calendly.event_type_viewed",e.DATE_AND_TIME_SELECTED="calendly.date_and_time_selected",e.EVENT_SCHEDULED="calendly.event_scheduled",e.PAGE_HEIGHT="calendly.page_height"})(O||(O={}));var H=function(e){var n=e.url,a=e.prefill,o=a===void 0?{}:a,s=e.pageSettings,r=s===void 0?{}:s,c=e.utm,d=c===void 0?{}:c,y=e.embedType,m=se(r),v=m.backgroundColor,u=m.hideEventTypeDetails,g=m.hideLandingPageDetails,p=m.primaryColor,k=m.textColor,w=m.hideGdprBanner,i=o.customAnswers,h=o.date,x=o.email,_=o.firstName,L=o.guests,I=o.lastName,T=o.location,M=o.name,D=d.utmCampaign,z=d.utmContent,P=d.utmMedium,R=d.utmSource,A=d.utmTerm,U=d.salesforce_uuid,j=n.indexOf("?"),W=j>-1,G=n.slice(j+1),$=W?n.slice(0,j):n,Y=[W?G:null,v?"background_color=".concat(v):null,u?"hide_event_type_details=1":null,g?"hide_landing_page_details=1":null,p?"primary_color=".concat(p):null,k?"text_color=".concat(k):null,w?"hide_gdpr_banner=1":null,M?"name=".concat(encodeURIComponent(M)):null,T?"location=".concat(encodeURIComponent(T)):null,_?"first_name=".concat(encodeURIComponent(_)):null,I?"last_name=".concat(encodeURIComponent(I)):null,L?"guests=".concat(L.map(encodeURIComponent).join(",")):null,x?"email=".concat(encodeURIComponent(x)):null,h&&h instanceof Date?"date=".concat(ie(h)):null,D?"utm_campaign=".concat(encodeURIComponent(D)):null,z?"utm_content=".concat(encodeURIComponent(z)):null,P?"utm_medium=".concat(encodeURIComponent(P)):null,R?"utm_source=".concat(encodeURIComponent(R)):null,A?"utm_term=".concat(encodeURIComponent(A)):null,U?"salesforce_uuid=".concat(encodeURIComponent(U)):null,y?"embed_type=".concat(y):null,"embed_domain=1"].concat(i?de(i):[]).filter(function(q){return q!==null}).join("&");return"".concat($,"?").concat(Y)},ie=function(e){var n=e.getMonth()+1,a=e.getDate(),o=e.getFullYear();return[o,n<10?"0".concat(n):n,a<10?"0".concat(a):a].join("-")},ce=/^a\d{1,2}$/,de=function(e){var n=Object.keys(e).filter(function(a){return a.match(ce)});return n.length?n.map(function(a){return"".concat(a,"=").concat(encodeURIComponent(e[a]))}):[]},B=(function(e){b(n,e);function n(){return e!==null&&e.apply(this,arguments)||this}return n.prototype.render=function(){return l.createElement("div",{className:"calendly-spinner"},l.createElement("div",{className:"calendly-bounce1"}),l.createElement("div",{className:"calendly-bounce2"}),l.createElement("div",{className:"calendly-bounce3"}))},n})(l.Component),me="calendly-inline-widget",ue=(function(e){b(n,e);function n(a){var o=e.call(this,a)||this;return o.state={isLoading:!0},o.onLoad=o.onLoad.bind(o),o}return n.prototype.onLoad=function(){this.setState({isLoading:!1})},n.prototype.render=function(){var a=H({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),o=this.props.LoadingSpinner||B;return l.createElement("div",{className:this.props.className||me,style:this.props.styles||{}},this.state.isLoading&&l.createElement(o,null),l.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:a}))},n})(l.Component),pe=(function(e){b(n,e);function n(a){var o=e.call(this,a)||this;return o.state={isLoading:!0},o.onLoad=o.onLoad.bind(o),o}return n.prototype.onLoad=function(){this.setState({isLoading:!1})},n.prototype.render=function(){var a=H({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),o=this.props.LoadingSpinner||B;return l.createElement(l.Fragment,null,this.state.isLoading&&l.createElement(o,null),l.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:a}))},n})(l.Component),F=(function(e){if(!e.open)return null;if(!e.rootElement)throw new Error("[react-calendly]: PopupModal rootElement property cannot be undefined");return ne.createPortal(l.createElement("div",{className:"calendly-overlay"},l.createElement("div",{onClick:e.onModalClose,className:"calendly-close-overlay"}),l.createElement("div",{className:"calendly-popup"},l.createElement("div",{className:"calendly-popup-content"},l.createElement(pe,f({},e)))),l.createElement("button",{className:"calendly-popup-close",onClick:e.onModalClose,"aria-label":"Close modal",style:{display:"block",border:"none",padding:0}})),e.rootElement)});(function(e){b(n,e);function n(a){var o=e.call(this,a)||this;return o.state={isOpen:!1},o.onClick=o.onClick.bind(o),o.onClose=o.onClose.bind(o),o}return n.prototype.onClick=function(a){a.preventDefault(),this.setState({isOpen:!0})},n.prototype.onClose=function(a){a.stopPropagation(),this.setState({isOpen:!1})},n.prototype.render=function(){return l.createElement(l.Fragment,null,l.createElement("button",{onClick:this.onClick,style:this.props.styles||{},className:this.props.className||""},this.props.text),l.createElement(F,f({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},n})(l.Component);(function(e){b(n,e);function n(a){var o=e.call(this,a)||this;return o.state={isOpen:!1},o.onClick=o.onClick.bind(o),o.onClose=o.onClose.bind(o),o}return n.prototype.onClick=function(){this.setState({isOpen:!0})},n.prototype.onClose=function(a){a.stopPropagation(),this.setState({isOpen:!1})},n.prototype.render=function(){return l.createElement("div",{className:"calendly-badge-widget",onClick:this.onClick},l.createElement("div",{className:"calendly-badge-content",style:{background:this.props.color||"#00a2ff",color:this.props.textColor||"#ffffff"}},this.props.text||"Schedule time with me",this.props.branding&&l.createElement("span",null,"powered by Calendly")),l.createElement(F,f({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},n})(l.Component);const he=()=>{const{activeStoreId:e}=Q(),{storeSubdomain:n,getByStoreId:a,loading:o,error:s}=Z();l.useEffect(()=>{e&&a(e)},[e,a]);const r=l.useCallback(()=>{console.log("Manage domain clicked")},[]);return t.jsxs("div",{className:"bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm flex items-center justify-between",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Customize your domain"}),s?t.jsx("p",{className:"text-sm text-red-600",children:s}):t.jsxs("p",{className:"text-sm text-gray-600",children:["Default domain:"," ",o?"Loading...":n?.url?t.jsx("a",{href:n.url,target:"_blank",rel:"noopener noreferrer",className:"text-gray-900 hover:underline",children:n.url.replace(/^https?:\/\//,"")}):"—"]})]}),t.jsx("button",{onClick:r,className:"px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors",children:"Manage"})]})},ge=({steps:e=[{id:"theme",title:"Make your store stand out with the right theme",buttonText:"Configure Theme",buttonVariant:"primary"},{id:"domain",title:"Set your own domain for your store",description:"Added Domain: fashion-0-60058040737.ziplofy.com",buttonText:"Add Domain",buttonVariant:"primary"},{id:"items",title:"Add all the items that you'll be selling on your store",buttonText:"Add Items",buttonVariant:"primary"},{id:"shipping",title:"Set up shipping zones to deliver your items efficiently",buttonText:"Setup",buttonVariant:"primary"},{id:"payment",title:"Connect payment gateways to start accepting online payments",buttonText:"Configure Online Payments",buttonVariant:"primary"}],onStepClick:n,onTestOrderClick:a})=>{const o=l.useCallback(r=>{n?n(r):console.log("Step clicked:",r)},[n]),s=l.useCallback(()=>{a?a():console.log("Test order clicked")},[a]);return t.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[t.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:t.jsx("h2",{className:"text-base font-semibold text-gray-900",children:"Complete these few steps to launch your store"})}),t.jsx("div",{className:"space-y-3 mb-4",children:e.map(r=>t.jsxs("div",{className:"flex items-center justify-between gap-4 p-4 bg-page-background-color rounded-lg border border-gray-200/80",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("p",{className:"text-sm font-medium text-gray-900 mb-0.5",children:r.title}),r.description&&t.jsx("p",{className:"text-xs text-gray-500 truncate mt-0.5",children:r.description})]}),t.jsx("button",{onClick:()=>o(r.id),className:`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${r.buttonVariant==="added"?"bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100":"bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"}`,children:r.buttonText})]},r.id))}),t.jsx("div",{className:"bg-blue-600 rounded-lg p-4",children:t.jsxs("div",{className:"flex items-center justify-between gap-4",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("h3",{className:"text-sm font-semibold text-white mb-0.5",children:"Try placing a test order yourself"}),t.jsx("p",{className:"text-xs text-blue-100",children:"Experience how the process works from start to finish"})]}),t.jsx("button",{onClick:s,className:"px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0",children:"See How It Works"})]})})]})},xe=({resource:e,onClick:n})=>t.jsxs("button",{onClick:()=>n?.(e.id),className:"w-full flex items-center gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[t.jsx("div",{className:"flex-shrink-0 w-5 h-5 flex items-center justify-center",children:e.icon}),t.jsx("div",{className:"flex-1 min-w-0",children:t.jsx("p",{className:"text-sm font-medium text-gray-900",children:e.title})}),t.jsx("div",{className:"flex-shrink-0",children:t.jsx(V,{className:"w-4 h-4 text-blue-500"})})]}),fe=({resources:e=[{id:"help-center",title:"Visit our Help Center",icon:t.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})})},{id:"academy",title:"Try our Academy Page",icon:t.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})},{id:"forum",title:"Try our Forum Area",icon:t.jsx("svg",{className:"w-6 h-6 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}],onResourceClick:n})=>{const a=l.useCallback(o=>{n?n(o):console.log("Resource clicked:",o)},[n]);return t.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[t.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:t.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Other Helpful Resources"})}),t.jsx("div",{className:"space-y-2.5",children:e.map(o=>t.jsx(xe,{resource:o,onClick:a},o.id))})]})},C=({item:e,onClick:n})=>t.jsxs("button",{onClick:()=>n?.(e.id),className:"w-full flex items-start gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[t.jsx("div",{className:"flex-shrink-0 w-8 h-8 flex items-center justify-center",children:e.icon}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("h4",{className:"text-sm font-medium text-gray-900 mb-1",children:e.title}),t.jsx("p",{className:"text-xs text-gray-600",children:e.description})]}),t.jsx("div",{className:"flex-shrink-0",children:t.jsx(V,{className:"w-4 h-4 text-blue-500"})})]}),be=({onItemClick:e})=>{const n=l.useCallback(a=>{e?e(a):console.log("Improvement item clicked:",a)},[e]);return t.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[t.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:t.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Here are some ways to improve your store"})}),t.jsxs("div",{className:"flex gap-3",children:[t.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[t.jsx(C,{item:{id:"taxes",title:"Set Up taxes",description:"Configure Tax Rates & Rules to boost Sales",icon:t.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[t.jsx("circle",{cx:"7",cy:"11",r:"2.5",strokeWidth:1.5}),t.jsx("circle",{cx:"15",cy:"13",r:"2.5",strokeWidth:1.5}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M7 11l8 2"}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v3m0 10v3"}),t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M19 6l-3 3M5 16l3-3"})]})},onClick:n}),t.jsx(C,{item:{id:"collections",title:"Manage Collections",description:"Combine different items to show under a common filter",icon:t.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[t.jsx("rect",{x:"6",y:"4",width:"12",height:"4",rx:"1",strokeWidth:1.5}),t.jsx("rect",{x:"6",y:"10",width:"12",height:"4",rx:"1",strokeWidth:1.5}),t.jsx("rect",{x:"6",y:"16",width:"12",height:"4",rx:"1",strokeWidth:1.5})]})},onClick:n})]}),t.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[t.jsx(C,{item:{id:"coupons",title:"Create Coupons",description:"Add and manage discounts for orders",icon:t.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"})})},onClick:n}),t.jsx(C,{item:{id:"shipping",title:"Shipping Integration",description:"Integrate with shipping carriers for real-time tracking and shipping",icon:t.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"})})},onClick:n})]})]})]})},ye="/assets/all-about-ziplofy-Bvbz7z7C.png",ve=({videoUrl:e,title:n="Watch a quick overview video",onPlay:a})=>t.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[t.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:t.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Watch a quick overview video"})}),t.jsx("div",{className:"relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden",children:e?t.jsx("iframe",{src:e,className:"w-full h-full",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,title:"Overview Video"}):t.jsx("img",{src:ye,alt:"All About Ziplofy",className:"w-full h-full object-cover"})})]}),ke=({onStepClick:e,onTestOrderClick:n,onImprovementClick:a,onResourceClick:o})=>t.jsxs("div",{className:"flex flex-col gap-6",children:[t.jsxs("div",{children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome to ",t.jsx("span",{className:"text-blue-600",children:"Ziplofy"})]}),t.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Let's set up your e-commerce store and manage your business effectively"})]}),t.jsx(ge,{onStepClick:e,onTestOrderClick:n}),t.jsx(be,{onItemClick:a}),t.jsxs("div",{className:"flex gap-4",children:[t.jsx(ve,{}),t.jsx(fe,{onResourceClick:o})]})]});function _e(){const e=X(),[n,a]=l.useState(!1),[o,s]=l.useState("dashboard"),{socket:r}=J(),{loggedInUser:c}=K(),d=l.useRef(null);l.useCallback(()=>{r&&r.connected?r.emit("hireDeveloper"):N.error("socket not connected")},[r]),l.useCallback(()=>{r&&r.connected?(r.emit(ee.EndMeeting),N.success("we have notified the developer to send requirements form, so that you can approve it")):N.error("Socket not connected")},[r,c?.assignedSupportDeveloperId?.id]),l.useCallback(()=>{a(!0)},[]);const y=l.useCallback(i=>{switch(i){case"items":e("/products");break;case"theme":e("/themes/all-themes");break;case"domain":e("/settings/domains");break;case"shipping":e("/settings/shipping-and-delivery");break;case"payment":e("/settings/payments");break;default:console.log("Step clicked:",i)}},[e]),m=l.useCallback(i=>{switch(i){case"taxes":e("/settings/taxes-and-duties");break;case"collections":e("/products/collections");break;case"coupons":e("/discounts");break;case"shipping":e("/settings/shipping-and-delivery");break;case"digital-downloads":e("/settings/digital-downloads");break;default:console.log("Improvement item clicked:",i)}},[e]),v=l.useMemo(()=>{if(!c?.assignedSupportDeveloperId)return console.log("No assigned developer found"),"https://calendly.com/default/30min";const i=c.assignedSupportDeveloperId?.email;console.log("Developer email:",i);const h="gibberish";console.log("Extracted username:",h);const x=`https://calendly.com/${h}/30min`;return console.log("Generated Calendly URL:",x),x},[c?.assignedSupportDeveloperId]),u=l.useCallback(()=>{a(!1)},[]),g=l.useCallback(i=>{d.current&&!d.current.contains(i.target)&&u()},[u]),p=l.useCallback(i=>{i.key==="Escape"&&n&&u()},[n,u]),k=l.useCallback(i=>{i.stopPropagation()},[]);l.useCallback(()=>{console.log("Ask AI clicked")},[]),l.useCallback(()=>{console.log("Get tasks updates clicked")},[]),l.useCallback(()=>{console.log("Create workspace clicked")},[]),l.useCallback(()=>{console.log("Connect apps clicked")},[]),l.useEffect(()=>(n&&(document.addEventListener("mousedown",g),document.body.style.overflow="hidden"),()=>{document.removeEventListener("mousedown",g),document.body.style.overflow="unset"}),[n,g]),l.useEffect(()=>(n&&document.addEventListener("keydown",p),()=>{document.removeEventListener("keydown",p)}),[n,p]);const w=c?.name?.split(" ")[0]||"User";return t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"min-h-screen bg-page-background-color",children:t.jsxs("div",{className:"max-w-[1400px] mx-auto px-3 sm:px-4 py-4",children:[t.jsxs("div",{className:"mb-4",children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome back",w!=="User"?`, ${w}`:""]}),t.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Here's what's happening with your store today"})]}),t.jsx("div",{className:"flex items-center gap-1 mb-8 p-1 bg-white rounded-lg border border-gray-200 w-fit",children:["dashboard","getting-started"].map(i=>t.jsxs("button",{onClick:()=>s(i),className:`${o===i?"":"hover:text-gray-900 hover:bg-gray-100"} relative rounded-md px-4 py-2 text-sm font-medium text-gray-600 outline-sky-400 transition focus-visible:outline-2`,style:{WebkitTapHighlightColor:"transparent"},children:[o===i&&t.jsx(ae.span,{layoutId:"bubble",className:"absolute inset-0 z-10 bg-blue-600",style:{borderRadius:6},transition:{type:"spring",bounce:.2,duration:.6}}),t.jsx("span",{className:`relative z-10 ${o===i?"text-white":"text-gray-600"}`,children:i==="dashboard"?"Dashboard":"Getting Started"})]},i))}),o==="dashboard"?t.jsxs("div",{className:"flex flex-col gap-4 animate-tab-fade",children:[t.jsx(oe,{}),t.jsx(he,{})]},"dashboard"):t.jsx("div",{className:"animate-tab-fade",children:t.jsx(ke,{onStepClick:y,onImprovementClick:m})},"getting-started")]})}),n&&t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-[1400]",onClick:u,"aria-hidden":"true"}),t.jsx("div",{className:"fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none",children:t.jsxs("div",{ref:d,className:"bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto",onClick:k,children:[t.jsx("button",{onClick:u,className:"absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white/90 rounded-lg transition-colors z-10","aria-label":"Close",children:t.jsx(te,{className:"w-5 h-5 text-gray-500"})}),t.jsx("div",{className:"relative h-[80vh] min-h-[600px]",children:t.jsx(ue,{url:v,styles:{height:"100%",width:"100%"},pageSettings:{backgroundColor:"ffffff",hideEventTypeDetails:!1,hideLandingPageDetails:!1,primaryColor:"4caf50",textColor:"4d5055"},prefill:{name:c?.name||"",email:c?.email||""},utm:{utmCampaign:"developer-meeting",utmSource:"ziplofy",utmMedium:"website"}})})]})})]})]})}export{_e as default};
