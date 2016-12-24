$(function(){
	var constants = { "token":"1c953b74aff7b08ee80d5e4b2f5a8651", "domain":"http://frosty-shape-9375.herokuapp.com." }; Devless = new Devless(constants);

	$('#submitname').click(function(){
		var name = $('#name').val();
		var data = {'name': name};
		Devless.addData('register', 'namestable', data, function(response){
			console.log(response);
			$('#response').text(response.message);
		});
	});
});