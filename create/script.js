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

var jsondata;
window.addEventListener("load", function () {
  const password = document.getElementById("o-name");

  password.addEventListener("focus", (event) => {
    event.target.style.background = "#51b851";
    console.log("fetch initiated");

    var URL =
      "https://api.solidify.ortanatech.com/action?action=upload-model&uuid=";
    fetch(URL + getCookie("uuid"))
      .then((response) => response.json())
      .then(function (json) {
        jsondata = json;
        console.log(jsondata);
        document.getElementById("payy").style.backgroundColor = "lightgreen";
      });
  });
});

function getCheckoutLink(shipping_countryf, obj_name) {
  var URL = "https://api.solidify.ortanatech.com/action/";
  var URL =
    "https://6jmccwuhpljudbczwm7uaheuzy0infif.lambda-url.us-east-2.on.aws/";
  fetch(URL, {
    headers: {
      Accept: "application/json",
      //'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      action: "checkout",
      uuid: getCookie("uuid"),
      price: parseFloat(jsondata.materials[62].basePrice),
      shipping_country: "US",
      prod_name: obj_name,
    }),
  }).then(function (response) {
    return response.text().then(function (text) {
      console.log(text);
      window.location.href = text;
    });
  });
}

function pay() {
  console.log("pay");
  //window.location.href =
  getCheckoutLink(
    document.getElementById("shipping").value,
    document.getElementById("o-name").value
  );
}

function STLViewer(model, elementID) {
  var elem = document.getElementById(elementID);
  camera = new THREE.PerspectiveCamera(
    70,
    elem.clientWidth / elem.clientHeight,
    1,
    1000
  );
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
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;

  scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(50, 50, 50);
  scene.add(light);
  const light2 = new THREE.PointLight(0xffffff, 1, 100);
  light2.position.set(-50, 50, 50);
  scene.add(light2);

  loadit(model);
}

function loadit(model) {
  document.getElementById('loading-spinner').style.display = 'block';
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
    camera.position.z = largestDimension * 1.5;

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    document.getElementById('loading-spinner').style.display = 'none';
  });
}

var URL = "https://api.solidify.ortanatech.com/3d/csv?csv=";
var text = 'Solidify';

// Extract username from URL if it contains github-{username}
if (param_data && param_data.startsWith('github-')) {
    const username = param_data.replace('github-', '');
    text = `Github: @${username}`;
}

function load_stl(csv) {
  fetch(URL + csv + "&uuid=" + getCookie("uuid") + "&text=" + text)
    .then(function (u) {
      return u.json();
    })
    .then(function (json) {
      console.log(json);
      //loadit(json);
      stlLink = json;
      document.getElementById("download-stl-link").href = stlLink;
      STLViewer(json, "model"); // calling and passing json to another function processPriceInfo
    });
}
//var data = prompt("enter some data")
console.log(location.search);
const params = new URLSearchParams(location.search);
var param_data = params.get("data");
console.log("fdfd:" + param_data);
if (param_data != null) {
  load_stl(param_data);
} else {
  var data = getCookie("data");
  data = sessionStorage.getItem("data");

  console.log(data);
  load_stl(data);
}

//load_stl([2,3,1,3,4,2,5,2,3,.5,2])

window.onload = function () {
  //STLViewer("https://3ddata.nikhilrado.repl.co/ex-scripts/will-ronan.stl", "model")
};
