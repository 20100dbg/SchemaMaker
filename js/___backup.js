var seededRandom = vis.util.Alea('SEED')


function getScaleFreeNetwork(nodeCount) {
  var nodes = [];
  var edges = [];
  var connectionCount = [];

  // randomly create some nodes and edges
  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: String(i)
    });

    connectionCount[i] = 0;

    // create edges in a scale-free-network way
    if (i == 1) {
      var from = i;
      var to = 0;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    }
    else if (i > 1) {
      var conn = edges.length * 2;
      var rand = Math.floor(seededRandom() * conn);
      var cum = 0;
      var j = 0;
      while (j < connectionCount.length && cum < rand) {
        cum += connectionCount[j];
        j++;
      }


      var from = i;
      var to = j;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    }
  }

  return {nodes:nodes, edges:edges};
}



function toJSON(obj) {
    return JSON.stringify(obj, null, 4);
}


function readRemoteFile(url)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.overrideMimeType("text/plain");
  var txt;

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
        txt = xhr.responseText;
  }
  xhr.send(null);

  return txt;
}



/*************** IMPORT / EXPORT *****************/

function getNodeData(data) {
    var networkNodes = [];

    data.forEach(function(elem, index, array) {
        networkNodes.push({id: elem.id, label: elem.id, x: elem.x, y: elem.y});
    });

    return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {  // double equals since id can be numeric or string
          return data[n];
        }
    };

    throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
    var networkEdges = [];

    data.forEach(function(node) {
        // add the connection
        node.connections.forEach(function(connId, cIndex, conns) {
            networkEdges.push({from: node.id, to: connId});
            let cNode = getNodeById(data, connId);

            var elementConnections = cNode.connections;

            // remove the connection from the other node to prevent duplicate connections
            var duplicateIndex = elementConnections.findIndex(function(connection) {
              return connection == node.id; // double equals since id can be numeric or string
            });


            if (duplicateIndex != -1) {
              elementConnections.splice(duplicateIndex, 1);
            };
      });
    });

    return new vis.DataSet(networkEdges);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
      obj[key].id = key;
      return obj[key];
    });
}


function addConnections(elem, index) {
    // need to replace this with a tree of the network, then get child direct children of the element
    elem.connections = network.getConnectedNodes(index);
}



function dropHandler(ev, elmt) {
  ev.preventDefault();

  if (ev.dataTransfer.items[0].kind === 'file')
  {
    var filename = ev.dataTransfer.items[0].getAsFile().name;
    var path = document.location.toString();
    idx = path.lastIndexOf('/');
    path = path.substring(0, idx + 1);

    txt = readFile(path + filename);
    
    elmt.value = txt;
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
}
