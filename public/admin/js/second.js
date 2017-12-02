//获取数据渲染页面  渲染分页页数,

var $form = $("form");
$(function() {
	var currentPage = 1;
	var pageSizes = 3;

	function render() {
		$.ajax({
			type: "get",
			url: "/category/querySecondCategoryPaging",
			async: true,
			data: {
				page: currentPage,
				pageSize: pageSizes,
			},
			success: function(data) {
				console.log(data);
				$('tbody').html(template('tpl1', data));
				$("#paginator").bootstrapPaginator({
					bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
					currentPage: currentPage, //当前页
					totalPages: Math.ceil(data.total /
						data.size), //总页数
					size: "small", //设置控件的大小，mini, small, normal,large
					numberOfPages: 5,
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
	//显示模态框,并获取一级分类,渲染给下拉框

	$('.btn_add').on('click', function() {
		$('#addModal').modal('show');
		$.ajax({
			type: "get",
			url: "/category/queryTopCategoryPaging",
			async: true,
			data: {
				page: 1,
				pageSize: 100,
			},
			success: function(data) {
				console.log(data);
				$('.dropdown-menu').html(template('tpl2', data));

			}
		});
	})

	//下拉框a标签点击事件,委托;获取到当前a标签的文本，设置给按钮的文本;获取到id值，设置给categoryId;  手动让categoryId校验成功
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
						message: "请选择一级分类"
					}
				}
			},
			brandName: {
				validators: {
					notEmpty: {
						message: "请输入二级分类的名称"
					}
				}
			},
			brandLogo: {
				validators: {
					notEmpty: {
						message: "请上传图片"
					}
				}
			}
		}
	});
	//4.图片上传,插件
	$("#fileupload").fileupload({
		dataType: "json",
		//e：事件对象
		//data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
		done: function(e, data) {
			console.log(data);
			$('.img_box img').attr('src', data.result.picAddr);
			$("[name='brandLogo']").val(data.result.picAddr);
			$form.data('bootstrapValidator').updateStatus('brandLogo', 'VALID');

		}
	});

	//校验后提交,阻止默认提交
	$form.on('success.form.bv', function(e) {
		e.preventDefault();
		//使用ajax提交逻辑
		$.ajax({
			type: "post",
			url: "/category/addSecondCategory",
			async: true,
			data: $form.serialize(),
			success: function(data) {
				$('#addModal').modal('hide');
				page = 1;
				render();

				$form[0].reset();
				$form.data('bootstrapValidator').validator.resetForm();
				$(".dropdown-text").text("请选择一级分类");
				$('.img_box img').attr('src', "images/none.png");
				$("[type='hidden']").val('')
			}
		});
	});

})