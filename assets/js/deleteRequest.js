$(document).ready(function () {
	$('.delete_article').on('click', function (e) {
		$target = $(e.target);
		var id = $target.attr('data-id');
		$.ajax({
			type: 'DELETE',
			url: `/users/deleteArticle/${id}`,
			success: function (response) {
				window.location.href='/users/profile';
			},
			error: function (err) {
				console.log(`error from ajax delete request ${err}`);
			}
		});
	});
});