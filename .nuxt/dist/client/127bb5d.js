(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{425:function(e,t,n){var content=n(427);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(24).default)("1377ef10",content,!0,{sourceMap:!1})},427:function(e,t,n){var r=n(23)((function(i){return i[1]}));r.push([e.i,".v-autocomplete.v-input>.v-input__control>.v-input__slot{cursor:text}.v-autocomplete input{align-self:center}.v-autocomplete.v-select.v-input--is-focused input{min-width:64px}.v-autocomplete:not(.v-input--is-focused).v-select--chips input{max-height:0;padding:0}.v-autocomplete--is-selecting-index input{opacity:0}.v-autocomplete.v-text-field--enclosed:not(.v-text-field--solo):not(.v-text-field--single-line):not(.v-text-field--outlined) .v-select__slot>input{margin-top:24px}.v-autocomplete.v-text-field--enclosed:not(.v-text-field--solo):not(.v-text-field--single-line):not(.v-text-field--outlined).v-input--dense .v-select__slot>input{margin-top:20px}.v-autocomplete__content.v-menu__content,.v-autocomplete__content.v-menu__content .v-card{border-radius:0}",""]),r.locals={},e.exports=r},438:function(e,t,n){"use strict";n(12),n(13),n(14),n(18),n(11),n(19);var r=n(15),o=n(3),c=(n(6),n(50),n(175),n(209),n(55),n(38),n(61),n(78),n(208),n(176),n(425),n(426)),l=(n(68),n(69),n(430)),h=n(87),d=n(1);function m(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function f(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?m(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):m(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=f(f({},c.b),{},{offsetY:!0,offsetOverflow:!0,transition:!1}),x=c.a.extend({name:"v-autocomplete",props:{autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(e,t,n){return n.toLocaleLowerCase().indexOf(t.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:c.a.options.props.menuProps.type,default:function(){return v}},noFilter:Boolean,searchInput:{type:String}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return f(f({},c.a.options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var e=this;return this.selectedItems.map((function(t){return e.getValue(t)}))},hasDisplayedItems:function(){var e=this;return this.hideSelected?this.filteredItems.some((function(t){return!e.hasItem(t)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var e=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(t){var n=Object(d.r)(t,e.itemText),text=null!=n?String(n):"";return e.filter(t,String(e.internalSearch),text)}))},internalSearch:{get:function(){return this.lazySearch},set:function(e){this.lazySearch!==e&&(this.lazySearch=e,this.$emit("update:search-input",e))}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var e=c.a.options.computed.$_menuProps.call(this);return e.contentClass="v-autocomplete__content ".concat(e.contentClass||"").trim(),f(f({},v),e)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var e=this;return this.multiple?null:this.selectedItems.find((function(i){return e.valueComparator(e.getValue(i),e.getValue(e.internalValue))}))},listData:function(){var data=c.a.options.computed.listData.call(this);return data.props=f(f({},data.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),data}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(e){e?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.blur(),this.updateSelf())},isMenuActive:function(e){!e&&this.hasSlot&&(this.lazySearch=null)},items:function(e,t){t&&t.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!e.length||this.activateMenu()},searchInput:function(e){this.lazySearch=e},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(e,t){var n=this;if(e!==t){if(!this.autoSelectFirst){var r=t[this.$refs.menu.listIndex];r?this.setMenuIndex(e.findIndex((function(i){return i===r}))):this.setMenuIndex(-1),this.$emit("update:list-index",this.$refs.menu.listIndex)}this.$nextTick((function(){n.internalSearch&&(1===e.length||n.autoSelectFirst)&&(n.$refs.menu.getTiles(),n.autoSelectFirst&&e.length&&(n.setMenuIndex(0),n.$emit("update:list-index",n.$refs.menu.listIndex)))}))}},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(e){this.searchIsDirty||(this.multiple&&e===d.x.left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&e===d.x.right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:e!==d.x.backspace&&e!==d.x.delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var e=this.selectedIndex,t=this.selectedItems[e];if(this.isInteractive&&!this.getDisabled(t)){var n=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===n){var r=e!==this.selectedItems.length-1?e:e-1;this.selectedItems[r]?this.selectItem(t):this.setValue(this.multiple?[]:null),this.selectedIndex=r}else this.selectedIndex=n}},clearableCallback:function(){this.internalSearch=null,c.a.options.methods.clearableCallback.call(this)},genInput:function(){var input=l.a.options.methods.genInput.call(this);return input.data=Object(h.a)(input.data,{attrs:{"aria-activedescendant":Object(d.p)(this.$refs.menu,"activeTile.id"),autocomplete:Object(d.p)(input.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),input},genInputSlot:function(){var slot=c.a.options.methods.genInputSlot.call(this);return slot.data.attrs.role="combobox",slot},genSelections:function(){return this.hasSlot||this.multiple?c.a.options.methods.genSelections.call(this):[]},onClick:function(e){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(e.target)||this.activateMenu())},onInput:function(e){if(!(this.selectedIndex>-1)&&e.target){var t=e.target,n=t.value;t.value&&this.activateMenu(),this.multiple||""!==n||this.deleteCurrentItem(),this.internalSearch=n,this.badInput=t.validity&&t.validity.badInput}},onKeyDown:function(e){var t=e.keyCode;!e.ctrlKey&&[d.x.home,d.x.end].includes(t)||c.a.options.methods.onKeyDown.call(this,e),this.changeSelectedIndex(t)},onSpaceDown:function(e){},onTabDown:function(e){c.a.options.methods.onTabDown.call(this,e),this.updateSelf()},onUpDown:function(e){e.preventDefault(),this.activateMenu()},selectItem:function(e){c.a.options.methods.selectItem.call(this,e),this.setSearch()},setSelectedItems:function(){c.a.options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var e=this;this.$nextTick((function(){e.multiple&&e.internalSearch&&e.isMenuActive||(e.internalSearch=!e.selectedItems.length||e.multiple||e.hasSlot?null:e.getText(e.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.multiple||this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(e){return this.selectedValues.indexOf(this.getValue(e))>-1},onCopy:function(e){var t,n;if(-1!==this.selectedIndex){var r=this.selectedItems[this.selectedIndex],o=this.getText(r);null===(t=e.clipboardData)||void 0===t||t.setData("text/plain",o),null===(n=e.clipboardData)||void 0===n||n.setData("text/vnd.vuetify.autocomplete.item+plain",o),e.preventDefault()}}}});function I(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function S(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?I(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):I(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}t.a=x.extend({name:"v-combobox",props:{delimiters:{type:Array,default:function(){return[]}},returnObject:{type:Boolean,default:!0}},data:function(){return{editingIndex:-1}},computed:{computedCounterValue:function(){return this.multiple?this.selectedItems.length:(this.internalSearch||"").toString().length},hasSlot:function(){return c.a.options.computed.hasSlot.call(this)||this.multiple},isAnyValueAllowed:function(){return!0},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!!this.$slots["no-data"]&&!this.hideNoData)},searchIsDirty:function(){return null!=this.internalSearch}},methods:{onInternalSearchChanged:function(e){if(e&&this.multiple&&this.delimiters.length){var t=this.delimiters.find((function(t){return e.endsWith(t)}));null!=t&&(this.internalSearch=e.slice(0,e.length-t.length),this.updateTags())}this.updateMenuDimensions()},genInput:function(){var input=x.options.methods.genInput.call(this);return delete input.data.attrs.name,input.data.on.paste=this.onPaste,input},genChipSelection:function(e,t){var n=this,r=c.a.options.methods.genChipSelection.call(this,e,t);return this.multiple&&(r.componentOptions.listeners=S(S({},r.componentOptions.listeners),{},{dblclick:function(){n.editingIndex=t,n.internalSearch=n.getText(e),n.selectedIndex=-1}})),r},onChipInput:function(e){c.a.options.methods.onChipInput.call(this,e),this.editingIndex=-1},onEnterDown:function(e){e.preventDefault(),this.getMenuIndex()>-1||this.$nextTick(this.updateSelf)},onKeyDown:function(e){var t=e.keyCode;!e.ctrlKey&&[d.x.home,d.x.end].includes(t)||c.a.options.methods.onKeyDown.call(this,e),this.multiple&&t===d.x.left&&0===this.$refs.input.selectionStart?this.updateSelf():t===d.x.enter&&this.onEnterDown(e),this.changeSelectedIndex(t)},onTabDown:function(e){if(this.multiple&&this.internalSearch&&-1===this.getMenuIndex())return e.preventDefault(),e.stopPropagation(),this.updateTags();x.options.methods.onTabDown.call(this,e)},selectItem:function(e){this.editingIndex>-1?this.updateEditing():(x.options.methods.selectItem.call(this,e),this.internalSearch&&this.multiple&&this.getText(e).toLocaleLowerCase().includes(this.internalSearch.toLocaleLowerCase())&&(this.internalSearch=null))},setSelectedItems:function(){null==this.internalValue||""===this.internalValue?this.selectedItems=[]:this.selectedItems=this.multiple?this.internalValue:[this.internalValue]},setValue:function(e){c.a.options.methods.setValue.call(this,void 0===e?this.internalSearch:e)},updateEditing:function(){var e=this,t=this.internalValue.slice(),n=this.selectedItems.findIndex((function(t){return e.getText(t)===e.internalSearch}));if(n>-1){var o="object"===Object(r.a)(t[n])?Object.assign({},t[n]):t[n];t.splice(n,1),t.push(o)}else t[this.editingIndex]=this.internalSearch;this.setValue(t),this.editingIndex=-1,this.internalSearch=null},updateCombobox:function(){this.searchIsDirty&&(this.internalSearch!==this.getText(this.internalValue)&&this.setValue(),(Boolean(this.$scopedSlots.selection)||this.hasChips)&&(this.internalSearch=null))},updateSelf:function(){this.multiple?this.updateTags():this.updateCombobox()},updateTags:function(){var e=this,t=this.getMenuIndex();if(!(t<0&&!this.searchIsDirty||!this.internalSearch)){if(this.editingIndex>-1)return this.updateEditing();var n=this.selectedItems.findIndex((function(t){return e.internalSearch===e.getText(t)})),o=n>-1&&"object"===Object(r.a)(this.selectedItems[n])?Object.assign({},this.selectedItems[n]):this.internalSearch;if(n>-1){var c=this.internalValue.slice();c.splice(n,1),this.setValue(c)}if(t>-1)return this.internalSearch=null;this.selectItem(o),this.internalSearch=null}},onPaste:function(e){var t;if(this.$emit("paste",e),this.multiple&&!this.searchIsDirty){var n=null===(t=e.clipboardData)||void 0===t?void 0:t.getData("text/vnd.vuetify.autocomplete.item+plain");n&&-1===this.findExistingIndex(n)&&(e.preventDefault(),c.a.options.methods.selectItem.call(this,n))}},clearableCallback:function(){this.editingIndex=-1,x.options.methods.clearableCallback.call(this)}}})},588:function(e,t,n){"use strict";n.r(t);var r=n(220),o=n(481),c=n(424),l=n(571),h=n(438),d=n(423),m=n(580),f=n(575),v=n(202),x=n(572),I=n(419),S=n(430),y=n(574),_=(n(34),n(210),n(38),n(32)),O=(n(95),n(6),n(11),n(175),n(97)),D=n(177),C={mounted:function(){this.Courses(),this.Section(),this.getRevisors()},data:function(){return{saveMode:!0,dialog:!1,dialogDelete:!1,dialogClose:!1,search:"",course:"",headers:[{text:"Nombre",align:"start",sortable:!1,value:"name"},{text:"Id",value:"id"},{text:"Curso",value:"courseName"},{text:"Nivel",value:"level"},{text:"Modulo",value:"module"},{text:"Estado",value:"status"},{text:"Revisor",value:"revisorName"},{text:"Acciones",value:"actions",sortable:!1}],id:"",name:"",courseName:"",courseId:"",courses:[],coursesName:[],revisorName:"",status:"En curso",sections:[],revisorsName:[],revisors:[],section:"",level:"",module:"",modal:!1}},methods:{getRevisors:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(D.e)(Object(D.a)(O.c,"revisors"));case 2:t.sent.forEach((function(t){e.revisors.push(t.data()),e.revisorsName.push(t.data().name)}));case 4:case"end":return t.stop()}}),t)})))()},Courses:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.courses=[],e.coursesName=[],t.next=4,Object(D.e)(Object(D.a)(O.c,"courses"));case 4:t.sent.forEach((function(t){e.courses.push(t.data()),e.coursesName.push(t.data().name+"-"+t.data().level+"-"+t.data().module)}));case 6:case"end":return t.stop()}}),t)})))()},Section:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.sections=[],t.next=3,Object(D.e)(Object(D.a)(O.c,"sections"));case 3:t.sent.forEach((function(t){e.sections.push(t.data())}));case 5:case"end":return t.stop()}}),t)})))()},closeSection:function(e){this.section=e,this.dialogClose=!0},deleteItem:function(e){this.section=e,this.dialogDelete=!0},deleteItemConfirm:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(D.b)(Object(D.c)(O.c,"sections",e.section.id));case 2:e.closeDelete();case 3:case"end":return t.stop()}}),t)})))()},close:function(){this.dialog=!1},closeDelete:function(){this.dialogDelete=!1,this.Section()},closeSectionClose:function(){this.dialogClose=!1,this.Section()},editItem:function(e){this.dialog=!0,this.saveMode=!1,this.name=e.name,this.courseName=e.courseName+"-"+e.level+"-"+e.module,this.id=e.id},add:function(){this.dialog=!0},save:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){var n,r,o,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.courseName.split("-")[0],r=e.courseName.split("-")[1],o=e.courseName.split("-")[2],e.courseId=e.courses.find((function(e){return e.name==n})).id,!e.saveMode){t.next=9;break}return t.next=7,Object(D.g)(Object(D.c)(O.c,"sections",e.id),{id:e.id,name:e.name,courseName:n,courseId:e.courseId,status:e.status,revisorName:e.revisorName,level:r,module:o});case 7:t.next=12;break;case 9:return c=Object(D.c)(O.c,"sections",e.id),t.next=12,Object(D.h)(c,{id:e.id,name:e.name,courseName:n,courseId:e.courseId,status:e.status,revisorName:e.revisorName,level:r,module:o});case 12:e.Section(),e.dialog=!1;case 14:case"end":return t.stop()}}),t)})))()},closeItemConfirm:function(){var e=this;return Object(_.a)(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(D.c)(O.c,"sections",e.section.id),t.next=3,Object(D.h)(n,{status:"Cerrada"});case 3:e.closeDelete();case 4:case"end":return t.stop()}}),t)})))()}}},j=C,w=n(96),component=Object(w.a)(j,(function(){var e=this,t=e._self._c;return t(l.a,{staticClass:"text-center"},[t("img",{staticClass:"mb-5",attrs:{width:"250",height:"300",src:"/emmaus.png",alt:"Vuetify.js"}}),e._v(" "),t(d.a,[t(x.a,{staticStyle:{"justify-content":"center"}},[t(l.a,{attrs:{cols:"12",sm:"12"}},[[t(o.a,[t(c.c,[e._v("\n                            Secciones\n                            "),t(I.a),e._v(" "),t(S.a,{attrs:{"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),e._v(" "),t(l.a,{attrs:{cols:"auto ml-5"}},[t(r.a,{attrs:{"prepend-icon":"mdi-plus",size:"x-large"},on:{click:function(t){return e.add()}}},[t(v.a,{attrs:{left:""}},[e._v("\n                                        mdi-plus\n                                    ")]),e._v("Agregar\n                                    Seccion")],1)],1)],1),e._v(" "),t(m.a,{attrs:{headers:e.headers,items:e.sections,search:e.search},scopedSlots:e._u([{key:"item.actions",fn:function(n){var r=n.item;return[t(y.a,{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(n){var o=n.on,c=n.attrs;return[t(v.a,e._g(e._b({attrs:{dark:""},on:{click:function(t){return e.editItem(r)}}},"v-icon",c,!1),o),[e._v("\n                                            mdi-pencil\n                                        ")])]}}],null,!0)},[e._v(" "),t("span",[e._v("Editar seccion")])]),e._v(" "),t(y.a,{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(n){var o=n.on,c=n.attrs;return[t(v.a,e._g(e._b({attrs:{dark:""},on:{click:function(t){return e.deleteItem(r)}}},"v-icon",c,!1),o),[e._v("\n                                            mdi-delete\n                                        ")])]}}],null,!0)},[e._v(" "),t("span",[e._v("Delete seccion")])]),e._v(" "),t(y.a,{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(n){var o=n.on,c=n.attrs;return[t(v.a,e._g(e._b({attrs:{dark:""},on:{click:function(t){return e.closeSection(r)}}},"v-icon",c,!1),o),[e._v("\n                                            mdi-close\n                                        ")])]}}],null,!0)},[e._v(" "),t("span",[e._v("Cerrar seccion")])])]}}])})],1),e._v(" "),t(f.a,{attrs:{"max-width":"600px"},model:{value:e.dialogDelete,callback:function(t){e.dialogDelete=t},expression:"dialogDelete"}},[t(o.a,[t(c.c,{staticClass:"text-h5"},[e._v("¿Estas seguro de eliminar este seccion?")]),e._v(" "),t(c.a,[t(I.a),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.closeDelete}},[e._v("Cancel")]),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.deleteItemConfirm}},[e._v("OK")]),e._v(" "),t(I.a)],1)],1)],1),e._v(" "),t(f.a,{attrs:{"max-width":"600px"},model:{value:e.dialogClose,callback:function(t){e.dialogClose=t},expression:"dialogClose"}},[t(o.a,[t(c.c,{staticClass:"text-h5"},[e._v("¿Estas seguro de cerrar esta seccion?")]),e._v(" "),t(c.a,[t(I.a),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.closeSectionClose}},[e._v("Cancel")]),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.closeItemConfirm}},[e._v("OK")]),e._v(" "),t(I.a)],1)],1)],1),e._v(" "),t(f.a,{attrs:{"max-width":"1300px"},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[t(o.a,[t(c.c,[t("span",{staticClass:"text-h5"},[e._v("Seccion")])]),e._v(" "),t(c.b,[t(d.a,[t(x.a,[t(l.a,{attrs:{cols:"12",md:"4"}},[t(S.a,{attrs:{label:"Codigo de la seccion",required:""},model:{value:e.id,callback:function(t){e.id=t},expression:"id"}})],1),e._v(" "),t(l.a,{attrs:{cols:"12",md:"4"}},[t(S.a,{attrs:{label:"Nombre de la seccion",required:""},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}})],1),e._v(" "),t(l.a,{attrs:{cols:"6",md:"4"}},[t(h.a,{attrs:{items:e.coursesName,label:"Seleccione el nombre del curso / nivel / modulo"},model:{value:e.courseName,callback:function(t){e.courseName=t},expression:"courseName"}})],1),e._v(" "),t(l.a,{attrs:{cols:"6",md:"4"}},[t(h.a,{attrs:{items:e.revisorsName,label:"Asignar revisor"},model:{value:e.revisorName,callback:function(t){e.revisorName=t},expression:"revisorName"}})],1)],1)],1)],1),e._v(" "),t(c.a,[t(I.a),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.close}},[e._v("\n                                    Cancel\n                                ")]),e._v(" "),t(r.a,{attrs:{color:"blue darken-1",text:""},on:{click:e.save}},[e._v("\n                                    Save\n                                ")])],1)],1)],1)]],2)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports}}]);