console.log("running create/script.js")
// returns the string of the cookie with the name cookieName
// from w3schools https://www.w3schools.com/js/js_cookies.asp
function getCookie(cookieName) {
  let name = cookieName + "=";
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

// returns a Stripe checkout link
function getCheckoutLink(shipping_countryf, obj_name) {
  var URL = "https://api.solidify.ortanatech.com/action/";
  fetch(URL, {
    headers: {
      Accept: "application/json",
      //'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      action: "checkout",
      uuid: getCookie("uuid"),
      price: parseFloat(jsonPriceInfoData.materials[62].basePrice),
      shipping_country: "US", // TODO: implement this
      prod_name: obj_name,
    }),
  }).then(function (response) {
    return response.text().then(function (text) {
      console.log(text);
      window.location.href = text; // redirect to Stripe checkout page
    });
  });
}

// called when pay button is clicked
function pay() {
  console.log("pay");
  //window.location.href = 
  getCheckoutLink(
    document.getElementById("shipping").value,
    document.getElementById("o-name").value
  );
}

// sets the 3d model viewbox then calls loadModel()
// (inserts the stl file "model" into the html element with id "elementID")
function prepareSTLViewer(model, elementID) {
  console.log("prepareSTLViewer")
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

  // controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.rotateSpeed = 0.5;
  controls.dampingFactor = 1.2;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.75;

  // lighting
  scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 1.5));
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(50, 50, 50);
  scene.add(light);
  const light2 = new THREE.PointLight(0xffffff, 1, 100);
  light2.position.set(-50, 50, 50);
  scene.add(light2);

  loadModel(model);
}

// loads the stl file "model" into the scene
function loadModel(model) {
  console.log("loadModel")
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
  });
}

// a hash function from https://stackoverflow.com/a/52171480
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function loadStl(csv) {
  console.log("loadSTL")
  const generateModelAPIURL = "https://api.solidify.ortanatech.com/3d/csv?csv=";

  // check if current data is same as last saved data,
  // if so skip api call and display cached model
  csv = csv.replace(/\s/g, ""); // remove whitespace
  csvHash = cyrb53(csv);
  if (csvHash == sessionStorage.getItem("csvHash")) {
    console.log("used cached model");
    stlLink = sessionStorage.getItem("stlLink");
    prepareSTLViewer(stlLink, "model");
    document.getElementById("download-stl-link").href = stlLink;
    return;
  }

  // fetch the stl link from the Solidify API
  fetch(generateModelAPIURL + csv + "&uuid=" + getCookie("uuid"))
    .then(function (u) {
      return u.json();
    })
    .then(function (stlLink) {
      console.log("created new model from Solidify API");
      document.getElementById("download-stl-link").href = stlLink;
      sessionStorage.setItem("stlLink", stlLink);
      sessionStorage.setItem("csvHash", csvHash);
      prepareSTLViewer(stlLink, "model"); // calling and passing json to another function processPriceInfo
    });
}

// runs when the page is loaded (all external scripts are loaded)
var jsonPriceInfoData; // global scope var
window.onload = function () {
  // when object name input is focused, fetch the price info
  // the Solidify API will upload model to Shapeways and get an estimate
  // this operation takes ~30 seconds so the other fields delay
  // when the pay button turns green it can be clicked to Stripe checkout page
  const objectNameInput = document.getElementById("o-name");
  objectNameInput.addEventListener("focus", (event) => {
    event.target.style.background = "#51b851"; // light green
    console.log("Solidify API price fetch initiated");

    const URL =
      "https://api.solidify.ortanatech.com/action?action=upload-model&uuid=";
    fetch(URL + getCookie("uuid"))
      .then((response) => response.json())
      .then(function (json) {
        document.getElementById("payBtn").style.backgroundColor = "lightgreen";
        jsonPriceInfoData = json; // save json data to global variable
        //console.log(jsonPriceInfoData);
      });
  });

  const params = new URLSearchParams(location.search);
  var dataFromUrlParam = params.get("data");

  // will load stl with query param "data" value or session storage data
  if (dataFromUrlParam != null) {
    loadStl(dataFromUrlParam);
  } else {
    loadStl(sessionStorage.getItem("data"));
  }
};

// test data
//STLViewer("https://3ddata.nikhilrado.repl.co/ex-scripts/will-ronan.stl", "model")
//load_stl([2,3,1,3,4,2,5,2,3,.5,2])
