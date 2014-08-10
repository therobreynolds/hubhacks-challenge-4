$(document).ready(function() {
	var id = location.search.replace('?', '').split('=')[1];
	var appData;
	var reviewsData = "";
	var reviewProgress = "";

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
				//$('#reviews').text(data.Reviews.0.ReviewType.Description);
			},
			failure: function (xqr) {
				alert("Failed to load Process State data!");
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
				  	$('#durationText').text(value.Duration);
				  	$('#performingText').text(value.WhoPerforming);
				  	$('#contactText').text(value.Contact);
				  }
				});
			}
		});

		//get Review info
		$.ajax({
			url: "https://permitapidev.cityofboston.gov:4443/api/building/applicationinfo/"+id,
			type: "GET",
			dataType: "json",
			success: function (reviews) {
				console.log(reviews);
				//console.log(reviewsData);
				$.each( reviews.Reviews, function( key, value ) {
				   if(value.ReviewResult.Code === " ") {
				   		reviewProgress = "Not yet Assigned";
				   		if(value.IsAssigned === "Y"){
				   			reviewProgress = "Assigned, but not Started";
				   		}
				   		if(value.IsStarted === "Y"){
				   			reviewProgress = "Started, but not yet Complete";
				   		}
				   		if(value.IsComplete === "Y"){
				   			reviewProgress = "Complete, and awaiting Result";
				   		}
				   }
				   else {
				   		reviewProgress = value.ReviewResult.Code;
				   }
				   	console.log(value);
				  	reviewsData += value.ReviewType.Description + " : " +reviewProgress + "<br>"; //= value.ReviewResult.Code;
				  	
				  	
				});
				$('#reviewsText').html(reviewsData);
			}
		});

	}
})
