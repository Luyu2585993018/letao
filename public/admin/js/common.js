NProgress.configure({
	showSpinner: false
});
$(document).ajaxStart(function() {
	NProgress.start()
});
$(document).ajaxStop(function() {
	NProgress.done();
});