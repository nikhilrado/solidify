// functionality scripts
function submit() {
  alert(`The function 'test' is executed`);
  var input = document.getElementById("fname");
  console.log(input.value);
}

function test() {
  //alert(`The function 'test' is executed`);
  var input = document.getElementById("username").value;
  //console.log(input.value);
  if (!input.includes("-")) {
    input += "-all";
  }
  console.log(input);
  window.location.href = "https://3ddata.nikhilrado.repl.co/test?data=" + input;
}

function arrayToString(array) {
  output = "[";
  for (var i = 0; i < array.length; i++) {
    output += "[";
    //for (var j = 0; j < array[i].length; j++){

    output += array[i]; //
    output += ",";

    //}
    output = output.slice(0, -1);
    output += "],";
  }
  output = output.slice(0, -1);
  output += "]";
  output = output;
  console.log("yo");
  output = output.replace(/(\r\n|\n|\r)/gm, "");
  console.log(output);
  sessionStorage.setItem("data", output);
  document.cookie = "data=" + output;
  window.location.href = "/test";
}
//arrayToString([[1,2,3,4],[2,3,4]])

function Upload() {
  var fileUpload = document.getElementById("fileUpload");
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
  var data = [];
  if (regex.test(fileUpload.value.toLowerCase())) {
    if (typeof FileReader != "undefined") {
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
          data.push(cells);

          //console.log(data)
        }
        //console.log(data)
        arrayToString(data);
        var dvCSV = document.getElementById("dvCSV");
        dvCSV.innerHTML = "";
        dvCSV.appendChild(table);
      };
      reader.readAsText(fileUpload.files[0]);
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid CSV file.");
  }
}

function go() {
  sessionStorage.setItem("data", document.getElementById("data2").value);
  window.location.href = "https://solidify.ortanatech.com/test?data=bob"; //+document.getElementById('data2').value
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function generateUUID() {
  return Math.random().toFixed(4) * 10000;
}

if (getCookie("uuid") == "") {
  document.cookie = "uuid=" + generateUUID();
  console.log("uuid created");
}
console.log(getCookie("uuid"));

window.onload = function() {
	//var input2 = document.getElementById("upload");
	//input2.addEventListener("change", Upload);

	//input2.onchange = () => {
	//  const selectedFile = input2.files[0];
	//  console.log(selectedFile);
	//};

	//const fileInput = document.getElementById("upload");
	//const handleFiles = () => {
	//  const selectedFiles = [...fileInput.files];
	//  console.log(selectedFiles);
	//};
	//fileInput.addEventListener("change", handleFiles);
}

// 3d stuff
function STLViewer(model, elementID) {
  var elem = document.getElementById(elementID);
  camera = new THREE.PerspectiveCamera(
    70, elem.clientWidth / elem.clientHeight,1,1000);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(elem.clientWidth, elem.clientHeight);
  elem.appendChild(renderer.domElement);
  window.addEventListener(
    "resize",
    function () {
      renderer.setSize(elem.clientWidth, elem.clientHeight);
      camera.aspect = elem.clientWidth / elem.clientHeight;
      camera.updateProjectionMatrix();
    },
    false
  );

  //controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.5;
  controls.dampingFactor = 1.2;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;

  scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
	const light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( 50, 50, 50 );
	scene.add(light);
	const light2 = new THREE.PointLight( 0xffffff, 1, 100 );
	light2.position.set( -50, 50, 50 );
	scene.add(light2);

  loadit(model);
}

function loadit(model){
  new THREE.STLLoader().load(model, function (geometry) {
    var material = new THREE.MeshPhongMaterial({
      color: 0xff5533,
      specular: 100,
      shininess: 100,
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    console.log(mesh);
    //scene.remove(mesh);

    var middle = new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(middle);
    mesh.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
    );

    var largestDimension = Math.max(
      geometry.boundingBox.max.x,
      geometry.boundingBox.max.y,
      geometry.boundingBox.max.z
    );
    camera.position.z = largestDimension * 2;

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  });
}


		var URL = 'https://4befauqm4ynfn7ryg7huizv6ca0lcoxq.lambda-url.us-east-2.on.aws?csv='

	
	
	function load_stl(csv){
    fetch(URL+csv+"&uuid="+getCookie("uuid"))
    .then(function (u) {return u.json();})
    .then(function (json) {
		console.log(json);
		//loadit(json);
		stlLink = json;
		document.getElementById("download-stl-link").href = stlLink;
    STLViewer(json, "model"); // calling and passing json to another function processPriceInfo
    });
	}
	//var data = prompt("enter some data")
	console.log(location.search)
	const params = new URLSearchParams(location.search);
	var param_data = params.get('data')
	console.log("fdfd:"+param_data)
	if(param_data != null){
		load_stl(param_data)
	} else {		
		var data = getCookie("data")
		data = sessionStorage.getItem('data');
	
		console.log(data);
		load_stl(data)
	}

	//load_stl([2,3,1,3,4,2,5,2,3,.5,2])


window.onload = function() {
    //STLViewer("https://3ddata.nikhilrado.repl.co/ex-scripts/will-ronan.stl", "model")
STLViewer("/ex-scripts/cshs.stl", "model")

	

}