
var width = 1400; /*window.innerWidth,*/
    height = 700,
    radius = (Math.min(width, height) / 2) - 40;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 150, h: 70, s: 3, t: 10
  };

  // Mapping of step names to colors.
var colors =d3.scaleOrdinal(d3.schemeCategory10);
/*{
    'All Industries' : 'dimgrey',
    'Accommodation and Food Services' : '#e377c2',
    'Administrative and Support and Waste Management and Remediation Services' : '#9467bd',
    'Agriculture, Forestry, Fishing and Hunting' : '#2ca02c',
    'Arts, Entertainment, and Recreation' : '#e377c2',
    'Construction' : '#d62728',
    'Educational Services' : '#ff7f0e',
    'Finance and Insurance' : '#8c564b',
    'Health Care and Social Assistance' : '#d62728',
    'Information' : '#9467bd',
    'Management of Companies and Enterprises' : '#1f77b4',
    'Manufacturing' : '#7f7f7f',
    'Mining, Quarrying, and Oil and Gas Extraction' : '#2ca02c',
    'Other Services (except Public Administration)' : '#7f7f7f',
    'Professional, Scientific, and Technical Services' : '#1f77b4',
    'Public Administration' : '#ff7f0e',
    'Real Estate and Rental and Leasing' : '#8c564b',
    'Retail Trade' : '#2ca02c',
    'Transportation and Warehousing' : '#17becf',
    'Utilities' : '#17becf',
    'Wholesale Trade' : '#2ca02c',     
};*/

var formatNumber = d3.format(",d");
var formatPercent = d3.format(".1%");

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 



var svg = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



svg.append("g")
	.attr("class", "labels");
svg.append("g")
    .attr("class", "lines");
    


var hue = d3.scaleOrdinal(d3.schemeCategory10);
console.log(hue);

/*var maxShare = d3.max(groupShares);*/
var color = d3.scaleLinear()
    /*.domain([0,1])*/
.range(['white', 'green']);

var brightness = d3.scaleLinear()
/*.domain([0,1])*/
.range([1.5, 0]);

