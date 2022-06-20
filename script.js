// The three.js scene: the 3D world where you put objects
console.log('hi')
const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);


// A cube we are going to animate
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshBasicMaterial({ color: 0x3c7fff })
};

// The mesh: the geometry and material combined, and something we can directly add into the scene (I had to put this line outside of the object literal, so that I could use the geometry and material properties)
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);

// Add the cube into the scene
scene.add(cube.mesh);

// Make the camera further from the cube so we can see it better
camera.position.z = 5;

function render() {
  // Render the scene and the camera
  renderer.render(scene, camera);

  // Rotate the cube every frame
  cube.mesh.rotation.x += 0.005;
  cube.mesh.rotation.y -= 0.01;

  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();

const material = new THREE.MeshBasicMaterial({ color: 0x3c7fff })
const loader = new STLLoader();
loader.load(
    'bunny.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
render();

function submit(){
	alert(`The function 'test' is executed`);
	var input = document.getElementById('fname');
	console.log(input.value);		
}

    function test() {
      //alert(`The function 'test' is executed`);
			var input = document.getElementById('username');
			//console.log(input.value);
			window.location.href = "https://3ddata.nikhilrado.repl.co/test?data=" + input.value;
    }

function arrayToString(array){
			output = "["
			for (var i = 0; i < array.length; i++){
				output += "["
				//for (var j = 0; j < array[i].length; j++){
					
					output += array[i]//
				  output += ","
					
					
				//}
				output = output.slice(0, -1)
				output += "],"
			}
			output = output.slice(0, -1)
			output += "]"
			output = output
			console.log("yo")
			output = output.replace(/(\r\n|\n|\r)/gm, "")
			console.log(output)
			sessionStorage.setItem('data', output)
			document.cookie = "data=" + output
			window.location.href = "/test";
		}
		//arrayToString([[1,2,3,4],[2,3,4]])
		
    function Upload() {
        var fileUpload = document.getElementById("fileUpload");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
			  var data = []
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var table = document.createElement("table");
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                        var row = table.insertRow(-1);
                        var cells = rows[i].split(",");
                        for (var j = 0; j < cells.length; j++) {
                            var cell = row.insertCell(-1);
                            cell.innerHTML = cells[j];
														//console.log(cells)
                        }
												data.push(cells)
											
												//console.log(data)
                    }
										//console.log(data)
										arrayToString(data)
                    var dvCSV = document.getElementById("dvCSV");
                    dvCSV.innerHTML = "";
                    dvCSV.appendChild(table);
                }
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    }

function go(){
	sessionStorage.setItem('data', document.getElementById('data2').value)
	window.location.href = "https://solidify.ortanatech.com/test?data=bob"//+document.getElementById('data2').value
}
	
		function getCookie(cname) {
	  let name = cname + "=";
	  let decodedCookie = decodeURIComponent(document.cookie);
	  let ca = decodedCookie.split(';');
	  for(let i = 0; i <ca.length; i++) {
	    let c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
	
	function generateUUID(){
		return Math.random().toFixed(4)*10000
	}
	if (getCookie("uuid") == ""){
			document.cookie = "uuid=" + generateUUID()
			console.log("uuid created")
	}
	console.log(getCookie("uuid"))
	
	
		var input2 = document.getElementById('upload');
		input2.addEventListener('change', Upload);
		input2.onchange = () => {
	  const selectedFile = input2.files[0];
	  console.log(selectedFile);
		}

	const fileInput = document.getElementById('upload');
	const handleFiles = () => {
	  const selectedFiles = [...fileInput.files];
	  console.log(selectedFiles);
	}
	fileInput.addEventListener("change", handleFiles);