
function buildCluster()
{
  var divField = document.getElementById('clusterAttribut');
  divField.innerHTML = '<option>Choisir un attribut</option>';

  for (var key in filter['node'])
  {
    divField.innerHTML += "<option value='"+ key +"'>"+ key +"</option>";
  }
}

function selectCluster()
{
  var attr = document.getElementById('clusterAttribut').value
  var divValues = document.getElementById('clusterValues');
  divValues.innerHTML = '';

  var tab = filter['node'][attr];

  for (var i = 0; i < tab.length; i++)
  {
    divValues.innerHTML += "<option value='"+ tab[i] +"'>"+ tab[i] +"</option>";
  }
}


function ApplyCluster()
{
  attr = document.getElementById('clusterAttribut').value;  
  selectedOptions = document.getElementById('clusterValues').selectedOptions;
  for (var i = 0; i < selectedOptions.length; i++) clusterBy(attr, selectedOptions[i].value);
}

function clusterBy(field, value)
{
  var clusterOptionsByData = {
    joinCondition:function(node) {
      return node[field] == value;
    },
    clusterNodeProperties: {id:'cidCluster_' + value, label:'cluster ' + value, borderWidth:2, shape:'database'}
  };
  network.cluster(clusterOptionsByData);


  network.on("selectNode", function(params) {
    if (params.nodes.length == 1) {
        if (network.isCluster(params.nodes[0]) == true) {
            network.openCluster(params.nodes[0]);
            restaurerAffichage();
        }
    }
  });
}