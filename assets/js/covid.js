
const covidTrack = () => {

	function reqListener() {
		const covidBadge = document.getElementById('covid');
		console.log(this.responseText);
		const data = JSON.parse(this.responseText);
		document.getElementById('covid-confirmed').innerHTML += data[data.length-1].Confirmed;
		covidBadge.classList.add('show');
		covidBadge.classList.remove('hide');
    }

    let oReq = new XMLHttpRequest();
    let country = 'argentina';
	oReq.addEventListener('load', reqListener);
	oReq.open('GET', `https://api.covid19api.com/live/country/${country}/status/confirmed`);
    oReq.send();
};
covidTrack();
