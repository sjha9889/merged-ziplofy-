import{r as a,j as e,b as oe,aY as ae,u as B,t as se,k as G,$ as ie,aZ as re,o as le,aa as ce,aC as de,y as ue,aJ as me,aK as pe,a_ as he,aq as ge,Z as O,a$ as fe}from"./index-ae4g0uFS.js";import{r as xe}from"./index-Bry1k487.js";import{D as be}from"./DashboardContent-jqBiiivo.js";import{F as Y}from"./ChevronRightIcon-crOm46rF.js";import{M as ye,u as q,P as ve,a as we,b as ke,L as Ce,m as w}from"./proxy-Cl1kXQeG.js";import{F as Z}from"./CheckIcon-DdSHbDVl.js";import{F as je}from"./ArrowRightIcon-DPzjzi_w.js";import"./CurrencyDollarIcon-HBGc_xtq.js";class Ne extends a.Component{getSnapshotBeforeUpdate(o){const s=this.props.childRef.current;if(s&&o.isPresent&&!this.props.isPresent){const n=this.props.sizeRef.current;n.height=s.offsetHeight||0,n.width=s.offsetWidth||0,n.top=s.offsetTop,n.left=s.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function Se({children:t,isPresent:o}){const s=a.useId(),n=a.useRef(null),u=a.useRef({width:0,height:0,top:0,left:0}),{nonce:m}=a.useContext(ye);return a.useInsertionEffect(()=>{const{width:b,height:d,top:g,left:i}=u.current;if(o||!n.current||!b||!d)return;n.current.dataset.motionPopId=s;const h=document.createElement("style");return m&&(h.nonce=m),document.head.appendChild(h),h.sheet&&h.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${b}px !important;
            height: ${d}px !important;
            top: ${g}px !important;
            left: ${i}px !important;
          }
        `),()=>{document.head.removeChild(h)}},[o]),e.jsx(Ne,{isPresent:o,childRef:n,sizeRef:u,children:a.cloneElement(t,{ref:n})})}const Ee=({children:t,initial:o,isPresent:s,onExitComplete:n,custom:u,presenceAffectsLayout:m,mode:b})=>{const d=q(Le),g=a.useId(),i=a.useCallback(y=>{d.set(y,!0);for(const p of d.values())if(!p)return;n&&n()},[d,n]),h=a.useMemo(()=>({id:g,initial:o,isPresent:s,custom:u,onExitComplete:i,register:y=>(d.set(y,!1),()=>d.delete(y))}),m?[Math.random(),i]:[s,i]);return a.useMemo(()=>{d.forEach((y,p)=>d.set(p,!1))},[s]),a.useEffect(()=>{!s&&!d.size&&n&&n()},[s]),b==="popLayout"&&(t=e.jsx(Se,{isPresent:s,children:t})),e.jsx(ve.Provider,{value:h,children:t})};function Le(){return new Map}const M=t=>t.key||"";function V(t){const o=[];return a.Children.forEach(t,s=>{a.isValidElement(s)&&o.push(s)}),o}const _e=({children:t,custom:o,initial:s=!0,onExitComplete:n,presenceAffectsLayout:u=!0,mode:m="sync",propagate:b=!1})=>{const[d,g]=we(b),i=a.useMemo(()=>V(t),[t]),h=b&&!d?[]:i.map(M),y=a.useRef(!0),p=a.useRef(i),k=q(()=>new Map),[f,N]=a.useState(i),[x,S]=a.useState(i);ke(()=>{y.current=!1,p.current=i;for(let c=0;c<x.length;c++){const r=M(x[c]);h.includes(r)?k.delete(r):k.get(r)!==!0&&k.set(r,!1)}},[x,h.length,h.join("-")]);const C=[];if(i!==f){let c=[...i];for(let r=0;r<x.length;r++){const j=x[r],E=M(j);h.includes(E)||(c.splice(r,0,j),C.push(j))}m==="wait"&&C.length&&(c=C),S(V(c)),N(i);return}const{forceRender:l}=a.useContext(Ce);return e.jsx(e.Fragment,{children:x.map(c=>{const r=M(c),j=b&&!d?!1:i===x||h.includes(r),E=()=>{if(k.has(r))k.set(r,!0);else return;let v=!0;k.forEach(R=>{R||(v=!1)}),v&&(l?.(),S(p.current),b&&g?.(),n&&n())};return e.jsx(Ee,{isPresent:j,initial:!y.current||s?void 0:!1,custom:j?void 0:o,presenceAffectsLayout:u,mode:m,onExitComplete:j?void 0:E,children:c},r)})})};var W=function(t,o){return W=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(s,n){s.__proto__=n}||function(s,n){for(var u in n)Object.prototype.hasOwnProperty.call(n,u)&&(s[u]=n[u])},W(t,o)};function z(t,o){if(typeof o!="function"&&o!==null)throw new TypeError("Class extends value "+String(o)+" is not a constructor or null");W(t,o);function s(){this.constructor=t}t.prototype=o===null?Object.create(o):(s.prototype=o.prototype,new s)}var T=function(){return T=Object.assign||function(o){for(var s,n=1,u=arguments.length;n<u;n++){s=arguments[n];for(var m in s)Object.prototype.hasOwnProperty.call(s,m)&&(o[m]=s[m])}return o},T.apply(this,arguments)};function Pe(t,o){o===void 0&&(o={});var s=o.insertAt;if(!(typeof document>"u")){var n=document.head||document.getElementsByTagName("head")[0],u=document.createElement("style");u.type="text/css",s==="top"&&n.firstChild?n.insertBefore(u,n.firstChild):n.appendChild(u),u.styleSheet?u.styleSheet.cssText=t:u.appendChild(document.createTextNode(t))}}var Re=`/*
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
`;Pe(Re);function A(t){return t.charAt(0)==="#"?t.slice(1):t}function Ie(t){return t?.primaryColor&&(t.primaryColor=A(t.primaryColor)),t?.textColor&&(t.textColor=A(t.textColor)),t?.backgroundColor&&(t.backgroundColor=A(t.backgroundColor)),t}var H;(function(t){t.PROFILE_PAGE_VIEWED="calendly.profile_page_viewed",t.EVENT_TYPE_VIEWED="calendly.event_type_viewed",t.DATE_AND_TIME_SELECTED="calendly.date_and_time_selected",t.EVENT_SCHEDULED="calendly.event_scheduled",t.PAGE_HEIGHT="calendly.page_height"})(H||(H={}));var K=function(t){var o=t.url,s=t.prefill,n=s===void 0?{}:s,u=t.pageSettings,m=u===void 0?{}:u,b=t.utm,d=b===void 0?{}:b,g=t.embedType,i=Ie(m),h=i.backgroundColor,y=i.hideEventTypeDetails,p=i.hideLandingPageDetails,k=i.primaryColor,f=i.textColor,N=i.hideGdprBanner,x=n.customAnswers,S=n.date,C=n.email,l=n.firstName,c=n.guests,r=n.lastName,j=n.location,E=n.name,v=d.utmCampaign,R=d.utmContent,L=d.utmMedium,_=d.utmSource,I=d.utmTerm,F=d.salesforce_uuid,D=o.indexOf("?"),U=D>-1,J=o.slice(D+1),ee=U?o.slice(0,D):o,te=[U?J:null,h?"background_color=".concat(h):null,y?"hide_event_type_details=1":null,p?"hide_landing_page_details=1":null,k?"primary_color=".concat(k):null,f?"text_color=".concat(f):null,N?"hide_gdpr_banner=1":null,E?"name=".concat(encodeURIComponent(E)):null,j?"location=".concat(encodeURIComponent(j)):null,l?"first_name=".concat(encodeURIComponent(l)):null,r?"last_name=".concat(encodeURIComponent(r)):null,c?"guests=".concat(c.map(encodeURIComponent).join(",")):null,C?"email=".concat(encodeURIComponent(C)):null,S&&S instanceof Date?"date=".concat(Te(S)):null,v?"utm_campaign=".concat(encodeURIComponent(v)):null,R?"utm_content=".concat(encodeURIComponent(R)):null,L?"utm_medium=".concat(encodeURIComponent(L)):null,_?"utm_source=".concat(encodeURIComponent(_)):null,I?"utm_term=".concat(encodeURIComponent(I)):null,F?"salesforce_uuid=".concat(encodeURIComponent(F)):null,g?"embed_type=".concat(g):null,"embed_domain=1"].concat(x?Me(x):[]).filter(function(ne){return ne!==null}).join("&");return"".concat(ee,"?").concat(te)},Te=function(t){var o=t.getMonth()+1,s=t.getDate(),n=t.getFullYear();return[n,o<10?"0".concat(o):o,s<10?"0".concat(s):s].join("-")},ze=/^a\d{1,2}$/,Me=function(t){var o=Object.keys(t).filter(function(s){return s.match(ze)});return o.length?o.map(function(s){return"".concat(s,"=").concat(encodeURIComponent(t[s]))}):[]},Q=(function(t){z(o,t);function o(){return t!==null&&t.apply(this,arguments)||this}return o.prototype.render=function(){return a.createElement("div",{className:"calendly-spinner"},a.createElement("div",{className:"calendly-bounce1"}),a.createElement("div",{className:"calendly-bounce2"}),a.createElement("div",{className:"calendly-bounce3"}))},o})(a.Component),$e="calendly-inline-widget",De=(function(t){z(o,t);function o(s){var n=t.call(this,s)||this;return n.state={isLoading:!0},n.onLoad=n.onLoad.bind(n),n}return o.prototype.onLoad=function(){this.setState({isLoading:!1})},o.prototype.render=function(){var s=K({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),n=this.props.LoadingSpinner||Q;return a.createElement("div",{className:this.props.className||$e,style:this.props.styles||{}},this.state.isLoading&&a.createElement(n,null),a.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:s}))},o})(a.Component),Oe=(function(t){z(o,t);function o(s){var n=t.call(this,s)||this;return n.state={isLoading:!0},n.onLoad=n.onLoad.bind(n),n}return o.prototype.onLoad=function(){this.setState({isLoading:!1})},o.prototype.render=function(){var s=K({url:this.props.url,pageSettings:this.props.pageSettings,prefill:this.props.prefill,utm:this.props.utm,embedType:"Inline"}),n=this.props.LoadingSpinner||Q;return a.createElement(a.Fragment,null,this.state.isLoading&&a.createElement(n,null),a.createElement("iframe",{width:"100%",height:"100%",frameBorder:"0",title:this.props.iframeTitle||"Calendly Scheduling Page",onLoad:this.onLoad,src:s}))},o})(a.Component),X=(function(t){if(!t.open)return null;if(!t.rootElement)throw new Error("[react-calendly]: PopupModal rootElement property cannot be undefined");return xe.createPortal(a.createElement("div",{className:"calendly-overlay"},a.createElement("div",{onClick:t.onModalClose,className:"calendly-close-overlay"}),a.createElement("div",{className:"calendly-popup"},a.createElement("div",{className:"calendly-popup-content"},a.createElement(Oe,T({},t)))),a.createElement("button",{className:"calendly-popup-close",onClick:t.onModalClose,"aria-label":"Close modal",style:{display:"block",border:"none",padding:0}})),t.rootElement)});(function(t){z(o,t);function o(s){var n=t.call(this,s)||this;return n.state={isOpen:!1},n.onClick=n.onClick.bind(n),n.onClose=n.onClose.bind(n),n}return o.prototype.onClick=function(s){s.preventDefault(),this.setState({isOpen:!0})},o.prototype.onClose=function(s){s.stopPropagation(),this.setState({isOpen:!1})},o.prototype.render=function(){return a.createElement(a.Fragment,null,a.createElement("button",{onClick:this.onClick,style:this.props.styles||{},className:this.props.className||""},this.props.text),a.createElement(X,T({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},o})(a.Component);(function(t){z(o,t);function o(s){var n=t.call(this,s)||this;return n.state={isOpen:!1},n.onClick=n.onClick.bind(n),n.onClose=n.onClose.bind(n),n}return o.prototype.onClick=function(){this.setState({isOpen:!0})},o.prototype.onClose=function(s){s.stopPropagation(),this.setState({isOpen:!1})},o.prototype.render=function(){return a.createElement("div",{className:"calendly-badge-widget",onClick:this.onClick},a.createElement("div",{className:"calendly-badge-content",style:{background:this.props.color||"#00a2ff",color:this.props.textColor||"#ffffff"}},this.props.text||"Schedule time with me",this.props.branding&&a.createElement("span",null,"powered by Calendly")),a.createElement(X,T({},this.props,{open:this.state.isOpen,onModalClose:this.onClose,rootElement:this.props.rootElement})))},o})(a.Component);const Ae=()=>{const{activeStoreId:t}=oe(),{storeSubdomain:o,getByStoreId:s,loading:n,error:u}=ae();a.useEffect(()=>{t&&s(t)},[t,s]);const m=a.useCallback(()=>{console.log("Manage domain clicked")},[]);return e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Customize your domain"}),u?e.jsx("p",{className:"text-sm text-red-600",children:u}):e.jsxs("p",{className:"text-sm text-gray-600",children:["Default domain:"," ",n?"Loading...":o?.url?e.jsx("a",{href:o.url,target:"_blank",rel:"noopener noreferrer",className:"text-gray-900 hover:underline",children:o.url.replace(/^https?:\/\//,"")}):"—"]})]}),e.jsx("button",{onClick:m,className:"px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors",children:"Manage"})]})},We=({steps:t=[{id:"theme",title:"Make your store stand out with the right theme",buttonText:"Configure Theme",buttonVariant:"primary"},{id:"domain",title:"Set your own domain for your store",description:"Added Domain: fashion-0-60058040737.ziplofy.com",buttonText:"Add Domain",buttonVariant:"primary"},{id:"items",title:"Add all the items that you'll be selling on your store",buttonText:"Add Items",buttonVariant:"primary"},{id:"shipping",title:"Set up shipping zones to deliver your items efficiently",buttonText:"Setup",buttonVariant:"primary"},{id:"payment",title:"Connect payment gateways to start accepting online payments",buttonText:"Configure Online Payments",buttonVariant:"primary"}],onStepClick:o,onTestOrderClick:s})=>{const n=a.useCallback(m=>{o?o(m):console.log("Step clicked:",m)},[o]),u=a.useCallback(()=>{s?s():console.log("Test order clicked")},[s]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h2",{className:"text-base font-semibold text-gray-900",children:"Complete these few steps to launch your store"})}),e.jsx("div",{className:"space-y-3 mb-4",children:t.map(m=>e.jsxs("div",{className:"flex items-center justify-between gap-4 p-4 bg-page-background-color rounded-lg border border-gray-200/80",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-sm font-medium text-gray-900 mb-0.5",children:m.title}),m.description&&e.jsx("p",{className:"text-xs text-gray-500 truncate mt-0.5",children:m.description})]}),e.jsx("button",{onClick:()=>n(m.id),className:`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${m.buttonVariant==="added"?"bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100":"bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"}`,children:m.buttonText})]},m.id))}),e.jsx("div",{className:"bg-blue-600 rounded-lg p-4",children:e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h3",{className:"text-sm font-semibold text-white mb-0.5",children:"Try placing a test order yourself"}),e.jsx("p",{className:"text-xs text-blue-100",children:"Experience how the process works from start to finish"})]}),e.jsx("button",{onClick:u,className:"px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0",children:"See How It Works"})]})})]})},Fe=({resource:t,onClick:o})=>e.jsxs("button",{onClick:()=>o?.(t.id),className:"w-full flex items-center gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[e.jsx("div",{className:"flex-shrink-0 w-5 h-5 flex items-center justify-center",children:t.icon}),e.jsx("div",{className:"flex-1 min-w-0",children:e.jsx("p",{className:"text-sm font-medium text-gray-900",children:t.title})}),e.jsx("div",{className:"flex-shrink-0",children:e.jsx(Y,{className:"w-4 h-4 text-blue-500"})})]}),Ue=({resources:t=[{id:"help-center",title:"Visit our Help Center",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"})})},{id:"academy",title:"Try our Academy Page",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})},{id:"forum",title:"Try our Forum Area",icon:e.jsx("svg",{className:"w-6 h-6 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})}],onResourceClick:o})=>{const s=a.useCallback(n=>{o?o(n):console.log("Resource clicked:",n)},[o]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Other Helpful Resources"})}),e.jsx("div",{className:"space-y-2.5",children:t.map(n=>e.jsx(Fe,{resource:n,onClick:s},n.id))})]})},$=({item:t,onClick:o})=>e.jsxs("button",{onClick:()=>o?.(t.id),className:"w-full flex items-start gap-3 p-3 bg-page-background-color border border-gray-200/80 rounded-lg hover:bg-blue-50 hover:border-blue-200/80 transition-colors text-left",children:[e.jsx("div",{className:"flex-shrink-0 w-8 h-8 flex items-center justify-center",children:t.icon}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-900 mb-1",children:t.title}),e.jsx("p",{className:"text-xs text-gray-600",children:t.description})]}),e.jsx("div",{className:"flex-shrink-0",children:e.jsx(Y,{className:"w-4 h-4 text-blue-500"})})]}),Ve=({onItemClick:t})=>{const o=a.useCallback(s=>{t?t(s):console.log("Improvement item clicked:",s)},[t]);return e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Here are some ways to improve your store"})}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[e.jsx($,{item:{id:"taxes",title:"Set Up taxes",description:"Configure Tax Rates & Rules to boost Sales",icon:e.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("circle",{cx:"7",cy:"11",r:"2.5",strokeWidth:1.5}),e.jsx("circle",{cx:"15",cy:"13",r:"2.5",strokeWidth:1.5}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M7 11l8 2"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v3m0 10v3"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M19 6l-3 3M5 16l3-3"})]})},onClick:o}),e.jsx($,{item:{id:"collections",title:"Manage Collections",description:"Combine different items to show under a common filter",icon:e.jsxs("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("rect",{x:"6",y:"4",width:"12",height:"4",rx:"1",strokeWidth:1.5}),e.jsx("rect",{x:"6",y:"10",width:"12",height:"4",rx:"1",strokeWidth:1.5}),e.jsx("rect",{x:"6",y:"16",width:"12",height:"4",rx:"1",strokeWidth:1.5})]})},onClick:o})]}),e.jsxs("div",{className:"flex-1 flex gap-2 flex-col",children:[e.jsx($,{item:{id:"coupons",title:"Create Coupons",description:"Add and manage discounts for orders",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"})})},onClick:o}),e.jsx($,{item:{id:"shipping",title:"Shipping Integration",description:"Integrate with shipping carriers for real-time tracking and shipping",icon:e.jsx("svg",{className:"w-5 h-5 text-blue-600",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"})})},onClick:o})]})]})]})},He="/assets/all-about-ziplofy-Bvbz7z7C.png",Be=({videoUrl:t,title:o="Watch a quick overview video",onPlay:s})=>e.jsxs("div",{className:"bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex-1",children:[e.jsx("div",{className:"mb-4 pl-3 border-l-4 border-blue-600",children:e.jsx("h3",{className:"text-base font-semibold text-gray-900",children:"Watch a quick overview video"})}),e.jsx("div",{className:"relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden",children:t?e.jsx("iframe",{src:t,className:"w-full h-full",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0,title:"Overview Video"}):e.jsx("img",{src:He,alt:"All About Ziplofy",className:"w-full h-full object-cover"})})]}),Ge=({onStepClick:t,onTestOrderClick:o,onImprovementClick:s,onResourceClick:n})=>e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome to ",e.jsx("span",{className:"text-blue-600",children:"Ziplofy"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Let's set up your e-commerce store and manage your business effectively"})]}),e.jsx(We,{onStepClick:t,onTestOrderClick:o}),e.jsx(Ve,{onItemClick:s}),e.jsxs("div",{className:"flex gap-4",children:[e.jsx(Be,{}),e.jsx(Ue,{onResourceClick:n})]})]}),P=[{id:"welcome",title:"Welcome to Ziplofy! 🎉",description:"We're excited to have you here! Let's take a quick tour to help you get started with managing your store.",icon:e.jsx(ie,{className:"w-7 h-7"}),position:"center",action:"next"},{id:"home",title:"Dashboard Overview",description:"This is your home dashboard. View your sales, revenue, and key metrics at a glance.",icon:e.jsx(re,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-home"]',targetPath:"/",position:"right",action:"next"},{id:"products",title:"Manage Products",description:"Add products, manage inventory, create collections, and organize your entire catalog.",icon:e.jsx(le,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-products"]',targetPath:"/products",position:"right",action:"next"},{id:"orders",title:"Handle Orders",description:"Process customer orders, manage fulfillment, handle returns, and track shipments.",icon:e.jsx(ce,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-orders"]',targetPath:"/orders",position:"right",action:"next"},{id:"customers",title:"Customer Management",description:"View customer details, create segments, and build lasting relationships with your buyers.",icon:e.jsx(de,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-customers"]',targetPath:"/customers",position:"right",action:"next"},{id:"discounts",title:"Create Discounts",description:"Set up discount codes, automatic promotions, and special offers to boost your sales.",icon:e.jsx(ue,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-discounts"]',targetPath:"/discounts",position:"right",action:"next"},{id:"analytics",title:"View Analytics",description:"Track your store performance with detailed reports and real-time analytics.",icon:e.jsx(me,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-analytics"]',targetPath:"/analytics",position:"right",action:"next"},{id:"settings",title:"Store Settings",description:"Configure payments, shipping, taxes, domains, and customize your store experience.",icon:e.jsx(pe,{className:"w-5 h-5"}),targetSelector:'[data-tour-id="nav-settings"]',targetPath:"/settings/general",position:"right",action:"next"},{id:"complete",title:"You're All Set! 🚀",description:"Congratulations! You now know your way around Ziplofy. Start building your successful online business!",icon:e.jsx(Z,{className:"w-7 h-7"}),position:"center",action:"next"}],Ye=({onComplete:t})=>{const o=B(),s=se(),[n,u]=a.useState(()=>{const c=localStorage.getItem("ziplofy_onboarding_step");return c?parseInt(c,10):0}),[m,b]=a.useState(!0),[d,g]=a.useState({top:0,left:0,arrowPosition:"none"}),[i,h]=a.useState(null),y=a.useRef(null),p=P[n],k=(n+1)/P.length*100,f=a.useCallback(()=>{if(!p.targetSelector){h(null),g({top:0,left:0,arrowPosition:"none"});return}const c=document.querySelector(p.targetSelector);if(!c){h(null);return}const r=c.getBoundingClientRect();h(r);const j=340,E=220,v=16,R=20;let L=r.top+r.height/2-E/2,_=r.right+v,I="left";_+j>window.innerWidth-v&&(_=r.left-j-v,I="left"),L<v?L=v:L+E>window.innerHeight-v&&(L=window.innerHeight-E-v),(p.position==="bottom"||p.position==="bottom-right")&&(L=r.bottom+v+R,_=r.left,I="top"),g({top:L,left:_,arrowPosition:I})},[p]);a.useEffect(()=>{f(),window.addEventListener("resize",f),window.addEventListener("scroll",f);const c=setTimeout(f,100);return()=>{window.removeEventListener("resize",f),window.removeEventListener("scroll",f),clearTimeout(c)}},[f,n]),a.useEffect(()=>{localStorage.setItem("ziplofy_onboarding_step",n.toString())},[n]);const N=a.useCallback(()=>{if(n<P.length-1){const c=P[n+1];c.targetPath&&s.pathname!==c.targetPath&&o(c.targetPath),u(r=>r+1)}else S()},[n,s.pathname,o]),x=a.useCallback(()=>{S()},[]),S=a.useCallback(()=>{b(!1),localStorage.removeItem("ziplofy_onboarding_step"),setTimeout(()=>{localStorage.setItem("ziplofy_onboarding_complete","true"),t()},300)},[t]),C=a.useCallback(c=>{c.key==="Escape"?x():c.key==="ArrowRight"||c.key==="Enter"?N():c.key==="ArrowLeft"&&n>0&&u(r=>r-1)},[N,x,n]);a.useEffect(()=>(window.addEventListener("keydown",C),()=>window.removeEventListener("keydown",C)),[C]);const l=p.position==="center"||!p.targetSelector;return e.jsx(_e,{children:m&&e.jsxs(e.Fragment,{children:[e.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:"fixed inset-0 z-[9998] pointer-events-none",style:{background:"rgba(0,0,0,0.75)",clipPath:i?`polygon(
                    0% 0%, 
                    0% 100%, 
                    ${i.left-8}px 100%, 
                    ${i.left-8}px ${i.top-8}px, 
                    ${i.right+8}px ${i.top-8}px, 
                    ${i.right+8}px ${i.bottom+8}px, 
                    ${i.left-8}px ${i.bottom+8}px, 
                    ${i.left-8}px 100%, 
                    100% 100%, 
                    100% 0%
                  )`:"none"}}),i&&e.jsx(w.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.3},className:"fixed z-[9999] pointer-events-none",style:{top:i.top-8,left:i.left-8,width:i.width+16,height:i.height+16,borderRadius:"12px",border:"3px solid #3b82f6",boxShadow:"0 0 20px 4px rgba(59, 130, 246, 0.5), inset 0 0 20px 4px rgba(59, 130, 246, 0.1)",background:"transparent"}}),i&&e.jsx(w.div,{initial:{opacity:0},animate:{opacity:[.4,.8,.4],scale:[1,1.1,1]},transition:{duration:2,repeat:1/0,ease:"easeInOut"},className:"fixed z-[9997] pointer-events-none",style:{top:i.top-12,left:i.left-12,width:i.width+24,height:i.height+24,borderRadius:"16px",border:"2px solid rgba(59, 130, 246, 0.6)",background:"transparent"}}),e.jsxs(w.div,{ref:y,initial:{opacity:0,scale:.9,y:l?20:0,x:l?0:-10},animate:{opacity:1,scale:1,y:0,x:0},exit:{opacity:0,scale:.9},transition:{type:"spring",damping:25,stiffness:300},className:"fixed z-[10000]",style:l?{left:"50%",top:"50%",transform:"translate(-50%, -50%)"}:{top:d.top,left:d.left},children:[e.jsxs("div",{className:"relative bg-white rounded-2xl shadow-2xl w-[340px] overflow-hidden",children:[!l&&d.arrowPosition==="left"&&e.jsx("div",{className:"absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0",style:{borderTop:"10px solid transparent",borderBottom:"10px solid transparent",borderRight:"10px solid white"}}),!l&&d.arrowPosition==="top"&&e.jsx("div",{className:"absolute left-8 -top-2 w-0 h-0",style:{borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderBottom:"10px solid white"}}),e.jsx("div",{className:"h-1 bg-gray-100",children:e.jsx(w.div,{className:"h-full bg-gradient-to-r from-blue-500 to-blue-600",initial:{width:0},animate:{width:`${k}%`},transition:{duration:.3}})}),e.jsxs("div",{className:"p-5",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("div",{className:"flex items-center gap-1.5",children:P.map((c,r)=>e.jsx(w.div,{className:`h-1.5 rounded-full transition-all duration-300 ${r===n?"w-5 bg-blue-500":r<n?"w-1.5 bg-blue-300":"w-1.5 bg-gray-200"}`},r))}),e.jsx("button",{onClick:x,className:"p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors",children:e.jsx(G,{className:"w-4 h-4"})})]}),e.jsx(w.div,{initial:{scale:0,rotate:-180},animate:{scale:1,rotate:0},transition:{type:"spring",damping:15,stiffness:200},className:`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.id==="welcome"||p.id==="complete"?"bg-gradient-to-br from-blue-500 to-purple-600 text-white":"bg-blue-50 text-blue-600"}`,children:p.icon},p.id),e.jsxs(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{delay:.1},children:[e.jsx("h3",{className:"text-lg font-bold text-gray-900 mb-2",children:p.title}),e.jsx("p",{className:"text-sm text-gray-500 leading-relaxed mb-5",children:p.description})]},`content-${p.id}`),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("button",{onClick:x,className:"text-xs text-gray-400 hover:text-gray-600 transition-colors",children:"Skip tour"}),e.jsxs("div",{className:"flex items-center gap-2",children:[n>0&&e.jsx(w.button,{initial:{opacity:0,x:10},animate:{opacity:1,x:0},onClick:()=>{const c=P[n-1];c.targetPath&&o(c.targetPath),u(r=>r-1)},className:"px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors",children:"Back"}),e.jsx(w.button,{whileHover:{scale:1.02},whileTap:{scale:.98},onClick:N,className:"inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25",children:n===P.length-1?e.jsxs(e.Fragment,{children:[e.jsx(Z,{className:"w-3.5 h-3.5"}),"Get Started"]}):e.jsxs(e.Fragment,{children:["Next",e.jsx(je,{className:"w-3.5 h-3.5"})]})})]})]})]}),e.jsx("div",{className:"absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"})]}),l&&e.jsxs(e.Fragment,{children:[e.jsx(w.div,{animate:{y:[0,-8,0],rotate:[0,5,0]},transition:{duration:3,repeat:1/0,ease:"easeInOut"},className:"absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-lg shadow-lg",children:"✨"}),e.jsx(w.div,{animate:{y:[0,8,0],rotate:[0,-5,0]},transition:{duration:4,repeat:1/0,ease:"easeInOut",delay:.5},className:"absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-base shadow-lg",children:"🚀"})]})]}),e.jsxs(w.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},className:"fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-4 text-white/50 text-xs",children:[e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 bg-white/10 rounded text-[10px]",children:"←"}),e.jsx("kbd",{className:"px-1.5 py-0.5 bg-white/10 rounded text-[10px]",children:"→"}),"Navigate"]}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("kbd",{className:"px-1.5 py-0.5 bg-white/10 rounded text-[10px]",children:"Esc"}),"Skip"]})]})]})})};function nt(){const t=B(),[o,s]=a.useState(!1),[n,u]=a.useState("dashboard"),[m,b]=a.useState(!1),{socket:d}=he(),{loggedInUser:g}=ge();a.useEffect(()=>{const l=()=>{b(!0)};return window.addEventListener("ziplofy-show-tour",l),()=>{window.removeEventListener("ziplofy-show-tour",l)}},[]);const i=a.useCallback(()=>{b(!1)},[]),h=a.useRef(null);a.useCallback(()=>{d&&d.connected?d.emit("hireDeveloper"):O.error("socket not connected")},[d]),a.useCallback(()=>{d&&d.connected?(d.emit(fe.EndMeeting),O.success("we have notified the developer to send requirements form, so that you can approve it")):O.error("Socket not connected")},[d,g?.assignedSupportDeveloperId?.id]),a.useCallback(()=>{s(!0)},[]);const y=a.useCallback(l=>{switch(l){case"items":t("/products");break;case"theme":t("/themes/all-themes");break;case"domain":t("/settings/domains");break;case"shipping":t("/settings/shipping-and-delivery");break;case"payment":t("/settings/payments");break;default:console.log("Step clicked:",l)}},[t]),p=a.useCallback(l=>{switch(l){case"taxes":t("/settings/taxes-and-duties");break;case"collections":t("/products/collections");break;case"coupons":t("/discounts");break;case"shipping":t("/settings/shipping-and-delivery");break;case"digital-downloads":t("/settings/digital-downloads");break;default:console.log("Improvement item clicked:",l)}},[t]),k=a.useMemo(()=>{if(!g?.assignedSupportDeveloperId)return console.log("No assigned developer found"),"https://calendly.com/default/30min";const l=g.assignedSupportDeveloperId?.email;console.log("Developer email:",l);const c="gibberish";console.log("Extracted username:",c);const r=`https://calendly.com/${c}/30min`;return console.log("Generated Calendly URL:",r),r},[g?.assignedSupportDeveloperId]),f=a.useCallback(()=>{s(!1)},[]),N=a.useCallback(l=>{h.current&&!h.current.contains(l.target)&&f()},[f]),x=a.useCallback(l=>{l.key==="Escape"&&o&&f()},[o,f]),S=a.useCallback(l=>{l.stopPropagation()},[]);a.useCallback(()=>{console.log("Ask AI clicked")},[]),a.useCallback(()=>{console.log("Get tasks updates clicked")},[]),a.useCallback(()=>{console.log("Create workspace clicked")},[]),a.useCallback(()=>{console.log("Connect apps clicked")},[]),a.useEffect(()=>(o&&(document.addEventListener("mousedown",N),document.body.style.overflow="hidden"),()=>{document.removeEventListener("mousedown",N),document.body.style.overflow="unset"}),[o,N]),a.useEffect(()=>(o&&document.addEventListener("keydown",x),()=>{document.removeEventListener("keydown",x)}),[o,x]);const C=g?.name?.split(" ")[0]||"User";return e.jsxs(e.Fragment,{children:[m&&e.jsx(Ye,{onComplete:i}),e.jsx("div",{className:"min-h-screen bg-page-background-color",children:e.jsxs("div",{className:"max-w-[1400px] mx-auto px-3 sm:px-4 py-4",children:[e.jsxs("div",{className:"mb-4",children:[e.jsxs("h1",{className:"text-2xl font-bold text-gray-900 tracking-tight",children:["Welcome back",C!=="User"?`, ${C}`:""]}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Here's what's happening with your store today"})]}),e.jsx("div",{className:"flex items-center gap-1 mb-8 p-1 bg-white rounded-lg border border-gray-200 w-fit",children:["dashboard","getting-started"].map(l=>e.jsxs("button",{onClick:()=>u(l),className:`${n===l?"":"hover:text-gray-900 hover:bg-gray-100"} relative rounded-md px-4 py-2 text-sm font-medium text-gray-600 outline-sky-400 transition focus-visible:outline-2`,style:{WebkitTapHighlightColor:"transparent"},children:[n===l&&e.jsx(w.span,{layoutId:"bubble",className:"absolute inset-0 z-10 bg-blue-600",style:{borderRadius:6},transition:{type:"spring",bounce:.2,duration:.6}}),e.jsx("span",{className:`relative z-10 ${n===l?"text-white":"text-gray-600"}`,children:l==="dashboard"?"Dashboard":"Getting Started"})]},l))}),n==="dashboard"?e.jsxs("div",{className:"flex flex-col gap-4 animate-tab-fade",children:[e.jsx(be,{}),e.jsx(Ae,{})]},"dashboard"):e.jsx("div",{className:"animate-tab-fade",children:e.jsx(Ge,{onStepClick:y,onImprovementClick:p})},"getting-started")]})}),o&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-[1400]",onClick:f,"aria-hidden":"true"}),e.jsx("div",{className:"fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none",children:e.jsxs("div",{ref:h,className:"bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl pointer-events-auto",onClick:S,children:[e.jsx("button",{onClick:f,className:"absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white/90 rounded-lg transition-colors z-10","aria-label":"Close",children:e.jsx(G,{className:"w-5 h-5 text-gray-500"})}),e.jsx("div",{className:"relative h-[80vh] min-h-[600px]",children:e.jsx(De,{url:k,styles:{height:"100%",width:"100%"},pageSettings:{backgroundColor:"ffffff",hideEventTypeDetails:!1,hideLandingPageDetails:!1,primaryColor:"4caf50",textColor:"4d5055"},prefill:{name:g?.name||"",email:g?.email||""},utm:{utmCampaign:"developer-meeting",utmSource:"ziplofy",utmMedium:"website"}})})]})})]})]})}export{nt as default};
