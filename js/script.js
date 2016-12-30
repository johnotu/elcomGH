$(function(){
	
	var constants = { "token":"1c953b74aff7b08ee80d5e4b2f5a8651", "domain":"https://frosty-shape-9375.herokuapp.com." }; Devless = new Devless(constants);

	function updateSwitchState(){
		var params = {where:['id,1']}
		Devless.queryData('elcomgh', 'switchstate', params, function(response){
			console.log(response);
			var results = response.payload.results[0].state;
			if(results === 1){
				$('#power-state').text('ON');
			} else {
				$('#power-state').text('OFF');
			}
		});
	}

	/*
	var constants = { "token":"7f0449c4d77ade309aa26ef0a9de6bbe", "domain":"http://localhost:3000" }; Devless = new Devless(constants);
	
	var startDate = new Date();

	/*function saveData(){
		setInterval(function(){
			var endDate = new Date();
			var datetime = String(Math.floor((endDate.getTime() - startDate.getTime())/1000));
			var amount = String(Math.floor(Math.random()*500));
			var data = {'datetime': datetime, 'amount': amount};
			Devless.addData('elcomgh', 'consumption', data, function(response){console.log(response);})
		}, 5000);
	}*/

	$('#power').click(function(){
		Devless.queryData('elcomgh', 'switchstate', {where:['id,1']}, function(response){
			console.log(response);
			if(response.payload.results[0].state === 1){
				Devless.updateData('elcomgh', 'switchstate', 'id', '1', {'state': '0'}, function(response){
					console.log(response);
					if(response.status_code === 619){
						$('#power-state').text('OFF');
					}
				})
			} else {
				Devless.updateData('elcomgh', 'switchstate', 'id', '1', {'state': '1'}, function(response){
					console.log(response);
					if(response.status_code === 619){
						$('#power-state').text('ON');
					}
				})
			}
		});
	});

	function dayAverage(){
		var dayList = [], dayTotal = 0;
		setInterval(function(){
			var dt = new Date(), day = String(dt.getDate());
			Devless.queryData('elcomgh', 'consumption', {where:["day,"+day]}, function(response){
				var dtDay = response.payload.results, dayLength = dtDay.length;
				for (var i=0; i<dayLength; i++){
					dayList.push(dtDay[i].day);
				}
				var dayListLength = dayList.length;
				for(var j=0; j<dayListLength; j++){
					dayTotal += dayList[j];
				}
				var avg = Math.floor(dayTotal/dayListLength);
				$('#daily').text(avg);
			})
		}, 60000)
	}


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
							backgroundColor: "rgba(68,173,142,0.5)"
						}]
					}
				};

		var myLiveChart = new Chart(ctx, startingData);
		setInterval(function(){
			var dt = new Date(), dts = String(dt.getDate()+'-'+dt.getHours()+':'+dt.getMinutes());
			var params = {size:1, where:["datetime,"+dts]};
			Devless.queryData('elcomgh', 'consumption', params, function(response){
				console.log(response);
				var newDateTime = response.payload.results[0].datetime,
						newAmount = response.payload.results[0].amount;
				$('#figure').text(String(newAmount))
				xaxis.push(newDateTime);
				yaxis.push(newAmount);
				if(xaxis.length > 10){
					xaxis.shift();
					yaxis.shift();
				}
				myLiveChart.update();
			});
		}, 30000);
	}
	
	updateSwitchState();
	//saveData();
	chartData();
	//dayAverage();
});