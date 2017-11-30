$(function() {
	var currentPage = 1;
	var pageSize = 4;

	function render() {
		$.ajax({
			type: "get",
			url: "/user/queryUser",
			data: {
				page: currentPage,
				pageSize: pageSize
			},
			success: function(data) {
				//			console.log(data);
				$('tbody').html(template('tpl', data));
				$("#paginator").bootstrapPaginator({
					bootstrapMajorVersion: 3,
					currentPage: currentPage, //显示当前页
					totalPages: Math.ceil(data.total / data.size), //计算总页数
					numberOfPages: 5,
					onPageClicked: function(a, b, c, page) {
						currentPage = page;
						render();
					}
				});
			}
		});
	}
	render();

	$('tbody').on('click', '.btn', function() {
		$('#userModal').modal("show");
		var id = $(this).parent().data('id');
		var isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
		$('.btn_confirm').off().on('click', function() {
			$.ajax({
				type: "post",
				url: "/user/updateUser",
				async: true,
				data: {
					id: id,
					isDelete: isDelete
				},
				success: function(data) {
					if(data.success) {
						$("#userModal").modal("hide");
						render();
					}
				}
			});
		})
	})

})