(this["webpackJsonpmodaz-shop"]=this["webpackJsonpmodaz-shop"]||[]).push([[29],{104:function(e,t,s){},1116:function(e,t,s){"use strict";s.r(t);var a=s(55),c=s(56),n=s(7),i=s(1),l=s(19),o=s(96),r=s(97),j=s(27),u=s(54),d=s(10),b=s.n(d),A=s(63),m=s(397),v=s(409),O=s(411),h=s(412),x=s(410),p=s(110),E=s(202),f=s(203),g=s(119),T=s(266),N=s(145),V=s(120),y=s(3),C=function(e){var t=e.stats,s=e.loader,a=e.includeRole,c="Statistiques globales",n=[{count:(null===t||void 0===t?void 0:t.usersCount)||0,title:"Utilisateur(s)",link:"/users",color:"light-primary",icon:Object(y.jsx)(m.a,{size:24})},{count:(null===t||void 0===t?void 0:t.customersCount)||0,title:"Client(s)",link:"/customers",color:"light-info",icon:Object(y.jsx)(v.a,{size:24})},{count:(null===t||void 0===t?void 0:t.productsCount)||0,title:"Produit(s)",link:"/products",color:"light-danger",icon:Object(y.jsx)(O.a,{size:24})},{count:(null===t||void 0===t?void 0:t.postsCount)||0,title:"Article(s)",link:"/blog",color:"light-success",icon:Object(y.jsx)(h.a,{size:24})},{count:(null===t||void 0===t?void 0:t.ordersCount)||0,title:"Commande(s)",link:"/orders",color:"light-secondary",icon:Object(y.jsx)(x.a,{size:24})}];a&&(c="Status des Articles r\xe9dig\xe9s",n=[{count:(null===t||void 0===t?void 0:t.postsCount)||0,title:"Total",color:"light-primary",icon:Object(y.jsx)(h.a,{size:24})},{count:(null===t||void 0===t?void 0:t.publishedPosts)||0,title:"Published",color:"light-success",icon:Object(y.jsx)(h.a,{size:24})},{count:(null===t||void 0===t?void 0:t.draftedPosts)||0,title:"Drafted",color:"light-secondary",icon:Object(y.jsx)(h.a,{size:24})},{count:(null===t||void 0===t?void 0:t.deletedPosts)||0,title:"Deleted",color:"light-danger",icon:Object(y.jsx)(h.a,{size:24})}]);return Object(y.jsxs)(g.a,{className:"card-statistics",children:[Object(y.jsxs)(T.a,{children:[Object(y.jsx)(N.a,{tag:"h4",children:c}),Object(y.jsx)(f.a,{className:"card-text font-small-2 mr-25 mb-0",children:"Up to date"})]}),Object(y.jsx)(V.a,{className:"py-1",children:Object(y.jsx)("div",{className:"d-flex flex-wrap justify-content-lg-around mx-auto",children:function(){var e=n.length;return n.map((function(t,a){return Object(y.jsx)("div",{className:b()({"mr-2 mb-1":e!==a}),children:Object(y.jsxs)(p.a,{children:[Object(y.jsx)(u.b,{to:t.link?t.link:"#",children:Object(y.jsx)(A.a,{color:t.color,icon:t.icon,className:"mr-1"})}),s?Object(y.jsx)(E.a,{color:"primary"}):Object(y.jsx)(u.b,{to:t.link?t.link:"#",children:Object(y.jsxs)(p.a,{className:"my-auto cursor ",role:"button",body:!0,children:[Object(y.jsx)("h4",{className:"font-weight-bolder text-dark text-center mb-0",children:t.count}),Object(y.jsx)(f.a,{className:"font-small-3 mb-0 text-dark",children:t.title})]})})]})},a)}))}()})})]})},P=s(267),k=s(648),Y=s.n(k),H=function(e){var t=e.orderStatusCount,s=e.statusOptions,a=[],c=[],n=[],i=[],l={proceed:"text-info",shipped:"text-warning",completed:"text-success",cancelled:"text-danger"};t.forEach((function(e,t){var o=s.find((function(t){return t.value==e.id}));o&&(a[t]=o.labelFr,c[t]=e.count,n[t]=o.hex_color,i.push({label:o.labelFr,color:l[o.label.toLowerCase()],count:e.count}))}));var o={chart:{toolbar:{show:!0,offsetX:0,offsetY:-50}},labels:a,dataLabels:{enabled:!0},legend:{show:!1},stroke:{width:3},colors:n};return t.length?Object(y.jsxs)(g.a,{children:[Object(y.jsx)(T.a,{className:"align-items-end",children:Object(y.jsx)(N.a,{tag:"h4",children:"Status des commandes"})}),Object(y.jsxs)(V.a,{children:[Object(y.jsx)(Y.a,{options:o,series:c,type:"pie",height:325}),Object(y.jsx)("div",{className:"d-flex flex-wrap justify-content-center pt-25",children:i.map((function(e,t){return Object(y.jsxs)("div",{className:"d-flex mx-25 my-25 border rounded p-50",children:[Object(y.jsxs)("div",{className:"d-flex align-items-center",children:[Object(y.jsx)(P.a,{size:15,className:e.color}),Object(y.jsx)("span",{className:"font-weight-bold text-capitalize ml-75 mr-50",children:e.label})]}),": ",Object(y.jsxs)("span",{className:"ml-50",children:[" ",e.count]})]},t)}))})]})]}):null},I=s(11),U=function(e){var t=e.data,s=e.tag,a=e.className,c=s||"ul";return Object(y.jsx)(c,{className:b()("timeline",Object(I.a)({},a,a)),children:t.map((function(e,s){var c,n=e.tag?e.tag:"li";return Object(y.jsxs)(n,{className:b()("timeline-item",Object(I.a)({},e.className,a)),children:[Object(y.jsx)("span",{className:b()("timeline-point",(c={},Object(I.a)(c,"timeline-point-".concat(e.color),e.color),Object(I.a)(c,"timeline-point-indicator",!e.icon),c)),children:e.icon?e.icon:null}),Object(y.jsxs)("div",{className:"timeline-event",children:[Object(y.jsxs)("div",{className:b()("d-flex justify-content-between flex-sm-row flex-column",{"mb-sm-0 mb-1":e.meta}),children:[Object(y.jsx)("h6",{children:e.title}),e.meta?Object(y.jsx)("span",{className:b()("timeline-event-time",Object(I.a)({},e.metaClassName,e.metaClassName)),children:e.meta}):null]}),Object(y.jsx)("p",{className:b()({"mb-0":s===t.length-1&&!e.customContent}),children:e.content}),e.customContent?e.customContent:null]})]},s)}))})},w=(s(0),s(1123),s(268)),R=s(146),F=(s.p,[{title:"12 factures ont \xe9t\xe9 pay\xe9es",content:"Les factures ont \xe9t\xe9 pay\xe9es \xe0 l'entreprise.",meta:"Il y a 12 minutes",metaClassName:"mr-1",customContent:Object(y.jsxs)(p.a,{children:[Object(y.jsx)("img",{className:"mr-1",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAkCAMAAAAw96PuAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIaADAAQAAAABAAAAJAAAAADeoA9wAAABcVBMVEUAAAD/qlX/qlX/n2D/qlX/n1D/pUv/qkf/oUP/pk3/qkn/okb/o0f/okT/n0j/oEn/n0b/pEn/oEf/okb/oUj/o0f/n0X/oUT/o0f/oEb/pEP/okb/n0T/okT/oEb/n0T/oEX/o0b/n0P/oUP/okb/oUT/n0b/oUX/oET/oUb/n0X/oET/oUP/oEX/okT/oEP/oUX/oUP/oET/oUX/oEX/n0T/oEX/oET/oEX/n0T/oET/n0P/oEX/n0P/oUT/n0T/oEX/oUT/oET/oEP/oET/oUT/oEP/oEP/oET/oEP/oEP/oET/n0T/oET/oEP/n0T/oET/n0T/n0T/oET/n0T/n0P/oET/n0P/oET/n0T/oEP/oET/oET/n0T/n0T/oEP/oEP/n0P/oET/n0P/n0T/n0T/n0P/oEP/n0T/oEP/n0P/oET/n0T/oEP/oET/n0T/oET/oEP/n0T/oEP/oET/n0P/oEP/oET/n0T/oEP/n0NWaDR5AAAAenRSTlMAAwYICRAREhMUFRYZHiAjKCorLC4vMDEyMzU3ODw+QENFSExNT1BRU1RVVldZWltcX2Zna21zdHZ4e31+hYeIkZKTlJmam5yen6OkpaanqKmtsLG4ury9v8DBw8fIytHU1dfY2t3g5OXn6Onq6+zt7u/w8/n6+/z9/jLTlDYAAAE3SURBVDjL7dRHUwIxFMDxZ0OsIAoqtijqYhcVCxZQZO0iWLAXYC0IsqIivE/vRh2GLLs5evJ/yLyZ/CaHzCQAAAbxAZmezMBUfoPqEk2McGFpz5Zi4VPtyjllSTYXiYBKRCYpSbVwBIx/UmLlCBij5MXGETCaVYZ0G0fAMCVyO0eA80MZX+0cAQIlmVaOgAFK5rREbOq3sJ5g+hcaQvweTyOYCPjjiMf+c2XZyeP+PSsER6rW2ruNQzWDlW4ksIlVB2pxBnuIR3CCqxAjlvo3Y4nITgCRlsve8RZCxGP2NgRZ0S8gXpuc6xDFEFyRhWBdI3NGdM2wKC1tmEbSxr5dmz1H5vMdwIhw13TmTuh2JzHu6pmV0bOFl46Lv71TH0/M6P0OhTp1fphChz8Po1p81N6XVioAvgBZgp3AxW+3KgAAAABJRU5ErkJggg==",alt:"data.json",height:"23"}),Object(y.jsx)(p.a,{className:"mb-0",body:!0,children:"data.json"})]})},{title:"R\xe9union des clients",content:"R\xe9union de projet avec Juan \xe0 10h15.",meta:"Il y a 45 minutes",metaClassName:"mr-1",color:"warning",customContent:Object(y.jsx)(p.a,{className:"align-items-center",children:Object(y.jsxs)(p.a,{className:"ml-50",body:!0,children:[Object(y.jsx)("h6",{className:"mb-0",children:"John Doe (Client)"}),Object(y.jsx)("span",{children:"PDG d'Infibeam"})]})})},{title:"Cr\xe9er un nouveau projet pour un client",content:"Ajouter des fichiers \xe0 un nouveau dossier de dessin ou mod\xe8le",color:"info",meta:"Il y a 2 jours",metaClassName:"mr-1"},{title:"Cr\xe9er un nouveau projet pour un client",content:"Ajouter des fichiers \xe0 un nouveau dossier de dessin ou mod\xe8le",color:"danger",meta:"Il y a 5 jours",metaClassName:"mr-1"}]),B=function(){return Object(y.jsxs)(g.a,{className:"card-user-timeline",children:[Object(y.jsxs)(T.a,{children:[Object(y.jsxs)("div",{className:"d-flex align-items-center",children:[Object(y.jsx)(w.a,{className:"user-timeline-title-icon"}),Object(y.jsx)(N.a,{tag:"h4",children:"Chronologie de l'utilisateur"})]}),Object(y.jsx)(R.a,{size:18,className:"cursor-pointer"})]}),Object(y.jsx)(V.a,{children:Object(y.jsx)(U,{className:"ml-50 mb-0",data:F})})]})},K=s(269),S=s(98),q=s.n(S),z=s(1107),L=s(1108),J=s(1109),X=s(892),D=s(893),M=s(1093),W=s(891),Z=[{name:"7/12",ventes:20,clics:60,visites:100},{name:"8/12",ventes:40,clics:80,visites:120},{name:"9/12",ventes:30,clics:70,visites:90},{name:"10/12",ventes:70,clics:110,visites:170},{name:"11/12",ventes:40,clics:80,visites:130},{name:"12/12",ventes:60,clics:80,visites:160},{name:"13/12",ventes:50,clics:100,visites:140},{name:"14/12",ventes:140,clics:90,visites:240},{name:"15/12",ventes:120,clics:180,visites:220},{name:"16/12",ventes:100,clics:160,visites:180},{name:"17/12",ventes:140,clics:140,visites:270},{name:"18/12",ventes:180,clics:200,visites:280},{name:"19/12",ventes:220,clics:220,visites:375}],G=function(e){return e.active&&e.payload?Object(y.jsxs)("div",{className:"recharts-custom-tooltip",children:[Object(y.jsx)("p",{className:"font-weight-bold mb-0",children:e.label}),Object(y.jsx)("hr",{}),Object(y.jsx)("div",{className:"active",children:e.payload.map((function(e){return Object(y.jsxs)("div",{className:"d-flex align-items-center",children:[Object(y.jsx)("span",{className:"bullet bullet-sm bullet-bordered mr-50",style:{backgroundColor:e.fill}}),Object(y.jsxs)("span",{className:"align-middle text-capitalize mr-75",children:[e.dataKey," : ",e.payload[e.dataKey]]})]},e.dataKey)}))})]}):null},Q=function(e){e.primary;return Object(y.jsxs)(g.a,{children:[Object(y.jsxs)(T.a,{className:"flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-sm-center align-items-start",children:[Object(y.jsx)(N.a,{tag:"h4",children:"Donn\xe9es du site web"}),Object(y.jsxs)("div",{className:"d-flex align-items-center",children:[Object(y.jsx)(K.a,{size:15}),Object(y.jsx)(q.a,{options:{mode:"range",defaultDate:["2019-05-01","2019-05-10"]},className:"form-control flat-picker bg-transparent border-0 shadow-none"})]})]}),Object(y.jsxs)(V.a,{children:[Object(y.jsxs)("div",{className:"d-flex align-items-center mb-2",children:[Object(y.jsxs)("div",{className:"mr-2",children:[Object(y.jsx)("span",{className:"bullet bullet-sm bullet-primary bullet-bordered mr-50"}),Object(y.jsx)("span",{className:"align-middle",children:"Clics"})]}),Object(y.jsxs)("div",{className:"mr-2",children:[Object(y.jsx)("span",{className:"bullet bullet-sm bullet-bordered mr-50",style:{backgroundColor:"rgba(115, 103, 240, .5)"}}),Object(y.jsx)("span",{className:"align-middle mr-75",children:"Ventes"})]}),Object(y.jsxs)("div",{children:[Object(y.jsx)("span",{className:"bullet bullet-sm bullet-bordered mr-50",style:{backgroundColor:"rgba(115, 103, 240, .2)"}}),Object(y.jsx)("span",{className:"align-middle",children:"Visites"})]})]}),Object(y.jsx)("div",{className:"recharts-wrapper",children:Object(y.jsx)(z.a,{children:Object(y.jsxs)(L.a,{height:400,data:Z,children:[Object(y.jsx)(J.a,{}),Object(y.jsx)(X.a,{dataKey:"name"}),Object(y.jsx)(D.a,{}),Object(y.jsx)(M.a,{content:G}),Object(y.jsx)(W.a,{dataKey:"ventes",stackId:"ventes",stroke:"0",fill:"rgba(115, 103, 240, .5)"}),Object(y.jsx)(W.a,{dataKey:"clics",stackId:"clics",stroke:"0",fill:"rgb(115, 103, 240)"}),Object(y.jsx)(W.a,{dataKey:"visites",stackId:"visites",stroke:"0",fill:"rgba(115, 103, 240, .2)"})]})})})]})]})},_=s(319),$=function(){return Object(y.jsx)(g.a,{className:"card-congratulations",children:Object(y.jsxs)(V.a,{className:"text-center",children:[Object(y.jsx)("img",{className:"congratulations-img-left",src:"data:image/png;base64,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",alt:"decor-left"}),Object(y.jsx)("img",{className:"congratulations-img-right",src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAABTCAMAAAAY2TOcAAABAlBMVEUAAADtj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj50b0aftj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj53tj50b0acb0acb0aftj53tj53tj53tj53/vAEb0af/vAEb0aftj50b0acb0acb0af/vAEb0af/vAEb0af/vAEb0acb0af/vAH/vAH/vAH/vAH/vAH/vAEb0af/vAEb0af4qz7/vAHtj50b0af/vAFW6jjPAAAAU3RSTlMAAvcI/RXta/IF3tfCWUnStU8sIOF86L2ml4LNuHE3EAySU5wpKCQbsY5hRfnIq6Iy5NaxnYiFdz708uBkQQtbTph5IBT56MXw4puXSEY9IpIxHhHzkVEAAAVwSURBVHja7dtpV9pAGAXgmz00gOyL7CKyKWC12s1q7b4vL/3/f6U0CBPizICVWNLj88GPntzhvZkJJ4DsSgShR0SlKsKOJvRiDeGm0x+5GELNpqn8HkLMpitqVkNo2TTn9BFWNnkUDISTTV6mpSCMbFp0MEIIZchHb9QROhm65nAHYZMhjkQa4ZIhHvV0Q4+Ir14+e/Ps0095CsZ5jA30+cmvP558WZKCGRoIELlwM98mIVzvX2GBQ0JmT8HMZqT4+GvmJTzi2CIxPYuZzUjxYZ7iGWaUZIkkKTLZ8s78w9iMFL/m3swyxCYBhCnUQl/BAT2wNExtRAr/ZxHpOUTCFCWrhokhEZnb05JvRIrFXmhWhkiUwmyMMJWdfizFFrAZKbz3qHolR1dyKPkKnY+xGYrRlN5ZunlcHr+4gxRsv6hlTZpLILpQ6O00PEY0dyAv+sV4/HA36BRs7/5xYpPHtieFOoj7rrROzKTodYjsPh2Px0/PcTfaXZsWJOcptio1XHO4WJgTQdFfPxy72FQFKF1Uyac9TWEXR+CJ0iK1mQLH0djFpio4reE++eXcC42yQvs06ZrEGWegHs5ivEOgUgWdrksAhe09CJ0SRykWgc+L47Hr7WsEqNohrm3I7RBXpnKt6Oduv4McqMdlEtiBXIoEzEdtzlRdIDDxKAmlIafpJLI/TPmn6hIB0OKNApIlEjNXeJ6VKPcRsFalrBJZOHsguwwskyepUgyBqe00p2uo1gCtq5PICZYpkpTZHCEISvU0Or/swvQGtSUrt1yFJB7sFCd/ulUFa2XECjnyOIMrklXF5ZaLk5BZiVwdeg8bZ+sKEnl8UtJ9a6XMW3IgLLdciwT0ogHAYKMVj+C20r2BTddkMadYtqDcchFBqcopuDzDag6TGv6a1u86xKO3F4ImyO8RluPe4pw4rnTJyx7E6n93Q02oJJDAopjJLbdcmTOIFhueJPmonV4NN1FPFv0rJb9Io8Art1yDfPa7NTB1nbOrly0DK3tEUjlO3ZKHnHJLWbRo4DsBHxCPHrXakDFS8d5poxB1CrB0Ylab+lqR5vJgVrzVls7gc0IiB6dpf4PT1aS13eyUDvfnA7gHJG0SawkOuA6LuYI0MTnO97Z9kjhxFy7Vj1W6hbxjih4NqjkSiUJAe6SvXm4obNlO6rz/ppKIainAUJXu/tp0qRwS6EFoND3n7mEVDk0V0jc8L26l3ALkSCI5G/Q8cdl1iEVOVSJTwSo60yGvQiBLfA3taoIl5U2wKxoSTxNSe9Hl5Wb7WiYmTlwlnlxc9uzOqj2nbBNHFXKKlcVKLLKlL4hEbN4iG5hTOiSwDa/e/vWhxLqcNduQSvBrzdQeyKrN9G3yqeDOVDi1XjRSZdVmUoe+Q4CBOzPi1NrHklabaW+R1wB3RzF9teYoSKvN1MvkEccdGizWmqfuSKvNRJo0l1Fwh6yFWvOlbHm1mawnZ3CeH73Aopan1kKxJdVmYiq59DQC85zz9f4huboaJIpLqs08Nv3P0+sPMfH0AguGrNZiWmlJtZmWu8HEEJjLsesSXj0i6hhYIm3SqiNvHBCZGoJz8XQ88RxebVZrmeSyajNahxoI0u7DWQhmkLrZI3YSyyiNFAL14ug5/k4kOqt2qLVzbrVD/S74RF93qx122Um1Q/w6+xWlTEmEn1HEvXv37v2P+vmw/lLHw9LJ2cgYu8dHWFGkSBNOG5vm659X3M6xEiNPrjzWp5qP47bO393kvbAEuaLrG6nWYB1HuuPx1DFWYTg00YxgXRo6TWRxS6/fTl80vFhxpLZIr6z1cD2hF28/UpMMR1+xKoNN8TpoDlEnhds7+r6Lfyce3bhftf8GxgHAIi+xyUgAAAAASUVORK5CYII=",alt:"decor-right"}),Object(y.jsx)(A.a,{icon:Object(y.jsx)(_.a,{size:28}),className:"shadow",color:"primary",size:"xl"}),Object(y.jsx)("div",{className:"text-center",children:Object(y.jsx)("h1",{className:"mb-1 text-white",style:{fontSize:"1.3rem"},children:"Bienvenue sur le tableau de bord de Modaz Shop !"})})]})})},ee=s(172),te=s(173);s(894),s(104),s(895),s(896),t.default=function(){var e=Object(l.b)(),t=Object(l.c)((function(e){return e.homepage})),s=t.orderStatusCount,u=t.stats,d=t.postsStats,b=Object(l.c)((function(e){return e.orders})).statusOptions,A=Object(l.c)((function(e){return e.auth.userData})),m=Object(i.useContext)(j.a).colors,v=Object(i.useState)(!1),O=Object(n.a)(v,2),h=O[0],x=O[1],p=A.role.toLowerCase(),f=["author","editor"].includes(p);return Object(i.useEffect)(Object(c.a)(Object(a.a)().mark((function t(){return Object(a.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(x(!0),f){t.next=5;break}return t.next=4,e(function(){var e=Object(c.a)(Object(a.a)().mark((function e(t){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.get("/").then(function(){var e=Object(c.a)(Object(a.a)().mark((function e(s){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t({type:"GET_HOMEPAGE_DATA",data:s.data});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){Object(r.a)(e,null,t)}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 4:return t.abrupt("return",x(!1));case 5:return t.next=7,e(function(){var e=Object(c.a)(Object(a.a)().mark((function e(t){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.get("/posts-stats").then(function(){var e=Object(c.a)(Object(a.a)().mark((function e(s){return Object(a.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t({type:"GET_POSTS_STATS",data:s.data});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){Object(r.a)(e,null,t)}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 7:x(!1);case 8:case"end":return t.stop()}}),t)}))),[e]),Object(y.jsxs)("div",{id:"dashboard-ecommerce ",className:"container",children:[Object(y.jsxs)(ee.a,{className:"match-height",children:[Object(y.jsx)(te.a,{sm:"12",md:f?"12":"4",children:Object(y.jsx)($,{})}),!f&&Object(y.jsx)(te.a,{sm:"12",md:"8",children:Object(y.jsx)(C,{stats:u,loader:h,includeRole:f})})]}),Object(y.jsxs)(ee.a,{children:[Object(y.jsx)(te.a,{sm:"12",children:Object(y.jsxs)(ee.a,{className:"match-height",children:[Object(y.jsx)(te.a,{sm:"12",md:"6",children:Object(y.jsx)(B,{})}),Object(y.jsx)(te.a,{sm:"12",md:"6",children:h?Object(y.jsx)("div",{className:" p-5 d-flex justify-content-center ",children:Object(y.jsx)(E.a,{id:"datable-loader"})}):f?Object(y.jsx)(C,{stats:d,loader:h,includeRole:f}):Object(y.jsx)(H,{statusOptions:b,orderStatusCount:s})})]})}),!f&&Object(y.jsx)(te.a,{sm:"12",children:Object(y.jsx)(Q,{primary:m.primary.main})})]})]})}},894:function(e,t,s){},895:function(e,t,s){},896:function(e,t,s){}}]);
//# sourceMappingURL=29.b0f0d0ec.chunk.js.map