window.onload = init;
var headers = {};
var url = "http://40.87.49.253:3001/pizzarteSales"
var ingredientsPizzas, staticPizzas, salesPizzas

var ingredientsCount = {};
var caloriasPorDia = {};
var promedioTotal;


function init() {
    var token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    } else {
        headers = {
            headers: {
                'Authorization': "bearer " + token,
            }
        }
        loadPrincipal();
    }
}

async function loadPrincipal() {
    ingredientsPizzas = await obtainIngredients();
    staticPizzas = await obtainPizzas();
    salesPizzas = await obtainSales();

    // Procesar los datos de ventas para convertir el timestamp a Date
    processSalesData(salesPizzas);

    // Aquí puedes realizar cualquier acción con los datos obtenidos
    console.log(ingredientsPizzas);
    console.log(staticPizzas);
    console.log(salesPizzas);
    getIngredientsCount(salesPizzas);
    const resultados = calcularCaloriasPorDiaYPromedio(salesPizzas);

    caloriasPorDia = resultados.caloriasPorDia;
    promedioTotal = resultados.promedioTotal;
    // Imprime las calorías por día y el promedio total
    console.log("Calorías por día:", caloriasPorDia);
    console.log("Promedio total de calorías:", promedioTotal);
}

async function obtainIngredients() {
    try {
        const response = await axios.get(url + "/ingredients", headers);
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo ingredientes:", error);
        return null;
    }
}

async function obtainPizzas() {
    try {
        const response = await axios.get(url + "/pizzas", headers);
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo pizzas:", error);
        return null;
    }
}

async function obtainSales() {
    try {
        const response = await axios.get(url + "/sales", headers);
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo ventas:", error);
        return null;
    }
}

function processSalesData(data) {
    if (!data) {
        console.warn("No sales data to process.");
        return;
    }
    data.forEach(venta => {
        if (venta.Fecha && venta.Fecha._seconds !== undefined && venta.Fecha._nanoseconds !== undefined) {
            const date = new Date(venta.Fecha._seconds * 1000 + venta.Fecha._nanoseconds / 1000000);
            venta.Fecha = date;
            console.log("Fecha de la venta:", date);
        } else {
            console.warn("Fecha no encontrada o formato incorrecto en venta:", venta);
        }
    });
}

function getIngredientsCount(salesPizzas){
    // Recorre cada venta en salesPizzas
    salesPizzas.forEach(venta => {
        // Recorre cada pizza vendida en la venta
        venta.Articulos.forEach(pizza => {
            // Recorre cada ingrediente de la pizza
            pizza.ingredientes.forEach(ingrediente => {
                // Verifica si el ingrediente ya está en el contador
                if (ingredientsCount.hasOwnProperty(ingrediente.nombre)) {
                    // Si ya está, suma la cantidad vendida al contador existente
                    ingredientsCount[ingrediente.nombre] += ingrediente.cantidad;
                } else {
                    // Si no está, inicializa el contador para ese ingrediente
                    ingredientsCount[ingrediente.nombre] = ingrediente.cantidad;
                }
            });
        });
    });
    // Imprime el contador de ingredientes
    console.log("Contador de ingredientes:", ingredientsCount);
}

