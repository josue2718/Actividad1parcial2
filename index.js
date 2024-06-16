document.getElementById('Guardartarea').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el envío del formulario

    // Obtener valores del formulario
    var tarea = document.getElementById('tareas').value.trim();
    var fechainicio = document.getElementById('start').value.trim();
    var fechafin = document.getElementById('end').value.trim();
    var responsable = document.getElementById('responsable').value.trim();
    


    // Crear un objeto tarea
    var nuevaTarea = {
        tarea: tarea,
        fechainicio: fechainicio,
        fechafin: fechafin,
        responsable: responsable,
        completed: false,
        vencida: false
    };
    if (fechainicio>fechafin)
        {
            $('#alerta2').fadeIn(); // Mostrar la alerta
        setTimeout(function() {
            $('#alerta2').fadeOut(); // Ocultar la alerta después de 3 segundos
        }, 3000); // 3000 milisegundos = 3 segundos
        }
    else
    {
        $('#alerta3').fadeIn(); // Mostrar la alerta
        setTimeout(function() {
            $('#alerta3').fadeOut(); // Ocultar la alerta después de 3 segundos
        }, 3000); // 3000 milisegundos = 3 segundos
        var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
        listaTareas.push(nuevaTarea);
        localStorage.setItem("listaTareas", JSON.stringify(listaTareas));
        mostrarTareas();
        tareavenciada();
        document.getElementById('Guardartarea').reset();
    }
    
});

// Función para mostrar la lista de tareas en el HTML
function mostrarTareas(filtro = 'todas', textoBusqueda = '') {
    var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
    var listaTareasElement = document.getElementById("listaTareas");

    // Limpiar la lista anterior
    listaTareasElement.innerHTML = "";

    // Filtrar las tareas según el filtro seleccionado
    var tareasFiltradas = listaTareas;
    if (filtro === 'completadas') {
        tareasFiltradas = listaTareas.filter(function(tarea) {
            return tarea.completed;
        });
    } else if (filtro === 'vencidas') {
        tareasFiltradas = listaTareas.filter(function(tarea) {
            return tarea.vencida;
        });
    }

    if (textoBusqueda.trim() !== '') {
        tareasFiltradas = tareasFiltradas.filter(function(tarea) {
            return tarea.tarea.toLowerCase().includes(textoBusqueda.toLowerCase());
        });
    }
    
    tareasFiltradas.forEach(function(tarea, index) {
        var row = document.createElement("tr");
        row.innerHTML = `
        <td style="${tarea.completed ? ' color: #147700f5; text-decoration: line-through ': (tarea.vencida ? 'color: #ff0000bd;' : '')}">${tarea.tarea}</td>
        <td style="${tarea.completed ? ' color: #147700f5; text-decoration: line-through' : (tarea.vencida ? 'color: #ff0000bd;' : '')}">${tarea.fechainicio}</td>
        <td style=" ${tarea.completed ? ' color: #147700f5; text-decoration:line-through' : (tarea.vencida ? 'color: #ff0000bd;' : '')}">${tarea.fechafin}</td>
        <td style="${tarea.completed ? ' color: #147700f5; text-decoration: line-through' : (tarea.vencida ? 'color: #ff0000bd;' : '')}">${tarea.responsable}</td>
        <td style="text-align: right;">
            <button type="button" class="btn btn-outline-primary" onclick="completarTarea(${index})" style="text-decoration: ${tarea.completed ? 'line-through' : 'none'}">Completar</button>
            ${tarea.completed ? `<button type="button" class="btn btn-outline-success" onclick="desmarcarTarea(${index})">Desmarcar</button>` : ''}
            <button type="button" class="btn btn-outline-danger" onclick="eliminarTarea(${index})">Eliminar</button>
        </td>
        `;
        listaTareasElement.appendChild(row);
    });
}

// Función para buscar por nombre de tarea
function buscarPorNombre() {
    var textoBusqueda = document.getElementById('buscarTareaInput').value.trim();
    mostrarTareas('todas', textoBusqueda);
}


function completarTarea(index) {
    var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
    var fechaFinDeLaTarea = new Date(listaTareas[index].fechafin);
    var fechaActual = new Date();
    
    // Comparar las fechas para determinar si se puede completar la tarea
    if (fechaFinDeLaTarea > fechaActual) {
        listaTareas[index].completed = true;
        localStorage.setItem("listaTareas", JSON.stringify(listaTareas));
        mostrarTareas();
    } else {
        $('#alerta').fadeIn(); // Mostrar la alerta
        setTimeout(function() {
            $('#alerta').fadeOut(); // Ocultar la alerta después de 3 segundos
        }, 3000); // 3000 milisegundos = 3 segundos
    }
}

function tareavenciada() {
    var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
    var fechaActual = new Date();
    
    listaTareas.forEach(function(tarea, index) {
        var fechaFinDeLaTarea = new Date(tarea.fechafin);
        
        // Comparar las fechas para determinar si la tarea está vencida
        if (fechaFinDeLaTarea < fechaActual) {
            listaTareas[index].vencida = true;
        } else {
            listaTareas[index].vencida = false;
        }
    });
    
    localStorage.setItem("listaTareas", JSON.stringify(listaTareas));
    mostrarTareas();
}


// Función para desmarcar una tarea
function desmarcarTarea(index) {
    var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
    listaTareas[index].completed = false;
    localStorage.setItem("listaTareas", JSON.stringify(listaTareas));
    mostrarTareas();
}

// Función para eliminar una tarea
function eliminarTarea(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        // Si el usuario confirma, eliminar la tarea
        var listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || [];
        listaTareas.splice(index, 1); // Eliminar tarea de la lista
        localStorage.setItem("listaTareas", JSON.stringify(listaTareas));
        mostrarTareas();
    } else {
        // Si el usuario cancela, no hacer nada
        console.log("Eliminación cancelada");
    }
}



// Mostrar la lista de tareas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarTareas);

// Inicializar el datepicker
$(document).ready(function(){
    $('#start').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
    $('#end').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
    $('.input-group-text').click(function() {
        $(this).prev('input').focus();
    });
});
