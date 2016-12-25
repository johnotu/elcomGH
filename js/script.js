$(function(){
	/*
	var constants = { "token":"1c953b74aff7b08ee80d5e4b2f5a8651", "domain":"https://frosty-shape-9375.herokuapp.com." }; Devless = new Devless(constants);
	*/
	var constants = { "token":"7f0449c4d77ade309aa26ef0a9de6bbe", "domain":"http://localhost:3000" }; Devless = new Devless(constants);

	var startDate = new Date();

	function saveData(){
		setInterval(function(){
			var endDate = new Date();
			var datetime = String(Math.floor((endDate.getTime() - startDate.getTime())/1000));
			var amount = String(Math.floor(Math.random()*500));
			var data = {'datetime': datetime, 'amount': amount};
			Devless.addData('elcomgh', 'consumption', data, function(response){console.log(response);})
		}, 5000);
	}

	$('#submitname').click(function(){
		var name = $('#name').val();
		var data = {'name': name};
		Devless.addData('register', 'namestable', data, function(response){
			console.log(response);
			$('#response').text(response.message);
		});
	});

	function chartData(){
		Chart.defaults.global.responsive = true;

		var xaxis = [], yaxis = [], id = 0;
		var ctx = document.getElementById('consumption').getContext('2d'),
				startingData = {
					type: 'line',
					data: {
						labels: xaxis,
						datasets: [{
							label: 'Electricity Consumption',
							data: yaxis,
							backgroundColor: "rgba(153,255,51,0.4)"
						}]
					}
				};

		var myLiveChart = new Chart(ctx, startingData);
		setInterval(function(){
			id++;
			params = {where:["id,"+id]};
			Devless.queryData('elecomgh', 'consumption', params, function(response){
				console.log(response);
				var newDateTime = response.payload.results[0].datetime;
				var newAmount = response.payload.results[0].amount;
				xaxis.push(newDateTime);
				yaxis.push(newAmount);
				if(xaxis.length > 50){
					xaxis.shift();
					yaxis.shift();
				}
				myLiveChart.update();
			})
		}, 5000);
	}
	
	saveData();
	//chartData();
});