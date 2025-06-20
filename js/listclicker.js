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
function my_function() {
    myDiv = document.getElementById('biggercontainer');
    myDiv.style.backgroundColor = "white";
}
