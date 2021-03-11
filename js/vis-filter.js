var showLonelies = true;

var filter = {node:{}, edge:{}};


function initFilter()
{
  buildFilterTab('node');
  buildFilterTab('edge');

  showFilters('node');
  showFilters('edge');

  buildCluster();
}


function ApplyFilter()
{
  var nodeFilter = {};
  var edgeFilter = {};

  nodeFilter.values = [];
  nodeFilter.field = document.getElementById('nodeFilterField').value;
  
  selectedOptions = document.getElementById('nodeFilterValues').selectedOptions;
  for (var i = 0; i < selectedOptions.length; i++) nodeFilter.values.push(selectedOptions[i].value);
  

  edgeFilter.values = [];
  edgeFilter.field = document.getElementById('edgeFilterField').value;

  selectedOptions = document.getElementById('edgeFilterValues').selectedOptions;
  for (var i = 0; i < selectedOptions.length; i++) edgeFilter.values.push(selectedOptions[i].value);
  
  //setFilter(nodeFilter, edgeFilter);

  var filterShow = document.getElementById('filterShow').checked;

  if (nodeFilter.field.length == 0 || nodeFilter.values.length == 0) nodesView = new vis.DataView(tabnodes);
  else nodesView = new vis.DataView(tabnodes, {
      filter: (node) => { return (filterShow) ? nodeFilter.values.includes(node[nodeFilter.field]) :
                                                !nodeFilter.values.includes(node[nodeFilter.field]) } });
  
  if (edgeFilter.field.length == 0 || edgeFilter.values.length == 0) edgesView = new vis.DataView(tabedges);
  else edgesView = new vis.DataView(tabedges, {
      filter: (edge) => { return (filterShow) ? edgeFilter.values.includes(edge[edgeFilter.field]) :
                                                !edgeFilter.values.includes(edge[edgeFilter.field]) } });
  
  draw({nodes:nodesView,edges:edgesView}, options);
}


function showNodesById()
{
  var tabId = document.getElementById('idNodes').value.split(',');
  var contacts = [];

  tabtmp = tabedges.get();

  for (var i = 0; i < tabtmp.length; i++) {
    if (tabId.includes(tabtmp[i].from)) contacts.push(tabtmp[i].to);
    if (tabId.includes(tabtmp[i].to)) contacts.push(tabtmp[i].from);
  }

  contacts = contacts.concat(tabId);

  nodesView = new vis.DataView(tabnodes, { filter: (node) => { return contacts.includes(node.id) } });
  edgesView = new vis.DataView(tabedges, { filter: (edge) => { return contacts.includes(edge.from) || contacts.includes(edge.to) } });

  draw({nodes:nodesView,edges:edgesView}, options);
}



function toggleLonelyNodes()
{
  if (!showLonelies)
  {
    redraw();
    showLonelies = true;
  }
  else
  {
    nodesView = new vis.DataView(tabnodes, {
      filter: function(node) {
        connEdges = edgesView.get({
          filter: function(edge) {
            return(
                (edge.to == node.id) || (edge.from == node.id));
          }});
        return connEdges.length > 0;
      }
    });

    draw({nodes:nodesView,edges:edgesView}, options);
    showLonelies = false;
  }
}



function selectFilter(type)
{
  var attr = document.getElementById(type + 'FilterField').value;
  var divValues = document.getElementById(type + 'FilterValues');
  divValues.innerHTML = '';

  var tab = filter[type][attr];

  for (var i = 0; i < tab.length; i++)
  {
    divValues.innerHTML += "<option value='"+ tab[i] +"'>"+ tab[i] +"</option>";
  }
}


function showFilters(type)
{
  var divField = document.getElementById(type + 'FilterField');
  divField.innerHTML = '<option>Choisir un filtre</option>';

  for (var key in filter[type])
  {
    divField.innerHTML += "<option value='"+ key +"'>"+ key +"</option>";
  }
}


function buildFilterTab(type)
{
  var tab = (type == 'node') ? tabnodes.get() : tabedges.get();
  filter[type] = [];

  for (var i = 0; i < tab.length; i++)
  {
    for (var key in tab[i])
    {
      if (key == "length") continue;
      if (!(key in filter[type])) filter[type][key] = [];
      if (!filter[type][key].includes(tab[i][key])) filter[type][key].push(tab[i][key]);
    }
  }
}


