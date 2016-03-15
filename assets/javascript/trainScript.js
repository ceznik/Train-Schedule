var trainName = "";
var destination = "";
var frequency = "";
var firstArrival = "";
var nextArrival = "";
var minutesAway = "";
var table = $('#tableData');

// Firebase Object
var dataRef = new Firebase("https://blazing-inferno-5503.firebaseio.com/");




//click listerner for Add Train button 

$('#addTrain').on('click', function(){

trainName = $('#nameInput').val().trim();
destination = $('#destInput').val().trim();
firstArrival = $('#firstTrainInput').val().trim();
frequency = $('#frequency').val().trim();

console.log(trainName + ' ' + destination + ' ' + firstArrival + ' ' + frequency);

//Generate a Moment by adding today's date to the first arrival time
var firstArrivalMoment = moment().format('l') + ' ' + firstArrival;
console.log(moment(firstArrivalMoment).format('LT'));
//calculate the # of minutes to the next arrival

var i = 0;
do {
	nextArrival = moment(firstArrivalMoment).add(frequency*i, 'minutes');
	i++;
}
while (!nextArrival.isSameOrAfter(moment()))

minutesAway = nextArrival.diff(moment(),'minutes');
console.log(minutesAway);


dataRef.push({
	trainName: trainName,
	destination: destination,
	firstArrival: firstArrival,
	frequency: frequency
})

$('#nameInput').val("");
$('#destInput').val("");
$('#firstTrainInput').val("");
$('#frequency').val("");


return false;
})

dataRef.on('child_added', function(childSnapshot) {
	console.log(childSnapshot.val());
	trainName = childSnapshot.val().trainName;
	destination = childSnapshot.val().destination;
	frequency = childSnapshot.val().frequency;

	//generate a moment object from the first arrival time
	var firstArrivalMoment = moment().format('l') + ' ' + childSnapshot.val().firstArrival;

	//add frequencies to nextArrival until it is in the future
	var i = 0;
	do {
		nextArrival = moment(firstArrivalMoment).add(frequency*i, 'minutes');
		i++;
	}
	while (!nextArrival.isSameOrAfter(moment()))

	minutesAway = nextArrival.diff(moment(),'minutes');
	console.log(minutesAway);
	console.log("next arrival after loop: " + moment(nextArrival).format('LT'));	


	var row = $('<tr>');
	
	row.append('<td>' + trainName + '</td>');
	row.append('<td>' + destination + '</td>');
	row.append('<td>' + frequency + '</td>');
	row.append('<td>' + moment(nextArrival).format('LT') + '</td>');
	row.append('<td>' + minutesAway + '</td>');



	$('.table').append(row);
}, function(errorObject){

	console.log("Error Processing Request. Please try again later");
});



