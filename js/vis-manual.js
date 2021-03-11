
var lastNodeId = 0;

function editNodes(action)
{
  nodeId = document.getElementById('node-id').value;
  nodeLabel = document.getElementById('node-label').value;
  nodeGroupe = document.getElementById('node-group').value;
  nodeShape = document.getElementById('node-shape').value;
  nodeImage = document.getElementById('node-image').value;
  nodeColor = document.getElementById('node-color').value;
  nodeFormat = $("input[name=node-format]:checked").val(); //document.getElementById('node-format').value;
  
  nodeId = (action == 'add') ? 'man-' + ++lastNodeId : nodeId;
  node = {id: nodeId, label: nodeLabel, group: nodeGroupe};
 
  if (nodeFormat == 'shape')
  {
    console.log("shape : " + nodeShape + " - " + nodeColor);
    node.shape = nodeShape;
    node.color = nodeColor;
  }
  else if (nodeFormat == 'image')
  {
    node.shape = 'circularImage';
    node.image = dossierImg + nodeImage;
  }
  else if (nodeFormat == 'groupe')
  {
    console.log("groupe");
    node.shape = undefined;
    node.color = undefined;
  }

  if (action == 'add') tabnodes.add(node);
  if (action == 'update') tabnodes.update(node);
  if (action == 'remove') tabnodes.remove(node);

  loadManualInterface();

  data = {nodes:tabnodes, edges:tabedges};
  draw(data, options);
}


var lastEdgeId = 0;

function editEdges(action)
{
  edgeId = document.getElementById('edge-id').value;
  edgeFrom = document.getElementById('edge-from').value;
  edgeTo = document.getElementById('edge-to').value;
  edgeColor = document.getElementById('edge-color').value;

  edgeId = (action == 'add') ? 'man-' + ++lastEdgeId : edgeId;
  edge = {id: edgeId, from: edgeFrom, to: edgeTo, color: edgeColor};

  if (action == 'add') tabedges.add(edge);
  if (action == 'update') tabedges.update(edge);
  if (action == 'remove') tabedges.remove(edge);

  loadManualInterface();

  data = {nodes:tabnodes, edges:tabedges};
  draw(data, options);
}


function loadManualInterface()
{
  var selectFrom = document.getElementById('edge-from');
  var selectTo = document.getElementById('edge-to');
  var selectEdge = document.getElementById('edge-id');
  var selectNode = document.getElementById('node-id');
  var selectGroup = document.getElementById('groupName');

  selectFrom.innerHTML = '';
  selectTo.innerHTML = '';
  selectEdge.innerHTML = '';
  selectNode.innerHTML = '';
  selectGroup.innerHTML = '';

  //refresh groupes ?

  var tabGroup = [];

  tab = tabnodes.get();
  for (var i = 0; i < tab.length; i++)
  {
    node = tab[i];
    if (!tabGroup.includes(node.group)) tabGroup.push(node.group);

    selectFrom.innerHTML += "<option value='"+ node.id +"'>"+ node.label +"</option>";
    selectTo.innerHTML += "<option value='"+ node.id +"'>"+ node.label +"</option>";
    selectNode.innerHTML += "<option value='"+ node.id +"'>"+ node.label +"</option>";
  }

  tab = tabedges.get();
  for (var i = 0; i < tab.length; i++)
  {
    edge = tab[i];
    selectEdge.innerHTML += "<option value='"+ edge.id +"'>"+ tabnodes.get(edge.from).label + 
                            " -> " + tabnodes.get(edge.to).label +"</option>";
  }

  for (var i = 0; i < tabGroup.length; i++)
  {
    selectGroup.innerHTML += "<option value='"+ tabGroup[i] +"'>"+ tabGroup[i] +"</option>";
  }

}