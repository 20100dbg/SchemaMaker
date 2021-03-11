
function importJSON()
{
    txt = document.getElementById('import_json').value;
    eval(txt);

    nodesView = new vis.DataView(tabnodes);
    edgesView = new vis.DataView(tabedges);

    draw({nodes:nodesView,edges:edgesView}, options, true);
}


function exportJSON()
{
  var txt = 'tabnodes = new vis.DataSet([\n';

  tab = tabnodes.get();
  for (var i = 0; i < tab.length; i++)
  {
    txt += '{';
    for (var key in tab[i])
    {
      txt += "'"+ key +"': " + '"' + tab[i][key] + '",';
    }
    txt += '},\n';
  }

  txt += ']);\n\ntabedges = new vis.DataSet([\n';

  tab = tabedges.get();
  for (var i = 0; i < tab.length; i++)
  {
    txt += '{';
    for (var key in tab[i])
    {
      txt += "'"+ key +"': " + '"' + tab[i][key] + '",';
    }
    txt += '},\n';
  }
 
  txt += ']);';

  return txt;
}


function importDOT()
{
  txt = document.getElementById('import_dot').value;

  try {
    data = vis.parseDOTNetwork(txt);
    tabnodes = new vis.DataSet(data.nodes);
    tabedges = new vis.DataSet(data.edges);

    network.setData(data);
    
  }
  catch (err) {
    alert(err.toString());
  }

  initFilter();
  network.stabilize();
}