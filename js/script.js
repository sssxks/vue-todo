var colorMap = {
	success: 'green',
	secondary: 'gray',
	info: 'light_blue',
	warning: 'yellow',
	danger: 'red',
	primary: 'blue',
	dark: 'dark_gray',
	light: 'light',
	none: 'white'
}

var tags = [
	new Tag('success', 'green'),
	new Tag('secondary', 'gray'),
	new Tag('info', 'light_blue'),
	new Tag('warning', 'yellow'),
	new Tag('danger', 'red'),
	new Tag('primary', 'blue'),
	new Tag('dark', 'dark_gray'),
	new Tag('light', 'light')
];

function Tag (name,color) {
	this.name = name;
	if (color != null || color != ''){
		this.color = color;
	} else {
		this.color = null;
	}
}
function Item (content) {
	this.status = false;
	this.tags = [];
	this.content = content;
}

/*Vue.component('modals',{
	props:{
		
	}
})*/

Vue.component('modal', {
	props: {
  		remote: String,

	},
	data: function(){
		return {
			show: true,
		}
	},
	render: function (createElement) {
		if (this.show){
			return createElement(
				'div',
				{'class': 'modal'},
				[createElement(
					'div',
					{'class': 'modal-dialog'},
					[createElement(
						'div',
						{'class': 'modal-content'},
						[
							createElement(
								'div',
								{'class': 'modal-header'},
								this.item.header
							),
							createElement(
								'div',
								{'class': 'modal-body'},
								this.item.body
							),
							createElement(
								'div',
								{'class': 'modal-footer'},
								this.item.footer
							)
						]
					)]
				)]
			)
		} else {
			return null;
		}

  	},
	methods: {
		onClose: function (){
			show = false;
		}
	},
	computed: {
		item: {
			get: function () {
				if (this.item != null){
					return this.item;
				} else {
					return 'cannot load modal'
				}
			},
			set: function (options) {
				if (options) {
					//处理输入的数据
					if (options.remote) {
						$.get('modal/' + remote, function(responseTxt,statusTxt,xhr){
							if (statusTxt == "success"){
								var data = JSON.parse(responseTxt);
							} else if(statusTxt == "error"){
								console.log('cannot load modal');
							}
						}
					} else if (options.content) {
						if (typeof options.content) == 'string') {
							try {
								var data = JSON.parse(options.content);
							} catch (e) {
								throw 'content的值无效!'
							}
						} else {
							var data =  options.content;
						}
					} else {
						throw '未输入内容!'
					}

					//格式化&默认值
					var temp = {};
					temp.body = obj.content;
					if (data.header){
						temp.header = obj.header;
					} else {
						temp.header = '<div class="modal-header"><h4 class="modal-title">' + (data.title ? data.title : '提示')
							+ '</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div>'
					}

					if (data.footer){
						temp.footer = obj.footer;
					} else {
						temp.footer =  '<div class="modal-footer"><button type="button" class="btn btn-secondary">' +
						(data.close ? data.close : '关闭') + '</button></div>'
					}

					// 执行数据的替换
					if (data.method) {
						data.method('header', temp.header);
						data.method('body', temp.body);
						data.method('footer', temp.footer);
					} else if (data.data) {
						for (var key in data.data) {
							var value = data.data[key];
						}
					}
					};
				});
			}
		}
	}
 })

 // <div class="modal fade" id="myModal">
 //   <div class="modal-dialog">
 //     <div class="modal-content">
 //
 //     </div>
 //   </div>
 // </div>

 // <div class="modal-header">
	// <h4 class="modal-title"></h4>
	// <button type="button" class="close" data-dismiss="modal">&times;</button>
// </div>
// <div class="modal-body">

// </div>
// <div class="modal-footer">
	// <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
// </div>

var main = new Vue({
	el: '#main',
	data: {
		newItem: '',
		todoList: []
	},
	methods: {
		onOpenSettings: function (index){
			console.log("open settings: " + index);
			modal('item-settings.htm', 'func', function (content) {
				var item = main.todoList[index];
			})
		},
		onAddItem: function() {
			if (this.newItem){
				var item = new Item(this.newItem);
				item.id = this.todoList.length;
				var found = false;
				for (i in this.todoList){
					if (this.todoList[i].content == item.content){
						found = true;
						break;
					}
				}
				if (!found){
					this.addItem(item);
					this.newItem = '';
				}
			}
		},
		addItem: function(item){
			console.log('add item:');
			console.log(item);
			this.todoList.push(item);
		},
		removeItem: function(index) {
			console.log('remove item: ' + index);
			return this.todoList.splice(index,1)[0];
		}
	}
})

var navbar = new Vue({
	el: '#navbar',
	data: {
		show: false
	},
	// computed: {
		// classes: function () {
			// return {
				// show: this.show
			// }
		// }
	// },
	methods: {
		onToggleNavbar: function() {
			this.show = !this.show;

		},
		onExport: function() {
			modal.modal('export',{})
			var obj = {
				todoList: main.todoList
			};
			var json = JSON.stringify(obj);
			// modal()
		},
		onImport: function(json, overRiding) {
			modal.modal('import')
			var obj = JSON.parse(json);
			if (overRiding) {
					main.todoList = obj.todoList;
				} else {
					for (var item in obj.todoList){
						main.addItem(item);
					}
				}
		}
	}
})
