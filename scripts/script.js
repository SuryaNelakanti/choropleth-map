  //   Adding maps
  var map2 = L.map('mapid2').setView([12.94969, 77.61497], 11)
  var map1 = L.map('mapid1').setView([12.94969, 77.61497], 11)
  var map = L.map('mapid').setView([12.94969, 77.61497], 11)
  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OyRHB1lZcUp9aUtaI4df',{tileSize: 512,zoomOffset: -1,minZoom: 1,attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",crossOrigin: true}).addTo(map2)
  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OyRHB1lZcUp9aUtaI4df',{tileSize: 512,zoomOffset: -1,minZoom: 1,attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",crossOrigin: true}).addTo(map1)
  L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OyRHB1lZcUp9aUtaI4df',{tileSize: 512,zoomOffset: -1,minZoom: 1,attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",crossOrigin: true}).addTo(map)
//variable declaration for use with leaflet
  var info = L.control()
  var info1 = L.control()
  var info2 = L.control()
  var legend = L.control({position: 'bottomright'})
  var legend1 = L.control({position: 'bottomright'})
  var legend2 = L.control({position: 'bottomright'})
  var geojson
  var geojson1
  var geojson2
  //  Fetching JSON data from Kyupid API
  let apiUrl = "https://kyupid-api.vercel.app/api"
  let areaApi = apiUrl + "/areas"
  let userApi = apiUrl + "/users"
  //  Fetching User Data from Kyupid API using fetch
  fetch(userApi)
  .then((response) => {
      return response.json()
      })
      .then((udata) => {
          userData(udata)
      })
      .catch((err) => {
          console.log("error has occured:  "+ err)
      })
  
  function userData(udata){
      const numberOfUsers = [0]
      const proUsers = [0]
      const maleUsers = [0]
      const femaleUsers = [0]
      let i = 0
      let ii = 1
      let j =0
      while(udata.users[ii]!=undefined){
          if(udata.users[i]['area_id']===udata.users[ii]['area_id']){
              numberOfUsers[j]+=1
              if(udata.users[i]['is_pro_user']){proUsers[j]+=1}
              if(udata.users[i]['gender']==='M'){maleUsers[j]+=1} else
              if(udata.users[i]['gender']==='F'){femaleUsers[j]+=1}
          }else{
              j = j+1
              numberOfUsers[j]=0
              proUsers[j]=0
              maleUsers[j]=0
              femaleUsers[j]=0
          }
      i=1+i
      ii=1+ii
      }
  j=0
  var cols = []
  let mavg = 0
  let favg = 0
  for(i=0;i<101;i++){
      cols[j]=i;
      j++
      mavg+=maleUsers[i]
      favg+=femaleUsers[i]
  };
  mfavg = mavg+' Males to '+ favg + ' Females, i.e., '+(mavg/favg).toFixed(2)
  document.getElementById("mfratio").innerHTML=(mfavg)
  j=0
  var rows = []
  for(i=202;i<304;i++){rows[j]=i;j++};
  var result = rows.reduce(function (result, field, index) {
      result[cols[index]] = [field,numberOfUsers[index],(proUsers[index]/numberOfUsers[index]),(maleUsers[index]/femaleUsers[index])];
      return result;
  }, {})
  collater(result)
  }
  //Collating certain data sets from user and area JSON into one 
  function collater(userDetails){
      let apiUrl = "https://kyupid-api.vercel.app/api"
      let areaApi = apiUrl + "/areas"
      
      fetch(areaApi)
      .then((response) => {
          return response.json()
      })
      .then((data) => {
          collaterAreaUser(data,userDetails)
      })
      .catch((err) => {
          console.log("error has occured:  "+ err)
      })
  }
  function collaterAreaUser(area,user){
      let areaCoordinate = []
      let j=0
      //Adding properties to new dataset
      for(let i=0;i<101;i++){
          areaCoordinate[i] = area.features[i]
          areaCoordinate[i].properties['Number of Users']=user[i][1]
          areaCoordinate[i].properties['Ratio of Paid vs Unpaid Users']=user[i][2]
          areaCoordinate[i].properties['Ratio of Male vs Female Users']=user[i][3]
      }   
      let avg =0
      let tt = 0
      for(j=0;j<101;j++){
          avg += areaCoordinate[j].properties['Ratio of Paid vs Unpaid Users']
          tt +=areaCoordinate[j].properties['Number of Users']
      }
      avg = avg/101
      avg = avg.toFixed(3)
      document.getElementById("propercentage").innerHTML=(avg*100 + '%')
      document.getElementById("ttusers").innerHTML=(tt + ' users in Bangalore')

      //Calling the function wherein map is rendered
      mapMaker(areaCoordinate)    
  }

  function mapMaker(area){
      geojson= L.geoJson(area,{
          style: style,
          onEachFeature: onEachFeature
      }).addTo(map);

      geojson1= L.geoJson(area,{
          style: style1,
          onEachFeature: onEachFeature1
      }).addTo(map1);

      geojson2 = L.geoJson(area,{
          style: style2,
          onEachFeature: onEachFeature2
      }).addTo(map2);
  }
  
  function style(feature) {
      return {
          fillColor: getColor((feature.properties['Ratio of Paid vs Unpaid Users'])*100),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
  }
  function style1(feature) {
      return {
          fillColor: getColor1((feature.properties['Ratio of Male vs Female Users'])),
          weight: 2,
          opacity: 1,
          color: 'violet',
          dashArray: '5',
          fillOpacity: 0.9
      };
  }
  function style2(feature) {
      return {
          fillColor: getColor2((feature.properties['Number of Users'])),
          weight: 2,
          opacity: 1,
          color: 'red',
          fillOpacity: 0.7
      };
  }
  function getColor(d){
          return (d)> 52 ? '#800026' :
          d > 50  ? '#BD0026' :
          d> 48  ? '#E31A1C' :
          d> 46  ? '#FC4E2A' :
          d> 45   ? '#FD8D3C' :
          d> 42   ? '#FEB24C' :
          d> 40   ? '#FED976' :
          '#FFEDA0';
      }
  function getColor1(d){
      return (d)>  10 ? '#000':
      d>4   ? '#67000d' :
      d> 1.4 ? '#a50f15':
      d> 1.2   ? '#cb181d' :
      d> 1  ? '#ef3b2c' :
      d> 0.8 ? '#fb6a4a' :
      d> 0.6 ? '#fc9272' :
      d > 0.4  ? '#fcbba1' :
      d > 0.2  ? '#fee0d2' :
      d> 0.1 ? '#fff5f0' :
      '#FFF';
  }
  function getColor2(d){
      return (d)>  300 ? '#08306b':
      d> 270? '#08519c' :
      d> 240 ? '#2171b5':
      d> 210   ? '#4292c6' :
      d> 180  ? '#6baed6' :
      d> 150 ? '#9ecae1' :
      d> 120 ? '#c6dbef' :
      d > 90  ? '#deebf7' :
      d > 60 ? '#f7fbff' :
      d> 30 ? '#fff5f0' :
      '#FFF';
  }

  function onEachFeature(feature, layer) {
      layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
      });
  }
  function onEachFeature1(feature, layer1){
      layer1.on({
          mouseover: highlightFeature1,
          mouseout: resetHighlight1,
          click: zoomToFeature
      });
  }
  function onEachFeature2(feature,layer2){
      layer2.on({
          mouseover: highlightFeature2,
          mouseout: resetHighlight2,
          click: zoomToFeature
      })
  }
  function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
      }
      info.update(layer.feature.properties);
  }
  function highlightFeature1(e) {
      var layer1 = e.target;
      layer1.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.8
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer1.bringToFront();
      }
      info1.update(layer1.feature.properties);
  }
  function highlightFeature2(e) {
      var layer2 = e.target;
      layer2.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.8
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer2.bringToFront();
      }
      info2.update(layer2.feature.properties);
  }

  function resetHighlight(e) {
      geojson.resetStyle(e.target);
      info.update();
  }
  function resetHighlight1(e) {
      geojson1.resetStyle(e.target);
      info1.update();
  }
  function resetHighlight2(e) {
      geojson2.resetStyle(e.target);
      info2.update();
  }
  
  function zoomToFeature(e) {
      map1.fitBounds(e.target.getBounds());
  }

  
  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };
  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
      this._div.innerHTML = '<h4>Percentage of Pro users per Area</h4>' +  (props ?
      '<b>' + props.name.toUpperCase() + '</b><br />' + 100*(props['Ratio of Paid vs Unpaid Users'].toFixed(2))+'%'
          : 'Hover over area');
      };
      legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend'),
          grades = [40, 42, 44, 46, 48, 50, 52, 54],
          labels = []
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
              '<i style="background:' + getColor(grades[i]) + '">&nbsp;&nbsp;</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
          return div;
      };
      info.addTo(map);    
      legend.addTo(map);

  info1.onAdd= function (map1) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };    
  // method that we will use to update the control based on feature properties passed
  info1.update = function (props) {
      this._div.innerHTML = '<h4>Ratio of Male users to Female Users</h4>' +  (props ?
      '<b>' + props.name.toUpperCase() + '</b><br />' + (props['Ratio of Male vs Female Users'].toFixed(2)) + ' males to every 1 female'
      : 'Hover over area');
  };
  legend1.onAdd = function (map1) {
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 4],
      labels = []
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          '<i style="background:' + getColor1(grades[i]) + '">&nbsp;&nbsp;</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };
      info1.addTo(map1)
      legend1.addTo(map1)
      
  info2.onAdd= function (map2) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };    
  // method that we will use to update the control based on feature properties passed
  info2.update = function (props) {
      this._div.innerHTML = '<h4>Users per area</h4>' +  (props ?
      '<b>' + props.name.toUpperCase() + '</b><br />' + (props['Number of Users']) +' Users'
      : 'Hover over area');
  };
  legend2.onAdd = function (map2) {
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
      labels = []
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
          '<i style="background:' + getColor2(grades[i]) + '">&nbsp;&nbsp;</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
  };
      info2.addTo(map2)
      legend2.addTo(map2)
          