function calcularCaloriasPorDiaYPromedio(salesPizzas) {
    var ventasPorDia = {};
    var caloriasPorDia = {};
    // Recorre cada venta en salesPizzas
    salesPizzas.forEach(venta => {
        // Obtiene la fecha de la venta (solo la fecha sin hora)
        var fecha = venta.Fecha.toISOString().split('T')[0];

        // Suma las calorías totales de todas las pizzas vendidas en esta venta
        var caloriasVenta = 0;
        venta.Articulos.forEach(pizza => {
            caloriasVenta += pizza.calorias;
        });

        // Actualiza las calorías por día y el número de ventas por día
        if (caloriasPorDia.hasOwnProperty(fecha)) {
            caloriasPorDia[fecha] += caloriasVenta;
            ventasPorDia[fecha]++;
        } else {
            caloriasPorDia[fecha] = caloriasVenta;
            ventasPorDia[fecha] = 1;
        }
    });

    // Calcula el promedio total de calorías de las ventas
    var totalCalorias = 0;
    var totalVentas = 0;
    for (var fecha in caloriasPorDia) {
        totalCalorias += caloriasPorDia[fecha];
        totalVentas += ventasPorDia[fecha];
    }
    var promedioTotal = totalCalorias / totalVentas;

    // Retorna un objeto con las calorías por día y el promedio total de calorías
    return {
        caloriasPorDia: caloriasPorDia,
        promedioTotal: promedioTotal
    };
}


// Datos de ejemplo
const ingredientes = [
    { nombre: 'Queso', cantidad: 120 },
    { nombre: 'Tomate', cantidad: 90 },
    { nombre: 'Pepperoni', cantidad: 80 },
    { nombre: 'Champiñones', cantidad: 70 },
    { nombre: 'Cebolla', cantidad: 60 },
    { nombre: 'Jamón', cantidad: 50 }
];

// Datos para el promedio de calorías por persona (ejemplo)
const caloriasPorDias = [
    { fecha: '2024-05-01', calorias: 5000 },
    { fecha: '2024-05-02', calorias: 4500 },
    { fecha: '2024-05-03', calorias: 4800 },
    { fecha: '2024-05-04', calorias: 4700 },
    { fecha: '2024-05-05', calorias: 5200 },
];

// Datos para los ingredientes más vendidos el próximo mes (ejemplo)
const prediccionIngredientes = [
    { nombre: 'Queso', cantidad: 150 },
    { nombre: 'Tomate', cantidad: 130 },
    { nombre: 'Pepperoni', cantidad: 110 },
    { nombre: 'Champiñones', cantidad: 90 },
    { nombre: 'Cebolla', cantidad: 80 }
];

// Datos para las pizzas más vendidas (ejemplo)
const pizzasMasVendidas = [
    { nombre: 'Margherita', cantidad: 200 },
    { nombre: 'Pepperoni', cantidad: 180 },
    { nombre: 'Hawaiana', cantidad: 150 },
    { nombre: 'Vegetariana', cantidad: 120 },
    { nombre: 'BBQ Chicken', cantidad: 100 }
];

