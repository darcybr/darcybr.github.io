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
  const inputField = $('#hiddenInput');
  const display = $('#terminput');

  // Autofocus the hidden input
  inputField.focus();

  // Refocus if clicked anywhere in terminal
  $('#biggercontainer').on('click', function () {
    inputField.focus();
  });

  // Sync input to display
  inputField.on('input', function () {
    display.text(this.value);
  });

  // Handle Enter and Backspace
  inputField.on('keydown', function (e) {
    // later if i define validCommands outside I can just add the html for the . and .. to a list of these from the dictionary.
    if (e.key === 'Enter') {
        const cmd = this.value.trim();
        const validCommands= {
            it8: 'https://mrbrennan.website/it8.html',
            it9: 'it9.html',
            c912: 'c912.html',
            projects: 'projects.html',
            weather_station: 'https://darcybrennan.pythonanywhere.com',
        }

      if (cmd in validCommands) {
        window.location.href = validCommands[cmd];
      } else {
        commandNotFound(`Command not found: ${cmd}`);
      }
      this.value = '';
      display.text('');
    }
  });
// watchDoomStatus(tron); 
// Removed tronning checker since it's just hammering pythonanywhere 
});

function watchDoomStatus(onDoomActivated) {
    let doomActive = false;
    let originalConsoleHTML = "";

    async function checkStatus() {
    try {
        const response = await fetch('https://darcybrennan.pythonanywhere.com/status');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json(); // Parse as JSON

        const consoleScreen = document.getElementById("consolescreen");
        if (!consoleScreen) return;

        if (data.field1 === "1" && !doomActive) {
        originalConsoleHTML = consoleScreen.innerHTML; // Save BEFORE tron()
        doomActive = true;
        onDoomActivated(); // runs tron(), which clears it
        } else if (data.field1 === "0" && doomActive) {
            consoleScreen.innerHTML = originalConsoleHTML;
            doomActive = false;
        }
    } catch (error) {
        console.error('Error checking status:', error);
    }
    }


    // Poll every few seconds
    setInterval(checkStatus, 3000);
}

function tron() {
  const container = document.getElementById("consolescreen");
  container.innerHTML = "";

  const canvas = document.createElement("canvas");
  canvas.id = "tron_canvas";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.appendChild(canvas);

  const gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported.");
    return;
  }

  const fragShaderSrc = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    vec4 permute_3d(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt3d(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

    float simplexNoise3d(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.xxx * 2.0;
      vec3 x3 = x0 - 1.0 + C.xxx * 3.0;
      i = mod(i, 289.0);
      vec4 p = permute_3d(permute_3d(permute_3d(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt3d(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    float fbm3d(vec3 x, const int it) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100.0);
      for (int i = 0; i < 5; ++i) {
        v += a * simplexNoise3d(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    vec3 rotateZ(vec3 v, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return vec3(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
    }

    float facture(vec3 v) {
      vec3 n = normalize(v);
      return max(max(n.x, n.y), n.z);
    }

    vec3 emission(vec3 color, float strength) {
      return color * strength;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
      vec3 color = normalize(vec3(uv.xy, 0.5));
      color -= 0.2 * vec3(0.0, 0.0, iTime);
      color = rotateZ(color, -log2(length(uv)));
      float freq = 1.4;
      float d = 0.01;
      color.x = fbm3d(color * freq + 0.0, 5) + d;
      color.y = fbm3d(color * freq + 1.0, 5) + d;
      color.z = fbm3d(color * freq + 2.0, 5) + d;
      vec3 noise = color * 2.0 - 0.1;
      noise *= 0.188;
      noise += vec3(uv.xy, 0.0);
      float lenN = 0.770 - length(noise);
      lenN *= 4.2;
      vec3 em = emission(vec3(0.961, 0.592, 0.078), pow(lenN, 1.0) * 0.4);
      float fac = (length(uv) - facture(color + 0.32) + 0.1) * 3.0;
      color = mix(em, vec3(fac), fac + 1.2);
      fragColor = vec4(color, 1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  const vertShaderSrc = `
    attribute vec4 a_position;
    void main() {
      gl_Position = a_position;
    }
  `;

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const vs = compileShader(gl.VERTEX_SHADER, vertShaderSrc);
  const fs = compileShader(gl.FRAGMENT_SHADER, fragShaderSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const iResolution = gl.getUniformLocation(program, "iResolution");
  const iTime = gl.getUniformLocation(program, "iTime");

  function render(t) {
    gl.uniform2f(iResolution, canvas.width, canvas.height);
    gl.uniform1f(iTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}


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
        case "camp":
            window.location.href = "https://mrbrennan.website/camp.html";
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
            // runs the function to change the background style on the screen and hide/show the text.
            lightsOut();
		}
}
let counter = 0;
let r = 0;
let g = 0;
let b = 0;
function lightsOut() {
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







function commandNotFound(text) {
  const messageDiv = document.getElementById('errormessage');
  messageDiv.textContent = text;
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}
