
const covidTrack = () => {

	function reqListener() {
		const covidBadge = document.getElementById('covid');
		document.getElementById('covid-confirmed').innerHTML += JSON.parse(this.responseText)[6].Confirmed;
		covidBadge.classList.add('show');
		covidBadge.classList.remove('hide');
    }

    let oReq = new XMLHttpRequest();
    let country = 'argentina';
	oReq.addEventListener('load', reqListener);
	oReq.open('GET', `https://api.covid19api.com/live/country/${country}`);
    oReq.send();
};

covidTrack();
