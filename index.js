function getSuperheroData(id) {
  // solo me funciono utilizando una extensión por un error con el CORS
  $.ajax({
    type: "GET",
    url: "https://superheroapi.com/api/2389097254575518/" + id,
    crossDomain: true,
    dataType: "json",
    success: function (data) {
      // Destructuring de variables
      const {
        image: { url: url },
        name,
        appearance: { gender, race, height, weight },
        biography: { publisher, aliases, ['first-appearance']: firstAppearance },
        connections: { relatives },
      } = data;
      // consultas particulares a la API y se pobla la lista
      $('#nombre').html(`<b>Nombre:</b> ${name}`);
      $('#img').attr("src", url);
      $('#genero').html(`<b>Género:</b> ${gender}`);
      $('#raza').html(`<b>Raza:</b> ${race}`);
      $('#altura_peso').html(`<b>Altura:</b>: ${height} <br><b>Peso:</b>: ${weight}`);
      $('#publica').html(`<b>Publica:</b> ${publisher}`);
      $('#primeraAparicion').html(`<b>Primera Aparición:</b> ${firstAppearance}`);
      $('#alianzas').html(`<b>Alianzas:</b> ${aliases}`);
      $('#conexiones').html(`<b>Conexiones:</b>: ${relatives}`);
      $('.card').removeClass('d-none');
      $('.main').addClass('d-none')
      const powerstats = data.powerstats;
      // Se llenan los datos del gráfico
      const dataPoints = Object.entries(powerstats).map(function (dataPoint) {
        return {
          y: dataPoint[1],
          label: dataPoint[0]
        }
      })
      renderChart(dataPoints, name)
      console.log(dataPoints)
    },
    error: function (error) {
      console.log('message Error' + JSON.stringify(error));
    }
  });
}

$("#btn1").click(function () {
  const valorInputString = $("input").val();
  const valorInput = Number(valorInputString);
  // Se pregunta si el número es entero y se encuentra entre los valores descritos en la documentación
  if (Number.isInteger(valorInput) && valorInput >= 1 && valorInput <= 731) {
    getSuperheroData(valorInput);
  } else {
    alert(`Debe ingresar un número que se encuentre entre 1 y 731`)
  }
});

const renderChart = (dataPoints, name) => {
  var chart = new CanvasJS.Chart("chartContainer", {
    theme: "dark2",
    exportFileName: "Doughnut Chart",
    exportEnabled: false,
    animationEnabled: true,
    title: {
      text: `Estadísticas de ${name}`
    },
    legend: {
      cursor: "pointer",
      itemclick: explodePie
    },
    data: [{
      type: "doughnut",
      innerRadius: 50,
      showInLegend: true,
      legendText: "{label}",
      indexLabel: "{label} - {y}",
      dataPoints: dataPoints
    }]
  });
  chart.render();

  function explodePie(e) {
    if (typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
  }
};