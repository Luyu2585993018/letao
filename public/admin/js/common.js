/**
 * Created by HUCC on 2017/11/21.
 */
//进度条功能

NProgress.configure({
	showSpinner: false
});

$(document).ajaxStart(function() {
	NProgress.start();
});

$(document).ajaxStop(function() {
	//完成进度条
	setTimeout(function() {
		NProgress.done();
	}, 1500);
});


if(location.href.indexOf('login.html')==-1){
	$.ajax({
		type:"get",
		url:"/employee/checkRootLogin",
		async:true,
		success:function(data){
			if(data.error==400){
				location.href='login.html';
			}
		}
	});
}


$(".child").prev().on("click", function () {
  $(this).next().stop().slideToggle();
});


//侧边栏显示与隐藏效果
$(".icon_menu").on("click", function () {
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
  $(".p_right").toggleClass("now");
});


//退出功能
$(".icon_logout").on("click", function () {
  $("#logoutModal").modal("show");
  $(".btn_logout").off().on("click", function () {
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      success:function(data) {
        if(data.success){
          location.href = "login.html";
        }
      }
    });
  });
});