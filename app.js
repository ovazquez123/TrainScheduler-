// Initialize Firebase
var config = {
apiKey: "AIzaSyARc6FL06wzs1-SRu6XCUW9nbyLdRgXHkw",
authDomain: "train-scheduler-7e066.firebaseapp.com",
databaseURL: "https://train-scheduler-7e066.firebaseio.com",
projectId: "train-scheduler-7e066",
storageBucket: "",
messagingSenderId: "336436315525"
};
firebase.initializeApp(config);

//create a local instance of the firevase
var database = firebase.database();

//event handler for clicking on the Submit button
$('#add-train').on('click', function(){
	event.preventDefault();

	//get the values form the form fields and store them in variables
	var name = $("#name-input").val().trim();
	var dest = $("#dest-input").val().trim();
	var startTime = $("#start-input").val().trim();
	var freq = $("#freq-input").val().trim();

	//push them as children to the firebase
	database.ref().push({
        name: name,
        dest: dest,
        startTime: startTime,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

	//clear the values from the input fields
	$("#name-input").val("");
	$("#dest-input").val("");
	$("#start-input").val("");
	$("#freq-input").val("");

});

// print out the info in the database to the Current Train Schedule whenever the page loads or a new record is added
database.ref().on("child_added", function (childSnapshot) {
 
    //get current time
    var curTime = moment();
    
    //get train start from the database
    var trainStart = childSnapshot.val().startTime

   	// Pushing the start time back 1 yr to ensure it comes before the current time
   	var trainStartConv = moment(trainStart, "hh:mm").subtract(1, "years");

    // calculate the difference between trainStart and curTime
    var diffTime = moment().diff(moment(trainStartConv), "minutes");
    
    // time apart
  	var timeApart = diffTime % childSnapshot.val().freq;

  	// minutes until arrival
  	var minTillTrain = childSnapshot.val().freq - timeApart;

   	//adding minutes until the train to the current time and formatting the appearance of the time
   	var nextArrival = moment().add(minTillTrain, 'm').format('LT');

    // add new row to on-screen table
    $("#emp-table").append(
    	"<tr><td>" + childSnapshot.val().name + "</td>" +
        "<td>" + childSnapshot.val().dest + "</td>" +
        "<td>" + childSnapshot.val().freq + "</td>" +
        "<td>" + nextArrival + "</td>" +
        "<td>" + minTillTrain + "</td></tr>");
   // Handle the errors
	}, function (errorObject) {
    	console.log("Errors handled: " + errorObject.code);
});

