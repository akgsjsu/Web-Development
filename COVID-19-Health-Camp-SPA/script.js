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
    var fst = (document.getElementById('fname').value) ?  document.getElementById('fname').value : 'None';
    var lst = (document.getElementById('lname').value) ?  document.getElementById('lname').value : 'None';
    var gndr = (document.getElementById('gender').value) ?  document.getElementById('gender').value : 'None';
    var ag = (document.getElementById('age').value) ?  document.getElementById('age').value : 'None';
    var meds = (document.getElementById('med').value) ?  document.getElementById('med').value : 'None';
    var note = (document.getElementById('notes').value) ?  document.getElementById('notes').value : 'None';

    if (patientData.length > 0){
        const obj = {
            'fname' : fst,
            'lname' : lst,
            'gender' : gndr,
            'age' : ag,
            'medication': meds,
            'notes' : note
        };

        var stored = JSON.parse(localStorage.getItem("task"));
        stored.push(obj);
    }
    const obj = {
        'fname' : fst,
        'lname' : lst,
        'gender' : gndr,
        'age' : ag,
        'medication': meds,
        'notes' : note
    };
    patientData.push(obj);

    localStorage.setItem("task", JSON.stringify(patientData));
}

function clickPhoto(){
    let camera_button = document.querySelector("#start-camera");
    let video = document.querySelector("#video");
    let captureButton = document.querySelector("#capture");
    let canvas = document.querySelector("#canvas");

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
        var pData = JSON.parse(localStorage.task);
       
        for ( i = 0; i < pData.length; ++i) {
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.insertCell(0).innerHTML= pData[i].fname;
            row.insertCell(1).innerHTML= pData[i].lname;
            row.insertCell(2).innerHTML= pData[i].gender;
            row.insertCell(3).innerHTML= pData[i].age;
            row.insertCell(4).innerHTML= pData[i].medication;
            row.insertCell(5).innerHTML= pData[i].notes; 
        }
    
}

function vaccinationImage(){
    var vac = document.querySelector("#vac");
    ctx = vac.getContext('2d');
    ctx.font = "20px Arial";
    ctx.textAlign ="center";
    ctx.fillText("Covid-19 Vaccination Image",vac.width/2, vac.height/4)
}