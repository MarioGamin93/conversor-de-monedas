//* llamadas a elementos del html
const selectMonedas = document.querySelector(".select__moneda");
const pesosInput = document.getElementById("pesos");
const resultado = document.getElementById("text");
const conversor = document.getElementById("form");

//* Función para hacer el calculo de la conversion de CLP a otras monedas
function convertir() {
  let conversor =
    pesosInput.value / parseFloat(selectMonedas.value.replace(",", "."));
  conversor = resultado.innerHTML = `Resultado: ${conversor.toFixed(2)}`;
  return;
}

//* evento para hacer la conversion de CLP a moneda extrangera y mostrar el gráfico de la moneda
conversor.addEventListener("submit", (e) => {
  e.preventDefault();
  convertir();
  renderGrafica();
  console.log("conversion hecha");
  let data = e.target.monedas;
  console.log(data);
});

//* Función para obtener la API de monedas
async function getMonedas() {
  try {
    const endpoint = "https://api.gael.cloud/general/public/monedas";
    const res = await fetch(endpoint);
    let monedas = await res.json();
    //* Bucle para imprimir en el select el valor y nombre de las monedas
    let html = "";
    for (let moneda of monedas) {
      if (
        moneda.Nombre == "Unidad de Fomento" ||
        moneda.Nombre == "Unidad Tributaria Mensual"
      )
        html += `
        <option value="${moneda.Valor}">${moneda.Nombre}</option>
        `;
      let hoy = new Date(); // fecha actual
      let ayer = new Date();

      moneda.historico = [];
      for (let i = 0.99; i >= 0.95; i = i - 0.01) {
        let restar = parseInt((1 - i) * 100);
        let restarmilisegundos = restar * 86400000;

        ayer.setTime(hoy.getTime() - restarmilisegundos);

        moneda.historico.push({
          fecha:
            ayer.getFullYear() +
            "-" +
            (ayer.getMonth() < 10 ? "0" + ayer.getMonth() : ayer.getMonth()) +
            "-" +
            (ayer.getDate() < 10 ? "0" + ayer.getDate() : ayer.getDate()),
          valor: (parseFloat(moneda.Valor.replace(",", ".")) * i).toFixed(2),
        });
      }
    }
    console.log(monedas);

    selectMonedas.innerHTML = html;
    return monedas;
  } catch (e) {
    alert(e.message);
  }
}

getMonedas();

//* Función para configurar el gráfico de monedas

function graficaDeMonedas(monedas) {
  //* Variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";

  const fechasDeLasMonedas = monedas.map((moneda) => {
    for (let historico of moneda.historico) {
      console.log(historico.fecha);
      return historico.fecha;
    }
  });

  const titulo = "Monedas";
  const colorDeLinea = "red";

  const valores = monedas.map((moneda) => {
    for (let historico of moneda.historico) {
      console.log(historico.valor);
      return historico.value;
    }
  });

  //* Creación del objeto de configuración usando las variables anteriores

  const config = {
    type: tipoDeGrafica,
    data: {
      labels: fechasDeLasMonedas,
      datasets: [
        {
          label: titulo,
          borderColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}

//* Función para renderizar el gráfico de monedas
async function renderGrafica() {
  const monedas = await getMonedas();

  const config = graficaDeMonedas(monedas);

  const chartDOM = document.getElementById("myChart");
  chartDOM.style.backgroundColor = "#eee";
  new Chart(chartDOM, config);
}