// Función para crear una gráfica de ingredientes
function crearGraficaIngredientes() {
    const nombresIngredientes = ingredientes.map(ingrediente => ingrediente.nombre);
    const cantidadesIngredientes = ingredientes.map(ingrediente => ingrediente.cantidad);

    const ctx = document.getElementById('ingredientesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresIngredientes,
            datasets: [{
                label: 'Cantidad de uso',
                data: cantidadesIngredientes,
                backgroundColor: [
                    'rgba(255, 152, 0, 0.5)', // Naranja
                    'rgba(255, 235, 59, 0.5)', // Amarillo
                    'rgba(139, 195, 74, 0.5)', // Verde
                    'rgba(205, 220, 57, 0.5)', // Lima
                    'rgba(255, 87, 34, 0.5)', // Naranja Rojizo
                    'rgba(255, 193, 7, 0.5)' // Amarillo Ámbar
                ],
                borderColor: [
                    'rgba(255, 152, 0, 1)', // Naranja
                    'rgba(255, 235, 59, 1)', // Amarillo
                    'rgba(139, 195, 74, 1)', // Verde
                    'rgba(205, 220, 57, 1)', // Lima
                    'rgba(255, 87, 34, 1)', // Naranja Rojizo
                    'rgba(255, 193, 7, 1)' // Amarillo Ámbar
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para mostrar el promedio de calorías por persona
function mostrarCaloriasPromedio() {
    const totalCalorias = caloriasPorDias.reduce((sum, day) => sum + day.calorias, 0);
    const promedioCalorias = totalCalorias / caloriasPorDias.length;
    document.getElementById('caloriasPromedio').innerText = `El promedio de calorías consumidas por persona es de ${promedioCalorias.toFixed(2)} calorías.`;

    const fechas = caloriasPorDias.map(day => day.fecha);
    const calorias = caloriasPorDias.map(day => day.calorias);

    const ctx = document.getElementById('caloriasChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Calorías Totales',
                data: calorias,
                backgroundColor: 'rgba(255, 152, 0, 0.2)', // Naranja
                borderColor: 'rgba(255, 152, 0, 1)', // Naranja
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para mostrar los ingredientes más vendidos el próximo mes
function mostrarPrediccionIngredientes() {
    const nombresIngredientes = prediccionIngredientes.map(ingrediente => ingrediente.nombre);
    const cantidadesIngredientes = prediccionIngredientes.map(ingrediente => ingrediente.cantidad);

    const ctx = document.getElementById('ingredientesPrediccionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: nombresIngredientes,
            datasets: [{
                label: 'Cantidad',
                data: cantidadesIngredientes,
                backgroundColor: [
                    'rgba(255, 152, 0, 0.5)', // Naranja
                    'rgba(255, 235, 59, 0.5)', // Amarillo
                    'rgba(139, 195, 74, 0.5)', // Verde
                    'rgba(205, 220, 57, 0.5)', // Lima
                    'rgba(255, 87, 34, 0.5)', // Naranja Rojizo
                ],
                borderColor: [
                    'rgba(255, 152, 0, 1)', // Naranja
                    'rgba(255, 235, 59, 1)', // Amarillo
                    'rgba(139, 195, 74, 1)', // Verde
                    'rgba(205, 220, 57, 1)', // Lima
                    'rgba(255, 87, 34, 1)', // Naranja Rojizo
                ],
                borderWidth: 1
            }]
        }
    });

    const ingredienteMasVendido = prediccionIngredientes.reduce((max, ingrediente) => ingrediente.cantidad > max.cantidad ? ingrediente : max, prediccionIngredientes[0]);
    document.getElementById('ingredientesMasVendidoTexto').innerText = `El ingrediente más vendido el próximo mes será: ${ingredienteMasVendido.nombre}`;
}

// Función para mostrar las pizzas más vendidas
function mostrarPizzasMasVendidas() {
    const nombresPizzas = pizzasMasVendidas.map(pizza => pizza.nombre);
    const cantidadesPizzas = pizzasMasVendidas.map(pizza => pizza.cantidad);

    const ctx = document.getElementById('pizzasChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresPizzas,
            datasets: [{
                label: 'Cantidad de ventas',
                data: cantidadesPizzas,
                backgroundColor: [
                    'rgba(255, 152, 0, 0.5)', // Naranja
                    'rgba(255, 235, 59, 0.5)', // Amarillo
                    'rgba(139, 195, 74, 0.5)', // Verde
                    'rgba(205, 220, 57, 0.5)', // Lima
                    'rgba(255, 87, 34, 0.5)' // Naranja Rojizo
                ],
                borderColor: [
                    'rgba(255, 152, 0, 1)', // Naranja
                    'rgba(255, 235, 59, 1)', // Amarillo
                    'rgba(139, 195, 74, 1)', // Verde
                    'rgba(205, 220, 57, 1)', // Lima
                    'rgba(255, 87, 34, 1)' // Naranja Rojizo
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const pizzaMasVendida = pizzasMasVendidas.reduce((max, pizza) => pizza.cantidad > max.cantidad ? pizza : max, pizzasMasVendidas[0]);
    document.getElementById('pizzaMasVendidaTexto').innerText = `La pizza más vendida será: ${pizzaMasVendida.nombre}`;
}

// Inicializar las secciones
crearGraficaIngredientes();
mostrarCaloriasPromedio();
mostrarPrediccionIngredientes();
mostrarPizzasMasVendidas();