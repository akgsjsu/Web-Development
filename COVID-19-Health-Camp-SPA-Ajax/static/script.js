function renderContents(activeTab) {
    switch(activeTab) {
        case "demographics":
            renderDemographics();
            break;
        case "healthVitals":
            renderHealthVitals();
            break;
        case "reports":
            renderReports();
            break;
        default:
            renderDemographics();
    }
}

function renderDemographics(){
    var demo = document.getElementById('demo');
    var vital = document.getElementById('vitals');
    var report = document.getElementById('reports');
    demo.classList.remove("d-none");
    vital.classList.add("d-none");
    report.classList.add("d-none");
}

function renderHealthVitals(){
    var demo = document.getElementById('demo');
    var vital = document.getElementById('vitals');
    var report = document.getElementById('reports');
    vital.classList.remove("d-none");
    demo.classList.add("d-none");
    report.classList.add("d-none");

}
function renderReports(){
    var demo = document.getElementById('demo');
    var vital = document.getElementById('vitals');
    var report = document.getElementById('reports');
    report.classList.remove("d-none");
    demo.classList.add("d-none");
    vital.classList.add("d-none");
    retrieveData();

}

function save(){
    var fst = (document.getElementById('fname').value) ?  document.getElementById('fname').value : null;
    var lst = (document.getElementById('lname').value) ?  document.getElementById('lname').value : null;
    var gndr = (document.getElementById('gender').value) ?  document.getElementById('gender').value : null;
    var ag = (document.getElementById('age').value) ?  document.getElementById('age').value : null;
    var meds = (document.getElementById('med').value) ?  document.getElementById('med').value : null;
    var note = (document.getElementById('notes').value) ?  document.getElementById('notes').value : null;
    var dataURL = document.getElementById('Captured-Photo').toDataURL();
    var vacCert = document.getElementById('vaccination-certificate').files[0]?  document.getElementById('vaccination-certificate').files[0] : null;
    const rdr = new FileReader();
    if (vacCert){
        rdr.readAsDataURL(vacCert)
    }
    
    rdr.addEventListener("load", () => {
        vacCert.src = rdr.result;
        console.log(vacCert.src);

        const obj = {
            'fname' : fst,
            'lname' : lst,
            'gender' : gndr,
            'age' : ag,
            'medication': meds,
            'notes' : note,
            'photo' : dataURL,
            'cert' : vacCert.src
        };

        var url = "http://localhost:5000/save-data";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Data Saved Successfully!");
            }
        };
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(obj));
    }, false);
}

function clickPhoto(){
    let camera_button = document.querySelector("#start-camera");
    let video = document.querySelector("#video");
    let captureButton = document.querySelector("#capture");
    let canvas = document.querySelector("#Captured-Photo");

    context = canvas.getContext('2d');
    context.fillStyle = "cornflowerBlue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.addEventListener('click', async function() {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
    });

    // Fix photo to Canvas
    captureButton.addEventListener('click', function() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop Streaming
     
     if (video.srcObject)
     {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        video.srcObject = null;
     }
    });
}

function retrieveData(){
    
    var url = "http://localhost:5000/retrieve-data";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let pData =  JSON.parse(xmlhttp.responseText);
            for ( i = 0; i < pData.length; ++i) {
                var rowCount = table.rows.length;
                var row = table.insertRow(rowCount);

                var capturedPhoto = new Image;
                capturedPhoto.src = pData[i].photo;
                
                var cell = row.insertCell(0);
                cell.innerHTML = pData[i].name;
                row.insertCell(1).innerHTML = pData[i].age;
                row.insertCell(2).innerHTML = pData[i].gender;
                row.insertCell(3).innerHTML = capturedPhoto.outerHTML;
                row.insertCell(4).innerHTML = pData[i].medications;
                row.insertCell(5).innerHTML = pData[i].notes;
                var vacCert = pData[i].vaccinationCertificate;
                
                cell.addEventListener("click",()=>{
                    
                    var certificateVaccine = new Image;
                    certificateVaccine.src = vacCert;
                    
                    var vaccinationCanvas = document.querySelector("#vac");
                    vaccinationCntx = vaccinationCanvas.getContext('2d');
                    vaccinationCntx.drawImage(certificateVaccine, 0, 0, vaccinationCanvas.width, vaccinationCanvas.height);
                });
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
}

function vaccinationImage(){
    var vac = document.querySelector("#vac");
    ctx = vac.getContext('2d');
    ctx.font = "20px Arial";
    ctx.textAlign ="center";
    ctx.fillText("Covid-19 Vaccination Image",vac.width/2, vac.height/4)
}