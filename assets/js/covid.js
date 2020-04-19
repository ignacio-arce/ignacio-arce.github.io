
const covidTrack = () => {

	function reqListener() {
        console.log(this.responseText);
		document.getElementById('covid').innerHTML += JSON.parse(this.responseText)[6].Confirmed;
    }

    let oReq = new XMLHttpRequest();
    let country = 'argentina';
	oReq.addEventListener('load', reqListener);
	oReq.open('GET', `https://api.covid19api.com/live/country/${country}/status/confirmed`);
    oReq.send();
};

covidTrack();
