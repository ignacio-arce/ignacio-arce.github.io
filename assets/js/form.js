(function () {

	function success() {
		$('#form-elements').fadeOut();
		$('#thankyou-message').fadeIn();
		$('#modal').modal('hide');
	}

	function postForm(url, data) {
		$('#modal').modal('show');
		$.post(url, data, success);
	}

	function getFormData(form) {
		return {
			url: form.attr('action'),
			data: form.serialize()
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		var form = getFormData($(this));
		postForm(form.url, form.data);
		$('#modal').modal('hide');
	}

	$('form#form').submit(handleSubmit);
})();
