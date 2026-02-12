import{r as l,b as Q,aP as X,j as e,aQ as Z,aq as J,O as C,aR as K,k as ee}from"./index-C7S6h9OR.js";import{r as ne}from"./index-CCB_rw4P.js";import{D as te}from"./DashboardContent-DKRcVUNv.js";import{F as V}from"./ChevronRightIcon-CVun6pAX.js";import{m as oe}from"./proxy-CoZgL1SH.js";import"./CurrencyDollarIcon-CizKWQ8x.js";var N=function(n,t){return N=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,o){a.__proto__=o}||function(a,o){for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(a[r]=o[r])},N(n,t)};function f(n,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");N(n,t);function a(){this.constructor=n}n.prototype=t===null?Object.create(t):(a.prototype=t.prototype,new a)}var x=function(){return x=Object.assign||function(t){for(var a,o=1,r=arguments.length;o<r;o++){a=arguments[o];for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(t[i]=a[i])}return t},x.apply(this,arguments)};function ae(n,t){t===void 0&&(t={});var a=t.insertAt;if(!(typeof document>"u")){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",a==="top"&&o.firstChild?o.insertBefore(r,o.firstChild):o.appendChild(r),r.styleSheet?r.styleSheet.cssText=n:r.appendChild(document.createTextNode(n))}}var le=`/*
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
`;ae(le);function j(n){return n.charAt(0)==="#"?n.slice(1):n}function re(n){return n?.primaryColor&&(n.primaryColor=j(n.primaryColor)),n?.textColor&&(n.textColor=j(n.textColor)),n?.backgroundColor&&(n.backgroundColor=j(n.backgroundColor)),n}var U;(function(n){n.PROFILE_PAGE_VIEWED="calendly.profile_page_viewed",n.EVENT_TYPE_VIEWED="calendly.event_type_viewed",n.DATE_AND_TIME_SELECTED="calendly.date_and_time_selected",n.EVENT_SCHEDULED="calendly.event_scheduled",n.PAGE_HEIGHT="calendly.page_height"})(U||(U={}));var H=function(n){var t=n.url,a=n.prefill,o=a===void 0?{}:a,r=n.pageSettings,i=r===void 0?{}:r,u=n.utm,m=u===void 0?{}:u,c=n.embedType,d=re(i),p=d.backgroundColor,v=d.hideEventTypeDetails,b=d.hideLandingPageDetails,s=d.primaryColor,h=d.textColor,y=d.hideGdprBanner,E=o.customAnswers,w=o.date,S=o.email,_=o.firstName,L=o.guests,M=o.lastName,T=o.location,I=o.name,D=m.utmCampaign,P=m.utmContent,R=m.utmMedium,z=m.utmSource,A=m.utmTerm,W=m.salesforce_uuid,k=t.indexOf("?"),O=k>-1,G=t.slice(k+1),$=O?t.slice(0,k):t,Y=[O?G:null,p?"background_color=".concat(p):null,v?"hide_event_type_details=1":null,b?"hide_landing_page_details=1":null,s?"primary_color=".concat(s):null,h?"text_color=".concat(h):null,y?"hide_gdpr_banner=1":null,I?"name=".concat(encodeURIComponent(I)):null,T?"location=".concat(encodeURIComponent(T)):null,_?"first_name=".concat(encodeURIComponent(_)):null,M?"last_name=".concat(encodeURIComponent(M)):null,L?"guests=".concat(L.map(encodeURIComponent).join(",")):null,S?"email=".concat(encodeURIComponent(S)):null,w&&w instanceof Date?"date=".concat(ie(w)):null,D?"utm_campaign=".concat(encodeURIComponent(D)):null,P?"utm_content=".concat(encodeURIComponent(P)):null,R?"utm_medium=".concat(encodeURIComponent(R)):null,z?"utm_source=".concat(encodeURIComponent(z)):null,A?"utm_term=".concat(encodeURIComponent(A)):null,W?"salesforce_uuid=".concat(encodeURIComponent(W)):null,c?"embed_type=".concat(c):null,"embed_domain=1"].concat(E?de(E):[]).filter(function(q){return q!==null}).join("&");return"".concat($,"?").concat(Y)},ie=function(n){var t=n.getMonth()+1,a=n.getDate(),o=n.getFullYear();return[o,t<10?"0".concat(t):t,a<10?"0".concat(a):a].join("-")},se=/^a\d{1,2}$/,de=function(n){var t=Object.keys(n).filter(function(a){return a.match(se)});return t.length?t.map(function(a){return"".concat(a,"=").concat(encodeURIComponent(n[a]))}):[]},B=(function(n){f(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.render=function(){return l.createElement("div",{className:"calendly-spinner"},l.createElement("div",{className:"calendly-bounce1"}),l.createElement("div",{className:"calendly-bounce2"}),l.createElement("div",{className:"calendly-bounce3"}))},t})(l.Component),ce="calendly-inline-widget",me=(function(n){f(t,n);function t(a){var o=n.call(this,a)||this;return o.state={isLoading:!0},o.onLoad=o.onLoad.bind(o),o}return t.prototype.onLoad=function(){this.setState({isLoading:!1})},t.prototype.render=function(){var a=H({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),o=this.props.LoadingSpinner||B;return l.createElement("div",{className:this.props.className||ce,style:this.props.styles||{}},this.state.isLoading&&l.createElement(o,null),l.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:a}))},t})(l.Component),ue=(function(n){f(t,n);function t(a){var o=n.call(this,a)||this;return o.state={isLoading:!0},o.onLoad=o.onLoad.bind(o),o}return t.prototype.onLoad=function(){this.setState({isLoading:!1})},t.prototype.render=function(){var a=H({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),o=this.props.LoadingSpinner||B;return l.createElement(l.Fragment,null,this.state.isLoading&&l.createElement(o,null),l.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:a}))},t})(l.Component),F=(function(n){if(!n.open)return null;if(!n.rootElement)throw new Error("[react-calendly]: PopupModal rootElement property cannot be undefined");return ne.createPortal(l.createElement("div",{className:"calendly-overlay"},l.createElement("div",{onClick:n.onModalClose,className:"calendly-close-overlay"}),l.createElement("div",{className:"calendly-popup"},l.createElement("div",{className:"calendly-popup-content"},l.createElement(ue,x({},n)))),l.createElement("button",{className:"calendly-popup-close",onClick:n.onModalClose,"aria-label":"Close modal",style:{display:"block",border:"none",padding:0}})),n.rootElement)});(function(n){f(t,n);function t(a){var o=n.call(this,a)||this;return o.state={isOpen:!1},o.onClick=o.onClick.bind(o),o.onClose=o.onClose.bind(o),o}return t.prototype.onClick=function(a){a.preventDefault(),this.setState({isOpen:!0})},t.prototype.onClose=function(a){a.stopPropagation(),this.setState({isOpen:!1})},t.prototype.render=function(){return l.createElement(l.Fragment,null,l.createElement("button",{onClick:this.onClick,style:this.props.styles||{},className:this.props.className||""},this.props.text),l.createElement(F,x({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},t})(l.Component);(function(n){f(t,n);function t(a){var o=n.call(this,a)||this;return o.state={isOpen:!1},o.onClick=o.onClick.bind(o),o.onClose=o.onClose.bind(o),o}return t.prototype.onClick=function(){this.setState({isOpen:!0})},t.prototype.onClose=function(a){a.stopPropagation(),this.setState({isOpen:!1})},t.prototype.render=function(){return l.createElement("div",{className:"calendly-badge-widget",onClick:this.onClick},l.createElement("div",{className:"calendly-badge-content",style:{background:this.props.color||"#00a2ff",color:this.props.textColor||"#ffffff"}},this.props.text||"Schedule time with me",this.props.branding&&l.createElement("span",null,"powered by Calendly")),l.createElement(F,x({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},t})(l.Component);const pe=()=>{const{activeStoreId:n}=Q(),{storeSubdomain:t,getByStoreId:a,loading:o,error:r}=X();l.useEffect(()=>{n&&a(n)},[n,a]);const i=l.useCallback(()=>{console.log("Manage domain clicked")},[]);return e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Customize your domain"}),r?e.jsx("p",{className:"text-sm text-red-600",children:r}):e.jsxs("p",{className:"text-sm text-gray-600",children:["Default domain:"," ",o?"Loading...":t?.url?e.jsx("a",{href:t.url,target:"_blank",rel:"noopener noreferrer",className:"text-gray-900 hover:underline",children:t.url.replace(/^https?:\/\//,"")}):"—"]})]}),e.jsx("button",{onClick:i,className:"px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors",children:"Manage"})]})},he=({steps:n=[{id:"theme",title:"Make your store stand out with the right theme",buttonText:"Configure Theme",buttonVariant:"primary"},{id:"domain",title:"Set your own domain for your store",description:"Added Domain: fashion-0-60058040737.ziplofy.com",buttonText:"Add Domain",buttonVariant:"primary"},{id:"items",title:"Add all the items that you'll be selling on your store",buttonText:"Add Items",buttonVariant:"primary"},{id:"shipping",title:"Set up shipping zones to deliver your items efficiently",buttonText:"Added",buttonVariant:"added"},{id:"payment",title:"Connect payment gateways to start accepting online payments",buttonText:"Configure Online Payments",buttonVariant:"primary"}],onStepClick:t,onTestOrderClick:a})=>{const o=l.useCallback(i=>{t?t(i):console.log("Step clicked:",i)},[t]),r=l.useCallback(()=>{a?a():console.log("Test order clicked")},[a]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h2",{className:"text-base font-semibold text-gray-900",children:"Complete these few steps to launch your store"})}),e.jsx("div",{className:"space-y-3 mb-4",children:n.map(i=>e.jsxs("div",{className:"flex items-center justify-between gap-4 p-4 bg-page-background-color rounded-lg border border-gray-200/80",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-sm font-medium text-gray-900 mb-0.5",children:i.title}),i.description&&e.jsx("p",{className:"text-xs text-gray-500 truncate mt-0.5",children:i.description})]}),e.jsx("button",{onClick:()=>o(i.id),className:`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${i.buttonVariant==="added"?"bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100":"bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"}`,children:i.buttonText})]},i.id))}),e.jsx("div",{className:"bg-blue-600 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-0.5",children:"Try placing a test order yourself"}),e.jsx("p",{className:"text-xs text-blue-100",children:"Experience how the process works from start to finish"})]}),e.jsx("button",{onClick:r,className:"px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0",children:"See How It Works"})]})})]})},ge=({resource:n,onClick:t})=>e.jsxs("button",{onClick:()=>t?.(n.id),className:"w-full flex items-center gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[e.jsx("div",{className:"flex-shrink-0 w-5 h-5 flex items-center justify-center",children:n.icon}),e.jsx("div",{className:"flex-1 min-w-0",children:e.jsx("p",{className:"text-sm font-medium text-gray-900",children:n.title})}),e.jsx("div",{className:"flex-shrink-0",children:e.jsx(V,{className:"w-4 h-4 text-blue-500"})})]}),xe=({resources:n=[{id:"help-center",title:"Visit our Help Center",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})})},{id:"academy",title:"Try our Academy Page",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})},{id:"forum",title:"Try our Forum Area",icon:e.jsx("svg",{className:"w-6 h-6 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}],onResourceClick:t})=>{const a=l.useCallback(o=>{t?t(o):console.log("Resource clicked:",o)},[t]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Other Helpful Resources"})}),e.jsx("div",{className:"space-y-2.5",children:n.map(o=>e.jsx(ge,{resource:o,onClick:a},o.id))})]})},g=({item:n,onClick:t})=>e.jsxs("button",{onClick:()=>t?.(n.id),className:"w-full flex items-start gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 flex items-center justify-center",children:n.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-900 mb-1",children:n.title}),e.jsx("p",{className:"text-xs text-gray-600",children:n.description})]}),e.jsx("div",{className:"flex-shrink-0",children:e.jsx(V,{className:"w-4 h-4 text-blue-500"})})]}),fe=({onItemClick:n})=>{const t=l.useCallback(a=>{n?n(a):console.log("Improvement item clicked:",a)},[n]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Here are some ways to improve your store"})}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[e.jsx(g,{item:{id:"taxes",title:"Set Up taxes",description:"Configure Tax Rates & Rules to boost Sales",icon:e.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("circle",{cx:"7",cy:"11",r:"2.5",strokeWidth:1.5}),e.jsx("circle",{cx:"15",cy:"13",r:"2.5",strokeWidth:1.5}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M7 11l8 2"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v3m0 10v3"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M19 6l-3 3M5 16l3-3"})]})},onClick:t}),e.jsx(g,{item:{id:"collections",title:"Manage Collections",description:"Combine different items to show under a common filter",icon:e.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("rect",{x:"6",y:"4",width:"12",height:"4",rx:"1",strokeWidth:1.5}),e.jsx("rect",{x:"6",y:"10",width:"12",height:"4",rx:"1",strokeWidth:1.5}),e.jsx("rect",{x:"6",y:"16",width:"12",height:"4",rx:"1",strokeWidth:1.5})]})},onClick:t}),e.jsx(g,{item:{id:"digital-downloads",title:"Enable Digital Downloads",description:"Add digital files to be downloaded with orders",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"})})},onClick:t})]}),e.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[e.jsx(g,{item:{id:"coupons",title:"Create Coupons",description:"Add and manage discounts for orders",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"})})},onClick:t}),e.jsx(g,{item:{id:"shipping",title:"Shipping Integration",description:"Integrate with shipping carriers for real-time tracking and shipping",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"})})},onClick:t})]})]})]})},be=({videoUrl:n,title:t="Watch a quick overview video",onPlay:a})=>e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Watch a quick overview video"})}),e.jsx("div",{className:"relative w-full aspect-video bg-gray-600 rounded-lg overflow-hidden",children:n?e.jsx("iframe",{src:n,className:"w-full h-full",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,title:"Overview Video"}):e.jsx("div",{className:"w-full h-full bg-gray-600"})})]}),ye=({onStepClick:n,onTestOrderClick:t,onImprovementClick:a,onResourceClick:o})=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome to ",e.jsx("span",{className:"text-blue-600",children:"Ziplofy"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Let's set up your e-commerce store and manage your business effectively"})]}),e.jsx(he,{onStepClick:n,onTestOrderClick:t}),e.jsx(fe,{onItemClick:a}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(be,{}),e.jsx(xe,{onResourceClick:o})]})]});function Ee(){const[n,t]=l.useState(!1),[a,o]=l.useState("dashboard"),{socket:r}=Z(),{loggedInUser:i}=J(),u=l.useRef(null);l.useCallback(()=>{r&&r.connected?r.emit("hireDeveloper"):C.error("socket not connected")},[r]),l.useCallback(()=>{r&&r.connected?(r.emit(K.EndMeeting),C.success("we have notified the developer to send requirements form, so that you can approve it")):C.error("Socket not connected")},[r,i?.assignedSupportDeveloperId?.id]),l.useCallback(()=>{t(!0)},[]);const m=l.useMemo(()=>{if(!i?.assignedSupportDeveloperId)return console.log("No assigned developer found"),"https://calendly.com/default/30min";const s=i.assignedSupportDeveloperId?.email;console.log("Developer email:",s);const h="gibberish";console.log("Extracted username:",h);const y=`https://calendly.com/${h}/30min`;return console.log("Generated Calendly URL:",y),y},[i?.assignedSupportDeveloperId]),c=l.useCallback(()=>{t(!1)},[]),d=l.useCallback(s=>{u.current&&!u.current.contains(s.target)&&c()},[c]),p=l.useCallback(s=>{s.key==="Escape"&&n&&c()},[n,c]),v=l.useCallback(s=>{s.stopPropagation()},[]);l.useCallback(()=>{console.log("Ask AI clicked")},[]),l.useCallback(()=>{console.log("Get tasks updates clicked")},[]),l.useCallback(()=>{console.log("Create workspace clicked")},[]),l.useCallback(()=>{console.log("Connect apps clicked")},[]),l.useEffect(()=>(n&&(document.addEventListener("mousedown",d),document.body.style.overflow="hidden"),()=>{document.removeEventListener("mousedown",d),document.body.style.overflow="unset"}),[n,d]),l.useEffect(()=>(n&&document.addEventListener("keydown",p),()=>{document.removeEventListener("keydown",p)}),[n,p]);const b=i?.name?.split(" ")[0]||"User";return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"min-h-screen bg-page-background-color",children:e.jsxs("div",{className:"max-w-[1400px] mx-auto px-3 sm:px-4 py-4",children:[e.jsxs("div",{className:"mb-4",children:[e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome back",b!=="User"?`, ${b}`:""]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Here's what's happening with your store today"})]}),e.jsx("div",{className:"flex items-center gap-1 mb-8 p-1 bg-white rounded-lg border border-gray-200 w-fit",children:["dashboard","getting-started"].map(s=>e.jsxs("button",{onClick:()=>o(s),className:`${a===s?"":"hover:text-gray-900 hover:bg-gray-100"} relative rounded-md px-4 py-2 text-sm font-medium text-gray-600 outline-sky-400 transition focus-visible:outline-2`,style:{WebkitTapHighlightColor:"transparent"},children:[a===s&&e.jsx(oe.span,{layoutId:"bubble",className:"absolute inset-0 z-10 bg-blue-600",style:{borderRadius:6},transition:{type:"spring",bounce:.2,duration:.6}}),e.jsx("span",{className:`relative z-10 ${a===s?"text-white":"text-gray-600"}`,children:s==="dashboard"?"Dashboard":"Getting Started"})]},s))}),a==="dashboard"?e.jsxs("div",{className:"flex flex-col gap-4 animate-tab-fade",children:[e.jsx(te,{}),e.jsx(pe,{})]},"dashboard"):e.jsx("div",{className:"animate-tab-fade",children:e.jsx(ye,{})},"getting-started")]})}),n&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-[1400]",onClick:c,"aria-hidden":"true"}),e.jsx("div",{className:"fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none",children:e.jsxs("div",{ref:u,className:"bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto",onClick:v,children:[e.jsx("button",{onClick:c,className:"absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white/90 rounded-lg transition-colors z-10","aria-label":"Close",children:e.jsx(ee,{className:"w-5 h-5 text-gray-500"})}),e.jsx("div",{className:"relative h-[80vh] min-h-[600px]",children:e.jsx(me,{url:m,styles:{height:"100%",width:"100%"},pageSettings:{backgroundColor:"ffffff",hideEventTypeDetails:!1,hideLandingPageDetails:!1,primaryColor:"4caf50",textColor:"4d5055"},prefill:{name:i?.name||"",email:i?.email||""},utm:{utmCampaign:"developer-meeting",utmSource:"ziplofy",utmMedium:"website"}})})]})})]})]})}export{Ee as default};
