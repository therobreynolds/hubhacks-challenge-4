$(document).ready(function() {
	var id = location.search.replace('?', '').split('=')[1];
	var appData;

	// only if an ID is given
	if(id) {
		// get overall info
		$.ajax({
			url: "https://permitapidev.cityofboston.gov:4443/api/building/applicationinfo/"+id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				console.log(data);
				appData = data;
				$('.container > p').html("Hello, <i>"+ data.Applicants[0].Contact.Identity.LastName + "</i>!<br> Your application status is: ");
				$('#statusLbl').text(data.ProcessState.Code);
			},
			failure: function (xqr) {
				alert("Failed to load data!");
			}
		});

		// get additional staff info
		/*
		$.ajax({
			url: "http://rawgit.com/agraebe/hubhacks-challenge-4/master/json/staff.json",
			type: "GET",
			dataType: "json",
			success: function (staff) {
				console.log(staff);
			}
		});
		*/

		//get additional milestone info
		$.ajax({
			url: "http://rawgit.com/agraebe/hubhacks-challenge-4/master/json/milestones.json",
			type: "GET",
			dataType: "json",
			success: function (milestones) {
				$.each( milestones, function( key, value ) {
				  if(value.Milestone === appData.ProcessState.Code) {
				  	console.log(value);
				  	$('#statusLbl').text(value.Status);
				  	$('#descriptionLbl').text(value.Description);
				  }
				});
			}
		});

	}
})
