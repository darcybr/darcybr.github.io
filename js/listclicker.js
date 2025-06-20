//load the relevant section of a file into the maincontent div

$(document).ready(function() {
    if (window.location.href == 'https://mrbrennan.website/c912.html' || window.location.href == 'https://www.mrbrennan.website/c912.html') {
        $('#maincontent').load('c912-welcome.html');
    }
    else if (window.location.href == 'https://mrbrennan.website/it9.html' || window.location.href =='https://www.mrbrennan.website/it9.html') {
        $('#maincontent').load('it9-welcome.html');
    }
    else if (window.location.href == 'https://mrbrennan.website/projects.html' || window.location.href =='https://www.mrbrennan.website/projects.html'){
        $('#maincontent').load('projects-welcome.html');
	}
	else if (window.location.href == 'https://mrbrennan.website/it8.html' || window.location.href =='https://www.mrbrennan.website/it8.html'){
        $('#maincontent').load('it8-welcome.html');
    }
});
function listClicker(id) {
	switch(id) {
        case "logo":
            window.location.href = "https://mrbrennan.website/index.html";
            $(window).scrollTop(0);
            break;
        case "c912":
            window.location.href = "https://mrbrennan.website/c912.html";
            $(window).scrollTop(0);
            break;
        case "it9":
            window.location.href = "https://mrbrennan.website/it9.html";
            $(window).scrollTop(0);
            break;
        case "it8":
            window.location.href = "https://mrbrennan.website/it8.html";
            $(window).scrollTop(0);
            break;			
        case "projects":
            window.location.href = "https://mrbrennan.website/projects.html";
            $(window).scrollTop(0);
            break;
        case "logo":
            $('#maincontent').load('c912/welcome.html');
            $(window).scrollTop(0);
            break;
		case "files":
			$('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
			break;
    	case "hdrive":
			$('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
			break;    
        case "hardware":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "software":
			$('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
			break;
        case "foss":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "html":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "adobelearn":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "codeorg":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "vscodesetup":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "pythonintro":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "pythonchatbot":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
// Beginning of Choice Section
        case "hackclub":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "3ddesign":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "illustrator":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "electronics":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "python":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "godot":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "csharp":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "beyond":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
// Grade 8 Only Assignments
        case "nametag":
            $('#maincontent').load('it8/it8-work.html #' + id);
            $(window).scrollTop(0);
                break;
        case "makecode":
            $('#maincontent').load('it8/it8-work.html #' + id);
            $(window).scrollTop(0);
                break;
        case "moretinkercad":
            $('#maincontent').load('it8/it8-work.html #' + id);
            $(window).scrollTop(0);
                break;
        case "pythonminecraft":
            $('#maincontent').load('it8/it8-work.html #' + id);
            $(window).scrollTop(0);
                break;
        case "godotgameone":
            $('#maincontent').load('it8/it8-work.html #' + id);
            $(window).scrollTop(0);
                break;

// Beginning of Project Section
        case "smart":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "labwork":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "exploration":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
        case "majorprojects":
            $('#maincontent').load('c912/coursework.html #' + id);
            $(window).scrollTop(0);
                break;
// This is just for the power button
        case "powerbtn":
            // Placeholder for function
            my_function();
		}
}
let counter = 0;
let r = 0;
let g = 0;
let b = 0;
function my_function() {
    screenDiv = document.getElementById('consolescreen');
    textDiv = document.getElementById('helloworld');
    secondtextDiv = document.getElementById('othertext');
    cursorDiv = document.getElementById('cursor');
    let screen_bg = 'background: radial-gradient(ellipse at bottom, #000000, transparent), radial-gradient(ellipse at top, #064721, transparent);'
    if (screenDiv.style.backgroundColor == "black"){
        screenDiv.style = screen_bg;
        textDiv.style.color = '#66FF66';
        secondtextDiv.style.color = '#66FF66';
        cursorDiv.style.display = 'flex';
    }
    else {
        screenDiv.style.backgroundColor = "black";
        textDiv.style.color = "black";
        secondtextDiv.style.color = 'black';
        cursorDiv.style.display = 'none';

    }
    counter += 1;

    if (counter == 100) {
        if (r == 0 && g == 0 && b == 0) {
            let newRand = Math.floor(Math.random() * 3);
            switch (newRand) {
                case 0:
                    r = 1;
                    break
                case 1:
                    g = 1;
                    break
                case 2:
                    b = 1;
                    break
                }
            }
        for (let i = 0; i < 500; i++){
            if (r < 253 && r > 0) {
                r++;
            }
            else if (g < 253 && g > 0) {
                g++;
            }
            else if (b < 253 && b > 0) {
                b++;
            }
            document.getElementById('biggercontainer').style.backgroundColor = "rgb(${r},${g},${b})";
        }
    }
}
