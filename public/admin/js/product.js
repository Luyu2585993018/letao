//获取数据渲染页面  渲染分页页数,

var $form = $("form");
$(function() {
	var currentPage = 1;
	var pageSizes = 3;

	function render() {
		$.ajax({
			type: "get",
			url: "/product/queryProductDetailList",
			async: true,
			data: {
				page: currentPage,
				pageSize: pageSizes,
			},
			success: function(data) {
				//				console.log(data);
				$('tbody').html(template('tpl', data));
				$("#paginator").bootstrapPaginator({
					bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
					currentPage: currentPage, //当前页
					totalPages: Math.ceil(data.total /
						data.size), //总页数
					size: "small", //设置控件的大小，mini, small, normal,large
					numberOfPages: 5,
					useBootstrapTooltip:true,
					
					itemTexts: function(type, page, current) {
//						console.log(type, page, current);
						switch(type) {
							case 'first':
								return '首页';
							case 'last':
								return '尾页';
							case 'next':
								return '下一页';
							case 'prev':
								return '上一页';
								default :
								return '第'+page+'页';
						}
					},
					tooltipTitles: function(type, page, current) {
						switch(type) {
							case 'first':
								return '首页';
							case 'last':
								return '尾页';
							case 'next':
								return '下一页';
							case 'prev':
								return '上一页';
								default :
								return '第'+page+'页';
						}
					},
					onPageClicked: function(a, b, c, page) {
						//为按钮绑定点击事件 page:当前点击的按钮值
						currentPage = page;
						render();
					}
				});
			}
		});
	}
	render();
	//显示模态框,并获取二级分类,渲染给下拉框
	$('.btn_add').on('click', function() {
		$('#addModal').modal('show');
		$.ajax({
			type: "get",
			url: "/category/querySecondCategoryPaging",
			async: true,
			data: {
				page: 1,
				pageSize: 100,
			},
			success: function(data) {
				//				console.log(data);
				$('.dropdown-menu').html(template('tpl2', data));

			}
		});
	})
	$('.dropdown-menu').on('click', 'a', function() {
		$('.dropdown-text').text($(this).text());
		$(".btnH").val($(this).data('id'));
		$form.data('bootstrapValidator').updateStatus('categoryId', 'VALID');
	})

	//表单校验,对所有的类型都做校验,
	$form.bootstrapValidator({
		excluded: [],
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			categoryId: {
				validators: {
					notEmpty: {
						message: "请选择二级分类"
					}
				}
			},
			proName: {
				validators: {
					notEmpty: {
						message: "请输入商品的名称"
					}
				}
			},
			proDesc: {
				validators: {
					notEmpty: {
						message: "请输入商品的描述"
					}
				}
			},
			num: {
				validators: {
					notEmpty: {
						message: "请输入商品的库存"
					},
					regexp: {
						regexp: /^[1-9]\d*$/,
						message: '请输入一个不是0开头的库存'
					}
				}
			},
			size: {
				validators: {
					notEmpty: {
						message: "请输入商品的尺码"
					},
					regexp: {
						regexp: /^\d{2}-\d{2}$/,
						message: '请输入合法的尺码,例如(32-46)'
					}
				}
			},
			oldPrice: {
				validators: {
					notEmpty: {
						message: "请输入商品的原价"
					}
				}
			},
			price: {
				validators: {
					notEmpty: {
						message: "请输入商品的价格"
					}
				}
			},
			brandLogo: {
				validators: {
					notEmpty: {
						message: "请上传3张图片"
					}
				}
			}
		}
	});
	var imgs = [];
	$("#fileupload").fileupload({
		dataType: "json",

		done: function(e, data) {
			console.log(data);
			$('.img_box').append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">'); 
			imgs.push(data.result);
			$("[name='brandLogo']").val(data.result.picAddr);
			if(imgs.length == 3) {
				$form.data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
			}else{
				$form.data('bootstrapValidator').updateStatus('brandLogo', 'INVALID');
			}
			if(imgs.length>=3){
				return;
			}
		}
	});

	//校验后提交,阻止默认提交
	$form.on('success.form.bv', function(e) {
		e.preventDefault();
		var serializes = $form.serialize();
		serializes+="&picName1="+imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
		serializes+="&picName2="+imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
		serializes+="&picName3="+imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
		$.ajax({
			type: "post",
			url: "/product/addProduct",
			async: true,
			data: serializes,
			success: function(data) {
				$('#addModal').modal('hide');
				page = 1;
				render();
				$form[0].reset();
				$form.data('bootstrapValidator').validator.resetForm();
				$(".dropdown-text").text("请选择品牌");
				$('.img_box img').attr('src', "");
				$("[type='hidden']").val('');
				imgs=[];
			}
		});
	});

})