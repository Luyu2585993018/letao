NProgress.configure({
	showSpinner: false
});
$(document).ajaxStart(function() {
	NProgress.start()
});
$(document).ajaxStop(function() {
	NProgress.done();
});
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

  //因为jquery注册事件不会覆盖。
  //off()解绑所有的事件
  //off("click")
  $(".btn_logout").off().on("click", function () {
    
    //发送ajax请求，告诉服务器，需要退出
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      success:function(data) {
        if(data.success){
          //退出成功，才跳转到登录页面
          location.href = "login.html";
        }
      }
    });


  });
});