import{Z as _,_ as f,a0 as v,a1 as r,a2 as o,c as t,a4 as a,a6 as n,ac as s,a9 as i,a8 as l,aq as V,a7 as h}from"./index-8611a10a.js";import{V as w,a as L}from"./VNavigationDrawer-d3dd984a.js";const C={__name:"AdminLayout",setup(g){const u=_(),{avatar:c,account:d}=f(u),p=[{to:"/admin/products",title:"商品管理",icon:"mdi-shopping"},{to:"/admin/orders",title:"訂單管理",icon:"mdi-format-list-numbered"},{to:"/",title:"回首頁",icon:"mdi-home"}];return(k,x)=>{const m=v("router-view");return r(),o(n,null,[t(w,{permanent:""},{default:a(()=>[t(s,null,{default:a(()=>[t(i,{"prepend-avatar":l(c),title:l(d)},null,8,["prepend-avatar","title"])]),_:1}),t(V),t(s,null,{default:a(()=>[(r(),o(n,null,h(p,e=>t(i,{key:e.to,to:e.to,title:e.title,"prepend-avatar":e.icon},null,8,["to","title","prepend-avatar"])),64))]),_:1})]),_:1}),t(L,null,{default:a(()=>[t(m)]),_:1})],64)}}};export{C as default};