var partition = d3.partition()
    /*.size([2 * Math.PI, radius * radius])*/
    //.value(function(d) { return (d.EMP);});

    var x = d3.scaleLinear()
    .range([0, (2*Math.PI)]);

    var y = d3.scaleLinear()
    .range([120, radius]);

    var arc = d3.arc()
    .startAngle(function(d) { return (Math.max(0, Math.min(2 * Math.PI, x(d.x0))) + Math.PI/2); })
    .endAngle(function(d) { return (Math.max(0, Math.min(2 * Math.PI, x(d.x1))) + Math.PI/2); })
    .innerRadius(function(d) { return Math.max(120, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(120, y(d.y1)); });

    var outerArc = d3.arc()
    .startAngle(function(d) { return (Math.max(0, Math.min(2 * Math.PI, x(d.x0))) + Math.PI/2); })
    .endAngle(function(d) { return (Math.max(0, Math.min(2 * Math.PI, x(d.x1))) + Math.PI/2); })
    .innerRadius(function(d) { return radius * 1.05; })
    .outerRadius(function(d) { return radius * 1.05; });

    var share = (function(d) { 
            return (d.parent ? formatPercent(d.data.EMP/d.parent.data.EMP):formatPercent(d.data.EMP/d.data.EMP));
        });
    
    d3.csv("areaMeta.csv", function(error, menuData) {
      var select = d3.select("#counties");
  
      select
        .on('change', function(d){
            x = d3.scaleLinear()
            .range([0, (2*Math.PI)]);
        
            y = d3.scaleLinear()
            .range([120, radius]);
            svg.select(".labels").selectAll("text").remove();
        var slct = document.getElementById("counties");
        var selected = slct.options[slct.selectedIndex].value;
        var areanameselected = slct.options[slct.selectedIndex].text;
        var yrslct = document.getElementById("years");
        var yrselected = yrslct.options[yrslct.selectedIndex].value;
        var yrName = yrslct.options[yrslct.selectedIndex].text;
        var qtrslct = document.getElementById("quarters");
        var qtrselected = qtrslct.options[qtrslct.selectedIndex].value;
        var qtrName = qtrslct.options[qtrslct.selectedIndex].text;
        var qtrlevel = 0;
        var level = 0;
        console.log(yrselected);
        console.log(qtrselected);
        console.log(selected);
        console.log(areanameselected);
        updateData(yrselected, qtrselected, selected, level, areanameselected);
        });
  
      select.selectAll("option")
        .data(menuData)
        .enter()
          .append("option")
          .attr("value", function (d) { return d.area_fips; })
          .text(function (d) { return d.area_title; });

    d3.select("#counties>option")
        .attr("selected", "selected");

        var slct = document.getElementById("counties");
        var selected = slct.options[slct.selectedIndex].value;
        
        //select.value('0');

    });

    d3.csv("yearMeta.csv", function(error, yearData) {
        var yrselect = d3.select("#years");
    
        yrselect
          .on('change', function(d){
              x = d3.scaleLinear()
              .range([0, (2*Math.PI)]);
          
              y = d3.scaleLinear()
              .range([120, radius]);
              svg.select(".labels").selectAll("text").remove();
              var slct = document.getElementById("counties");
              var selected = slct.options[slct.selectedIndex].value;
              var areanameselected = slct.options[slct.selectedIndex].text;
          var yrslct = document.getElementById("years");
          var yrselected = yrslct.options[yrslct.selectedIndex].value;
          var yrName = yrslct.options[yrslct.selectedIndex].text;
          var yrlevel = 0;
          var qtrslct = document.getElementById("quarters");
          var qtrselected = qtrslct.options[qtrslct.selectedIndex].value;
          var qtrName = qtrslct.options[qtrslct.selectedIndex].text;
          var qtrlevel = 0;
          console.log(yrselected);
          console.log(qtrselected);
          console.log(selected);
          console.log(areanameselected);
          updateData(yrselected, qtrselected, selected, level, areanameselected);
          });
    
        yrselect.selectAll("option")
          .data(yearData)
          .enter()
            .append("option")
            .attr("value", function (d) { return d.Year; })
            .text(function (d) { return d.Year; });
  
      d3.select("#years>option")
          .attr("selected", "selected");
  
          var yrslct = document.getElementById("years");
          var yrselected = yrslct.options[yrslct.selectedIndex].value;
          
          //select.value('0');
  
      });
      d3.csv("qtrMeta.csv", function(error, qtrData) {
        var qtrselect = d3.select("#quarters");
    
        qtrselect
          .on('change', function(d){
              x = d3.scaleLinear()
              .range([0, (2*Math.PI)]);
          
              y = d3.scaleLinear()
              .range([120, radius]);
              svg.select(".labels").selectAll("text").remove();
              var slct = document.getElementById("counties");
              var selected = slct.options[slct.selectedIndex].value;
              var areanameselected = slct.options[slct.selectedIndex].text;
              var yrslct = document.getElementById("years");
              var yrselected = yrslct.options[yrslct.selectedIndex].value;
              var yrName = yrslct.options[yrslct.selectedIndex].text;
          var qtrslct = document.getElementById("quarters");
          var qtrselected = qtrslct.options[qtrslct.selectedIndex].value;
          var qtrName = qtrslct.options[qtrslct.selectedIndex].text;
          var qtrlevel = 0;
          console.log(yrselected);
          console.log(qtrselected);
          console.log(selected);
          console.log(areanameselected);
          updateData(yrselected, qtrselected, selected, level, areanameselected);
          });
    
        qtrselect.selectAll("option")
          .data(qtrData)
          .enter()
            .append("option")
            .attr("value", function (d) { return d.Qtr; })
            .text(function (d) { return d.Qtr; });
  
      d3.select("#quarters>option")
          .attr("selected", "selected");
  
          var qtrslct = document.getElementById("quarters");
          var qtrselected = qtrslct.options[qtrslct.selectedIndex].value;
          
          //select.value('0');
  
      });

    var opts = {
        lines: 13, // The number of lines to draw
        length: 14, // The length of each line
        width: 8, // The line thickness
        radius: 20, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        //top: 'auto', // Top position relative to parent in px
        //left: 'auto' // Left position relative to parent in px
      };

    var target = document.getElementById("bigcontainer");
    var spinner = new Spinner(opts);//.spin(target);

    function startSpinner() {
        document.getElementById("main").style.visibility = 'hidden';
        //document.body.appendChild(div);
        spinner.spin(target);
    };

    function stopSpinner() {
        
        document.getElementById("main").style.visibility = 'visible';
        //var spinner ;//= document.getElementsByClassName("spinner");
        spinner.stop();
    };

    var timeoutID;
    
    function startTimeout() {
      timeoutID = window.setTimeout(sendAlert, 100000);
    }
    
    function sendAlert() {
        stopSpinner();
      alert('Sorry.  Data not available.\nPlease choose a different area.');
    }
    
    function stopTimeout() {
      window.clearTimeout(timeoutID);
    }


    var level = 0;

    var year = "2019";
    var yrselected = "2019";
    var qtr= "1";
    var qtrselected= "1";
    var area = "US000";
    var selected = "US000";
    var areaName = "U.S. Total"
    var areanameselected = "U.S. Total"

    updateData(year, qtr, area, level, areaName);

function updateData(year, qtr, area, level, areaName){
    startTimeout();
    var message = "Unfortunately, data for this area are currently unavailable.";


   

    startSpinner();
    
    var url = "csvdata.php?year=" + year + "&qtr=" + qtr + "&area=" + area;
    d3.csv(url, function(error, QCEWdata) {
        console.log(QCEWdata);
        d3.csv("aggID.csv", function(error, aggID){
            d3.csv("areaMeta.csv", function(error, areaMeta){
        //console.log(aggID);

            var joinedData = join(aggID, QCEWdata, "bls_code", "industry_code", function(QCEWdata, aggID) {
                return {
                    AREA_CODE: QCEWdata.area_fips,
                    EMP: +QCEWdata.month3_emplvl,
                    value: +QCEWdata.month3_emplvl,
                    OWN_CODE: QCEWdata.own_code,
                    DISCLOSURE: QCEWdata.disclosure_code,
                    IND_ID: (aggID !== undefined) ? aggID.nest_id: "",
                    IND_CODE: (aggID !== undefined) ? aggID.bls_code : "",
                    IND_DESCR: (aggID !== undefined) ? aggID.ind_descr : "",
                    T: (aggID !== undefined) ? aggID.T : "",
                    T_DESCR: (aggID !== undefined) ? aggID.T_descr : "",
                    D: (aggID !== undefined) ? aggID.D : "",
                    D_DESCR: (aggID !== undefined) ? aggID.D_descr : "",
                    SS: (aggID !== undefined) ? aggID.SS : "",
                    SS_DESCR: (aggID !== undefined) ? aggID.SS_descr : "",
                    S: (aggID !== undefined) ? aggID.S : "",
                    S_DESCR: (aggID !== undefined) ? aggID.S_descr : "",
                    N3D: (aggID !== undefined) ? aggID.N3D : "",
                    N3D_DESCR: (aggID !== undefined) ? aggID.N3D_descr : "",
                    N4D: (aggID !== undefined) ? aggID.N4D : "",
                    N4D_DESCR: (aggID !== undefined) ? aggID.N4D_descr : "",
                    N5D: (aggID !== undefined) ? aggID.N5D : "",
                    N5D_DESCR: (aggID !== undefined) ? aggID.N5D_descr : "",
                    N6D: (aggID !== undefined) ? aggID.N6D : "",
                    N6D_DESCR: (aggID !== undefined) ? aggID.N6D_descr : "",
                    PARENT: (aggID !== undefined) ? aggID.parent : "",
                    PARENT_DESCR: (aggID !== undefined) ? aggID.parent_descr : ""
                    //COLOR_GROUP: (aggID !== undefined) ? aggID.COLOR_GROUP : ""
                    //N6D: (aggID !== undefined) ? aggID.nest_id.substring(0,10) : "",*/
                };
            });

            var joinedData2 = join(areaMeta, joinedData, "area_fips", "AREA_CODE", function(joinedData, areaMeta) {
                return {
                    AREA_CODE: joinedData.AREA_CODE,
                    AREA: (areaMeta !== undefined) ? areaMeta.area_title : "",
                    EMP: +joinedData.EMP,
                    value: +joinedData.EMP,
                    OWN_CODE: joinedData.OWN_CODE,
                    DISCLOSURE: joinedData.DISCLOSURE,
                    IND_ID: joinedData.IND_ID,
                    IND_CODE: joinedData.IND_CODE,
                    IND_DESCR: joinedData.IND_DESCR,
                    T: joinedData.T,
                    T_DESCR: joinedData.T_DESCR,
                    D: joinedData.D,
                    D_DESCR: joinedData.D_DESCR,
                    SS: joinedData.SS,
                    SS_DESCR: joinedData.SS_DESCR,
                    S: joinedData.S,
                    S_DESCR: joinedData.S_DESCR,
                    N3D: joinedData.N3D,
                    N3D_DESCR: joinedData.N3D_DESCR,
                    N4D: joinedData.N4D,
                    N4D_DESCR: joinedData.N4D_DESCR,
                    N5D: joinedData.N5D,
                    N5D_DESCR: joinedData.N5D_DESCR,
                    N6D: joinedData.N6D,
                    N6D_DESCR: joinedData.N6D_DESCR,
                    PARENT: joinedData.PARENT,
                    PARENT_DESCR: joinedData.PARENT_DESCR
                    //COLOR_GROUP: joinedData.COLOR_GROUP
                };
            });

            var joinedData3 = joinedData2.filter(function(d){
                return d.OWN_CODE !== "0" && d.OWN_CODE !== "8" && d.OWN_CODE !== "9"  ;
            })

console.log(joinedData2);

            /*function genJSON(filteredData, groups, area) {
    
                var genGroups = function(filteredData) {
                    return _.map(filteredData, function(element, index) {
                    return { name : index, children : element};
                    });
                };
    
                var nest = function(node, curIndex) {
                    if (curIndex === 0) {  
    
                   node.name = area;
                    node.children = genGroups(_.groupBy(filteredData, groups[0]));
                    _.each(node.children, function (child) {                 
                        nest(child, curIndex + 1);
                    });
                    }
                    else {
                    if (curIndex < groups.length) {
                        node.children = genGroups(
                        _.groupBy(node.children, groups[curIndex])
                        );
                        _.each(node.children, function (child) {
                        nest(child, curIndex + 1);
    
                        });
                        
                    }
                    }
                    node.AREA = area;
                    node.COLOR_GROUP = (node.children) ? node.children['0'].COLOR_GROUP : node.COLOR_GROUP;
                    node.D = (node.children) ? node.children['0'].D : node.D;
                    node.SS = (node.children) ? node.children['0'].SS : node.SS;
                    node.S = (node.children) ? node.children['0'].S : node.S;
                    node.N3D = (node.children) ? node.children['0'].N3D : node.N3D;
                    node.N4D = (node.children) ? node.children['0'].N4D : node.N4D;
                    node.N5D = (node.children) ? node.children['0'].N5D : node.N5D;
                    return node;
                };
                return nest({}, 0);
            }
console.log(joinedData3);*/

            //var jsonData2 = genJSON(joinedData3, [/*'T_DESCR',*/ 'D_DESCR', 'SS_DESCR', 'S_DESCR', 'N3D_DESCR', 'N4D_DESCR', 'N5D_DESCR'], joinedData3[0].AREA);
            //var preppedData2 = partition.nodes(jsonData2);
            //console.log(preppedData2);

            function errorMessage(){
                document.getElementById("message").innerHTML = message;
                exit;
            }

           var nested_data = d3.nest()

            .key(function(d) { return d.IND_CODE; })
            .rollup(function(d) { 
               return {
                   IND_CODE: d[0].IND_CODE,
                   AREA_CODE: d[0].AREA_CODE,
                   AREA: d[0].AREA,
                   EMP: d3.sum(d, function(g) {return g.EMP; }),
                   value: d3.sum(d, function(e) {return e.value; }),
                   //OWN_CODE: d[0].OWN_CODE,
                   DISCLOSURE: (d3.sum(d, function(g) {return g.EMP; }) > 0 ) ? "" : "N",
                   IND_ID: d[0].IND_ID,
                   IND_DESCR: d[0].IND_DESCR,
                   PARENT: d[0].PARENT,
                   PARENT_DESCR: d[0].PARENT_DESCR,
                   T: d[0].T,
                   T_DESCR: d[0].T_DESCR,
                   D: d[0].D,
                   D_DESCR: d[0].D_DESCR,
                   SS: d[0].SS,
                   SS_DESCR: d[0].SS_DESCR,
                   S: d[0].S,
                   S_DESCR: d[0].S_DESCR,
                   N3D: d[0].N3D,
                   N3D_DESCR: d[0].N3D_DESCR,
                   N4D: d[0].N4D,
                   N4D_DESCR: d[0].N4D_DESCR,
                   N5D: d[0].N5D,
                   N5D_DESCR: d[0].N5D_DESCR,
                   N6D: d[0].N6D,
                   N6D_DESCR: d[0].N6D_DESCR
               };
            /*.key(function(d) { return d.SS_DESCR; })
            .key(function(d) { return d.S_DESCR; })
            .key(function(d) { return d.N3D_DESCR; })
            .key(function(d) { return d.N4D_DESCR; })
            .key(function(d) { return d.N5D_DESCR; })*/
            //.key(function(d) { return d.N6D; })
        })
            .entries(joinedData3)

            ;
            console.log(nested_data);
            

            var jsonData = createJSON(nested_data);
            
            function createJSON(nestedData) {
            
              /*var happyData = yuckyData.map(function(d) {
                return {
                  name: d.IND_CODE,
                  ind_descr: d.IND_DESCR,
                  parent: d.PARENT,
                  parent_descr: d.PARENT_DESCR,
                  size: d.EMP
                };
              });*/
            //console.log(happyData);
              function getChildren(indcode) {
                return nestedData.filter(function(d) { return d.value.PARENT == indcode; })
                  .map(function(d) {
                      var parentEMP = getParentEMP(d.value.PARENT);
                      var sibsEMP = getSibsEMP(d.value.PARENT);
                      var sibCNT = getSibCNT(d.value.PARENT);
                      var childrenEMP = getChildrenEMP(d.value.IND_CODE);
                      var sibsChildrenEmp = getSibsChildrenEMP(d.value.PARENT);
                    return {
                      IND_CODE: d.value.IND_CODE,
                      AREA_CODE: d.value.AREA_CODE,
                      AREA: d.value.AREA,
                      EMP: d.value.EMP,
                      
                      //OWN_CODE: d.value.OWN_CODE,
                      DISCLOSURE: d.value.DISCLOSURE,
                      IND_ID: d.value.IND_ID,
                      IND_DESCR: d.value.IND_DESCR,
                      PARENT: d.value.PARENT,
                      PARENT_DESCR: d.value.PARENT_DESCR,
                      T: d.value.T,
                      T_DESCR: d.value.T_DESCR,
                      D: d.value.D,
                      D_DESCR: d.value.D_DESCR,
                      SS: d.value.SS,
                      SS_DESCR: d.value.SS_DESCR,
                      S: d.value.S,
                      S_DESCR: d.value.S_DESCR,
                      N3D: d.value.N3D,
                      N3D_DESCR: d.value.N3D_DESCR,
                      N4D: d.value.N4D,
                      N4D_DESCR: d.value.N4D_DESCR,
                      N5D: d.value.N5D,
                      N5D_DESCR: d.value.N5D_DESCR,
                      N6D: d.value.N6D,
                      N6D_DESCR: d.value.N6D_DESCR,
                      children: getChildren(d.value.IND_CODE),
                      //parent: getParent(d.value.PARENT),
                      PARENT_EMP: getParentEMP(d.value.PARENT),
                      SIBS_EMP: getSibsEMP(d.value.PARENT),
                      SIB_CNT: getSibCNT(d.value.PARENT), 
                      SIBS_CHILDREN_EMP: sibsChildrenEmp,
                      value: (d.value.DISCLOSURE === "N" && ((parentEMP-sibsEMP)/sibCNT) < childrenEMP) ? childrenEMP : (d.value.DISCLOSURE === "N" && ((parentEMP-sibsEMP)/sibCNT)> (parentEMP - sibsChildrenEmp)) ? (parentEMP - sibsChildrenEmp): (d.value.DISCLOSURE === "N") ? ((parentEMP-sibsEMP)/sibCNT) : (d.value.EMP < childrenEMP) ? childrenEMP : d.value.EMP
                    }
                  });
              }

              function getParent(parentcode) {
                return nestedData.filter(function(d) { return d.value.IND_CODE == parentcode; })}

                function getParentEMP(parentcode) {
                    var pe = nestedData.filter(function(d) { return d.value.IND_CODE == parentcode; }).map(function(d){return d.value.EMP;});
                    var se = getSibsEMP(parentcode);
                    return (pe > se) ? pe : se;
                }

              function getSibsEMP(parentcode) {
                    var sibs = nestedData.filter(function(d) { return d.value.PARENT == parentcode; }).map(function(d){return d.value.EMP});
                   // console.log(sibs);
                    var sibs_emp = d3.sum(sibs);
                   // console.log(sibs_emp);
                    return sibs_emp;
                }

                function getSibCNT(parentcode) {
                    var sibs = nestedData.filter(function(d) { return d.value.PARENT == parentcode && d.value.DISCLOSURE == "N"; });
                   // console.log(sibs);
                    var sibs_cnt = sibs.length;
                   // console.log(sibs_emp);
                    return sibs_cnt;
                }

                function getChildrenEMP(indcode) {
                   // console.log(d3.sum(nestedData.filter(function(d) { return d.value.PARENT == indcode; }).map(function(d){return d.value.EMP})));
                    return d3.sum(nestedData.filter(function(d) { return d.value.PARENT == indcode; }).map(function(d){return d.value.EMP}));
                }

                function getSibsChildrenEMP(parentcode) {
                    var sibs = nestedData.filter(function(d) { return d.value.PARENT == parentcode; }).map(function(d){return d.value.IND_CODE});
                   // console.log(sibs);
                   var sum = 0;
                   for (var i = 0, len = sibs.length; i < len; i++) {       
                        sum += getChildrenEMP(sibs[i]);
                  }
                    return sum;
                }
         
              return getChildren("root");
              //return happyData;
            }


        
            console.log(jsonData);
            //var finalData = partition.nodes(jsonData[0]);

            var hierarchyData = d3.hierarchy(jsonData[0]);
            console.log(hierarchyData);


    
            var finalData = partition(hierarchyData).descendants();
            console.log(finalData);
  
            /*finalData.map(function(d){
                return d.value = d.EMP;
                });*/
            

            //var nodesByName = {};
            
              // Create nodes for each unique source and target.
              //nested_data.forEach(function(d) {
                //var parent = d.PARENT = nodeByName(d.PARENT, /*d.IND_CODE,*/ d.IND_DESCR, d.EMP),
                  //  child = d.IND_CODE = nodeByName(d.IND_CODE, /*d.PARENT,*/ d.IND_DESCR, d.EMP);
                //if (parent.children) parent.children.push(child);
                //else parent.children = [child];
              //});
            
              // Extract the root node.
              //var root = nested_data[0].PARENT;
            
              //function nodeByName(name, ind, emp) {
                //return nodesByName[name] || (nodesByName[name] = {name: name, ind: ind, emp: emp});
              //}
            //});

            //console.log(nodesByName);



   /* d3.csv("6DigitEmployment_12_2016.csv", function(error, data) {
        _.each(data, function(element, index, list){
            element.EMP = +element.EMP;
        });
        console.log(data);
        
                        //*************************************************
                        // THE FUNCTION
                        //*************************************************
        function genJSON(filteredData, county, groups) {

            var genGroups = function(filteredData) {
                return _.map(filteredData, function(element, index) {
                return { name : index, children : element};
                });
            };

            var nest = function(node, curIndex) {
                if (curIndex === 0) {  

                node.name = county;
                node.children = genGroups(_.groupBy(filteredData, groups[0]));
                _.each(node.children, function (child) {                 
                    nest(child, curIndex + 1);
                });
                }
                else {
                if (curIndex < groups.length) {
                    node.children = genGroups(
                    _.groupBy(node.children, groups[curIndex])
                    );
                    _.each(node.children, function (child) {
                    nest(child, curIndex + 1);

                    });
                    
                }
                }
                node.COUNTY = county;
                node.S_NAME = (node.children ? node.children['0'].S_NAME : node.S_NAME);
                return node;
            };
            return nest({}, 0);
        }
                        //*************************************************
                        // CALL THE FUNCTION
                        //*************************************************
        function updateData(data, county, level){
            var filteredData = data.filter(function(d){ 
                return d.COUNTY == county 
            });
            console.log(filteredData);
            var jsonData = genJSON(filteredData, county, ['S_NAME', '3D_NAME', '4D_NAME', '5D_NAME']);
            var preppedData = partition.nodes(jsonData);
            console.log(preppedData);
            updateChart(preppedData, level);
        }*/

        updateChart(finalData, level);

        function updateChart(preppedData, level){
              // Basic setup of page elements.
                initializeBreadcrumbTrail();
                /*drawLegend();*/
                /*d3.select("#togglelegend").on("click", toggleLegend);*/

                  // Bounding circle underneath the sunburst, to make it easier to detect
                // when the mouse leaves the parent g.
                svg.append("svg:circle")
                .attr("r", radius)
                .style("opacity", 0);

            svg.selectAll("path").remove();
            var path = svg.selectAll("#inner")
                .data(preppedData)
                //console.log(preppedData);
                //console.log(path._enter._data_);
                .enter().append("svg:path")
                /*.attr("display", function(d) { return (d.depth == level || d.depth == (level + 1)) ? "initial" : "none" })*/
                /*.filter(function(d) {return d.depth == level || d.depth == (level + 1) })*/
                .attr("d", arc)
                //.attr("class", function(d){return (d.data.DISCLOSURE == "N") ? "N" : "D";})
                .style("fill", function (d) {return (d.data.DISCLOSURE == "N") ? "Gainsboro" : colors(d.data.D);})
                /*.attr("class", function(d, i){ return d.child[i].S_NAME})*/
                .attr("fill-rule", "evenodd")
                .attr("id", "inner");

            d3.selectAll("#inner")
                .each(function(d){
                    //if (d.depth == 0){d.S_NAME = "All Industries"};
                    d.share = ((d.parent && d.parent.data.EMP !== 0) ? d.data.EMP/d.parent.data.EMP : "");
                    d.countyTotal = path.datum().data.EMP;
                })
                .each(function(d){
                   d.maxShare = (d.parent ? d3.max(d.parent.children, function(d){
                       return d.share;
                   }) : 1);
                })
                .style("fill", function(d) {
                    return (d.data.DISCLOSURE == "N") ? "Gainsboro" : d3.rgb(d3.select(this).style("fill")).brighter(brightness.domain([0,d.maxShare])(d.share));
                  })
                ;


            //console.log(path.data.D);
                    /*.domain([0,d.maxShare])(d.share);*/
                
                /*.style("fill", function(d, i) { return color(d['S_NAME']); })*/
               // .style("opacity", 1);

            /*d3.selectAll("#inner")
*/

            /*var brackets = svg.selectAll("#brackets")
                  .data(preppedData.filter(function(d) {return d.depth == (level + 1) }));
            brackets.enter().append("svg:path")
            .attr("id", "brackets")
            .attr("d", outerArc);*/

            // Get total size of the tree = value of root node from partition.


            //totalSize = path.__data__.value;

            updateLabels(preppedData, level);

            d3.selectAll("path")
                .on("mouseover", mouseover)
                .on("click", click)
                .append("title")
                .text(function(d) { return d.data.IND_DESCR + "\nEmployment: " + ((d.data.DISCLOSURE == "N") ? "Data suppressed" : formatNumber(d.data.EMP)) + "\nShare of Total: " + ((d.data.DISCLOSURE == "N") ? "" : (d.data.EMP/d.countyTotal<0.001)?"< 0.1%":formatPercent(d.data.EMP/d.countyTotal)) + "\nShare of Sub-Group: " + ((d.data.DISCLOSURE == "N") ? "" : ((d.parent && d.parent.data.DISCLOSURE !== "N") ? ((d.data.EMP/d.parent.data.EMP<0.001)?"< 0.1%":formatPercent(d.data.EMP/d.parent.data.EMP)):"")); });

            /*var root = d3.select('path');*/



        
            /*text.transition().duration(750)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return outerArc.centroid(d)["0"] < 75 ? "end":"start";
                    };
                });
        
            text.exit()
                .remove();*/


              // Add the mouseleave handler to the bounding circle.
            d3.select("#container").on("mouseleave", mouseleave);
            
            var root = d3.select("path").data();
            console.log(root);

            var percentage = formatPercent(root["0"].data.EMP / root["0"].countyTotal);
            var percentageString = percentage;
            if (percentage < 0.001) {
                percentageString = "< 0.1%";
              }


            d3.select("#percentage")
            .html("<p>" + root["0"].data.IND_DESCR + "<br/>Employment: " + formatNumber(root["0"].data.EMP) + "<br/>Share of Total: " +  percentageString + "<br/>Share of Sub-Group: " + "" + "</p>");
            d3.select("#explanation").style("left",((width/2)-100) + "px");
        }
    


   // updateData(data, selected, level);

  /*  d3.select('#counties')
    .on('change', function(d){
        svg.select(".labels").selectAll("text").remove();
    var slct = document.getElementById("counties");
    var selected = slct.options[slct.selectedIndex].value;
    var level = 0;
    console.log(selected);
    updateData(year, qtr, area, level);
    });*/



    stopSpinner();
    stopTimeout();
    document.getElementById("area").innerHTML = "Industry Employment by Region: " + "&nbsp" + "&nbsp" +"&nbsp" +"&nbsp" +areaName;
})
})
})
};


//});

function updateLabels(selectedData, level){

    var text = svg.select(".labels").selectAll("text")
         .data(selectedData);

    

     text.enter()
         .append("text")
         .filter(function(d){
             return d.depth == level + 1;
         })
         .filter(function(d){
            var sa = Math.max(0, Math.min(2 * Math.PI, x(d.x0))) + Math.PI/2;
            var ea = Math.max(0, Math.min(2 * Math.PI, x(d.x1))) + Math.PI/2; 
             return (ea - sa) >= 4*Math.PI/180;
         })
         .attr("dy", ".35em")
         .text(function(d) {
            return d.data.IND_DESCR ;
        })
        .attr("class","label")
         .style("opacity", 0)
         .attr("transform", function(d){
             return "translate("+ outerArc.centroid(d) + ")";
         })
         .style("text-anchor", function(d){
             return outerArc.centroid(d)["0"] < 30 ? "end":"start";
         })
         /*.call(wrap, 200)*/
         .transition()
         .duration(750)
        .style("opacity", 1);
        
     }


function click(d) {
    var level = d.depth;
    var children = (d.children ? d.children:d);
    var path = svg.selectAll("path");

svg.select(".labels").selectAll("text").remove();

  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 130 : 120, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
        /*.filter(function(d) {return d.depth == level || d.depth == (level + 1) })*/
        /*.attr("d", arc)*/
        /*.attr("class", function(d, i){ return d.child[i].S_NAME})*/
        /*.style("fill", function(d, i) { return color(d['S_NAME']); })*/
      .attrTween("d", function(d) { return function() { return arc(d); }; })
      .on("end", function() {
        updateLabels(children, level);
      });

      var county = d.data.AREA;
      var percentage = ((d.data.DISCLOSURE == "N") ? "" : d.data.EMP/d.countyTotal);
      var percentageString = percentage;
      if (percentage < 0.001) {
        percentageString = "< 0.1%";
      }
      else percentageString = formatPercent(percentage);

    console.log(d.data.IND_DESCR);
      d3.select("#percentage")
          .html("<p>" + d.data.IND_DESCR + "<br/>Employment: " + ((d.data.DISCLOSURE == "N") ? "Data suppressed" : formatNumber(d.data.EMP)) + "<br/>Share of Total: " +  percentageString + "<br/>Share of Sub-Group: " + ((d.data.DISCLOSURE == "N") ? "" : ((d.parent && d.parent.data.DISCLOSURE !== "N") ? formatPercent(d.data.EMP/d.parent.data.EMP):"")) + "</p>");
      d3.select("#explanation").style("left",((width/2)-100) + "px");
    
 
      d3.selectAll("#inner")
        .style("fill",function(d){
            return (d.data.DISCLOSURE == "N") ? "Gainsboro" : (level == "0") ? colors(d.data.D) : (level == "1") ? colors(d.data.SS) : (level == "2") ? colors(d.data.S) : (level == "3") ? colors(d.data.N3D) : (level == "4") ? colors(d.data.N4D) : (level == "5") ? colors(d.data.N5D) : (level == "6") ? colors(d.data.N6D) : colors(d.data.D);
        })
        .style("fill", function(d) {
            return (d.data.DISCLOSURE == "N") ? "Gainsboro" : d3.rgb(d3.select(this).style("fill")).brighter(brightness.domain([0,d.maxShare])(d.share));
          })
          ;

       /* d3.select("#trail").selectAll("g").selectAll("polygon")
        .style("fill",function(d){
            return (level == "0") ? colors([d.D]) : (level == "1") ? colors([d.SS]) : (level == "2") ? colors([d.S]) : (level == "3") ? colors([d.N3D]) : (level == "4") ? colors([d.N4D]) : (level == "5") ? colors([d.N5D]) : (level == "6") ? colors([d.N6D]) : colors([d.D]);
        });*/

    /*path.on("click", click)
    .append("title")
    .text(function(d) { return (d.children ? d.name : d['6D_NAME']) + "\n" + formatNumber(d.value) + "\n" + (d.parent ? formatPercent(d.value/d.parent.value) : formatPercent(d.value/d.value)); })
;*/
}

  
  // Fade all but the current sequence, and show it in the breadcrumb trail.
  function mouseover(d) {
    console.log(d.data.PARENT_EMP);
    console.log(d.data.SIBS_CHILDREN_EMP);
      var element = d3.select(this);
     // console.log(element);
    var county = d.data.AREA;
      var percentage = ((d.data.DISCLOSURE == "N") ? "" : d.data.EMP/d.countyTotal);
      var percentageString = percentage;
      if (percentage < 0.001) {
        percentageString = "< 0.1%";
      }
      else percentageString = formatPercent(percentage);
    /*d3.select("#explanation")
        .style("visibility", "");*/
  
    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift();
    console.log(sequenceArray);
    updateBreadcrumbs(sequenceArray, percentageString, level, element);
  
    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 1);
  
    // Then highlight only those that are an ancestor of the current segment.
    svg.selectAll("path")
        .filter(function(node) {
                  return (sequenceArray.indexOf(node) >= 0);
                })
        .style("opacity", 0.5);
  }
  
  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {
  
    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");
  
    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);
  
    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
                d3.select(this).on("mouseover", mouseover);
              });
  
    /*d3.select("#explanation")
        .style("visibility", "hidden");*/
  }
  
  // Given a node in a partition layout, return an array of all of its ancestor
  // nodes, highest first, but excluding the root.
  function getAncestors(node) {
    var path = [];
    var current = node;
        while (current) {
        path.unshift(current);
        current = current.parent;
        }
    return path;
  }
  
  function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", b.h)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
      .attr("id", "endlabel")
      .style("fill", "#000");
    trail.append("svg:text")
      .attr("id", "endlabel2")
      .style("fill", "#000");
  }

  // Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
  }
  
  // Update the breadcrumb trail to show the current sequence and percentage.
  function updateBreadcrumbs(nodeArray, percentageString, level, element) {
    //console.log(nodeArray);
  
    // Data join; key function combines name and depth (= position in sequence).
    var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.data.IND_CODE + d.depth})
        ;
        //console.log(g);

            // Remove exiting nodes.
    trail.exit().remove();

    // Add breadcrumb and label for entering nodes.
    var entering = trail.enter().append("svg:g");
    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        //.style("fill",function(d){
        //    return (level == "0") ? colors([d.D]) : (level == "1") ? colors([d.SS]) : (level == "2") ? colors([d.S]) : (level == "3") ? colors([d.N3D]) : (level == "4") ? colors([d.N4D]) : (level == "5") ? colors([d.N5D]) : (level == "6") ? colors([d.N6D]) : colors([d.D]);
        //})
        .style("fill", function(d) { return element.style("fill"); })
        //.style("fill", function(d) {
          //      return d3.rgb(d3.select(this).style("fill")).brighter(brightness.domain([0,d.maxShare])(d.share));
            //  });
  
    entering.append("svg:text")
        .attr("x", (b.t+2))
        .attr("y", (b.t+2))
        .attr("dy", "0.15em")
        .attr("text-anchor", "start")

        .text(function(d) { return d.data.IND_DESCR })
        .call(wrap, (b.w - b.t));
  
    // Set position for entering and updating nodes.
    entering.merge(trail).attr("transform", function(d, i) {
        //console.log(i);
      return "translate(" + i * (b.w + b.s) + ", 0)";
    });
  

  
    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
    //.append('text')
        .attr("x", (nodeArray.length > 0) ? ((nodeArray.length * (b.w + b.s))+20) : -1000)
        .attr("y", 15)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text("Employment: " + formatNumber(element.datum().data.EMP))
        .style("font-size", "2.2em")
        .style("fill", "#666");
    d3.select("#trail").select("#endlabel2")
        .attr("x", (nodeArray.length > 0) ? ((nodeArray.length * (b.w + b.s))+20) : -1000)
        .attr("y", 15)
        .attr("dy", "1.35em")
        .attr("text-anchor", "start")
        .text("Share of Total: " + percentageString)
        .style("font-size", "2.2em")
        .style("fill", "#666")
        ;
  
    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");
  
  }
  
  /*function drawLegend() {
  
    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
      w: 150, h: 30, s: 3, r: 3
    };
  
    var legend = d3.select("#legend").append("svg:svg")
        .attr("width", li.w)
        .attr("height", d3.keys(colors).length * (li.h + li.s));
  
    var g = legend.selectAll("g")
        .data(d3.entries(colors))
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
                return "translate(0," + i * (li.h + li.s) + ")";
             });
  
    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return colors[d.key]; });
  
    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", 13)
        .attr("dy", "0.05em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.key; })
        .call(wrap,(li.w-10));
  }
  
  function toggleLegend() {
    var legend = d3.select("#legend");
    if (legend.style("visibility") == "hidden") {
      legend.style("visibility", "");
    } else {
      legend.style("visibility", "hidden");
    }
  }*/

  function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr('x'),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    })
}

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};



d3.select(self.frameElement).style("height", height + "px");